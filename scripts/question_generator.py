#!/usr/bin/env python3
"""Generate conversation questions using the OpenAI API.

This script can either create a full data set of questions or generate
additional questions for new moods or occasions. It requests up to 100
questions per API call and ensures an even distribution across moods and
occasions. A progress bar is displayed during generation and the
estimated API cost is printed based on token usage.
"""

import argparse
import itertools
import json
from pathlib import Path
from typing import List, Dict, Tuple

from openai import OpenAI
from tqdm import tqdm

LANGUAGES = [
    "en",
    "zh",
    "hi",
    "es",
    "ar",
    "fr",
    "bn",
    "pt",
    "ru",
    "id",
    "ur",
    "de",
    "ja",
    "vi",
    "ko",
    "it",
]

MOOD_DESCRIPTIONS = {
    "caring": "empathetic and supportive",
    "funny": "light-hearted and humorous",
    "enthusiastic": "energetic and positive",
    "respectful": "courteous and considerate",
    "personal": "intimate and self-reflective",
}

OCCASION_DESCRIPTIONS = {
    "regular-meeting": "routine team meeting",
    "team-ot": "team orientation for new members joining the team",
    "blind-date": "first meeting between two people who haven't met",
    "social-gathering": "casual party or group hangout",
}

DEFAULT_MOODS = [
    "caring",
    "funny",
    "enthusiastic",
    "respectful",
    "personal",
]

DEFAULT_OCCASIONS = [
    "regular-meeting",
    "team-ot",
    "blind-date",
    "social-gathering",
]


def adjust_total(total: int, moods: List[str], occasions: List[str]) -> int:
    """Increase total so it divides evenly across mood/occasion pairs."""
    combo = len(moods) * len(occasions)
    if total % combo != 0:
        total += combo - (total % combo)
    return total


def build_pairs(moods: List[str], occasions: List[str], total: int) -> List[Dict[str, str]]:
    combos = list(itertools.product(moods, occasions))
    per_combo = total // len(combos)
    pairs: List[Dict[str, str]] = []
    for mood, occasion in combos:
        for _ in range(per_combo):
            pairs.append({"mood": mood, "occasion": occasion})
    return pairs


def generate_batch(
    client: OpenAI, pairs: List[Dict[str, str]]
) -> Tuple[List[Dict], int, int, int]:
    pairs_text = "\n".join(
        f"{i+1}. Mood: {p['mood']}, Occasion: {p['occasion']}" for i, p in enumerate(pairs)
    )
    mood_def = "\n".join(f"- {m}: {d}" for m, d in MOOD_DESCRIPTIONS.items())
    occ_def = "\n".join(f"- {o}: {d}" for o, d in OCCASION_DESCRIPTIONS.items())
    prompt = f"""
You are an assistant that creates thoughtful, culturally aware conversation starter questions.

Use the following definitions for mood and occasion codes:
Moods:
{mood_def}
Occasions:
{occ_def}

For each of the numbered mood and occasion pairs below, write one short question that matches the mood and suits the occasion.
Return only valid JSON: an array where each element has
  - "mood" (the mood code)
  - "occasion" (the occasion code)
  - "translations": an object with translations for the languages {', '.join(LANGUAGES)}
Do not include any extra commentary.
Pairs:
{pairs_text}
"""
    response = client.chat.completions.create(
        model="gpt-5",
        messages=[{"role": "user", "content": prompt}],
    )
    try:
        questions = json.loads(response.choices[0].message.content)
    except json.JSONDecodeError as exc:
        raise RuntimeError("Model returned invalid JSON") from exc

    usage = getattr(response, "usage", None)
    prompt_tokens = getattr(usage, "prompt_tokens", 0) if usage else 0
    details = getattr(usage, "prompt_tokens_details", None) if usage else None
    cached_tokens = getattr(details, "cached_tokens", 0) if details else 0
    completion_tokens = getattr(usage, "completion_tokens", 0) if usage else 0

    return questions, prompt_tokens - cached_tokens, cached_tokens, completion_tokens


def assign_ids(existing: List[Dict], new: List[Dict]) -> List[Dict]:
    last = 0
    for q in existing:
        try:
            last = max(last, int(str(q.get("id", "")).lstrip("q")))
        except ValueError:
            continue
    for i, q in enumerate(new, start=last + 1):
        q["id"] = f"q{i}"
    return existing + new


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate question data")
    parser.add_argument("--api-key", required=True, help="OpenAI API key")
    parser.add_argument("--total", type=int, required=True, help="Total questions to generate")
    parser.add_argument("--mode", choices=["full", "specific"], default="full")
    parser.add_argument("--moods", nargs="*", help="Moods to include")
    parser.add_argument("--occasions", nargs="*", help="Occasions to include")
    parser.add_argument(
        "--output",
        default="server/questions.json",
        help="Path to questions.json",
    )
    args = parser.parse_args()

    moods = args.moods if args.moods else DEFAULT_MOODS
    occasions = args.occasions if args.occasions else DEFAULT_OCCASIONS

    total = adjust_total(args.total, moods, occasions)
    pairs = build_pairs(moods, occasions, total)

    client = OpenAI(api_key=args.api_key)

    questions: List[Dict] = []
    total_prompt_tokens = 0
    total_cached_prompt_tokens = 0
    total_completion_tokens = 0

    for i in tqdm(range(0, len(pairs), 100), desc="Generating", unit="batch"):
        batch = pairs[i : i + 100]
        batch_questions, prompt_tokens, cached_tokens, completion_tokens = generate_batch(
            client, batch
        )
        questions.extend(batch_questions)
        total_prompt_tokens += prompt_tokens
        total_cached_prompt_tokens += cached_tokens
        total_completion_tokens += completion_tokens

    COST_PER_PROMPT_TOKEN = 1.25 / 100_000_000
    COST_PER_CACHED_PROMPT_TOKEN = 0.125 / 100_000_000
    COST_PER_COMPLETION_TOKEN = 10.0 / 100_000_000
    total_cost = (
        total_prompt_tokens * COST_PER_PROMPT_TOKEN
        + total_cached_prompt_tokens * COST_PER_CACHED_PROMPT_TOKEN
        + total_completion_tokens * COST_PER_COMPLETION_TOKEN
    )

    output_path = Path(args.output)
    if args.mode == "specific" and output_path.exists():
        existing = json.loads(output_path.read_text())
    else:
        existing = []

    all_questions = assign_ids(existing, questions)
    output_path.write_text(json.dumps(all_questions, ensure_ascii=False, indent=2))
    print(f"Wrote {len(all_questions)} questions to {output_path}")
    print(
        "Prompt tokens: {} (cached: {}), Completion tokens: {}, Estimated cost: ${:.6f}".format(
            total_prompt_tokens, total_cached_prompt_tokens, total_completion_tokens, total_cost
        )
    )


if __name__ == "__main__":
    main()
