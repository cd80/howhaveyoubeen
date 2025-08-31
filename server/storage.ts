import { type Question } from "@shared/schema";
import { readFileSync } from "fs";

export interface IStorage {
  getQuestions(filters?: { mood?: string; occasion?: string }): Promise<Question[]>;
  getRandomQuestion(filters?: { mood?: string; occasion?: string }): Promise<Question | undefined>;
}

export class MemStorage implements IStorage {
  private questions: Question[];

  constructor() {
    this.questions = this.initializeQuestions();
  }

  private initializeQuestions(): Question[] {
    const data = readFileSync(new URL("./questions.json", import.meta.url), "utf-8");
    return JSON.parse(data) as Question[];
  }

  async getQuestions(filters?: { mood?: string; occasion?: string }): Promise<Question[]> {
    let filteredQuestions = this.questions;

    if (filters?.mood) {
      filteredQuestions = filteredQuestions.filter(q => q.mood === filters.mood);
    }

    if (filters?.occasion) {
      filteredQuestions = filteredQuestions.filter(q => q.occasion === filters.occasion);
    }

    return filteredQuestions;
  }

  async getRandomQuestion(filters?: { mood?: string; occasion?: string }): Promise<Question | undefined> {
    const availableQuestions = await this.getQuestions(filters);

    if (availableQuestions.length === 0) {
      return undefined;
    }

    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    return availableQuestions[randomIndex];
  }
}

export const storage = new MemStorage();

