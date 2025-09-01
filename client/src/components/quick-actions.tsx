import { Button } from "@/components/ui/button";
import { Laugh, Heart, User } from "lucide-react";
import { MOODS, type MoodType, type LanguageCode } from "@shared/schema";

interface QuickActionsProps {
  onQuickMood: (mood: MoodType) => void;
  language: LanguageCode;
}

function getLabel(value: MoodType, language: LanguageCode) {
  const mood = MOODS.find(m => m.value === value);
  return mood?.label[language] || mood?.label.en || value;
}

export function QuickActions({ onQuickMood, language }: QuickActionsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-8">
      <Button
        variant="secondary"
        className="bg-secondary hover:bg-secondary/80 text-secondary-foreground px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
        onClick={() => onQuickMood('funny')}
        data-testid="button-quick-funny"
      >
        <Laugh className="w-4 h-4" />
        <span>{getLabel('funny', language)}</span>
      </Button>

      <Button
        variant="secondary"
        className="bg-secondary hover:bg-secondary/80 text-secondary-foreground px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
        onClick={() => onQuickMood('caring')}
        data-testid="button-quick-caring"
      >
        <Heart className="w-4 h-4" />
        <span>{getLabel('caring', language)}</span>
      </Button>

      <Button
        variant="secondary"
        className="bg-secondary hover:bg-secondary/80 text-secondary-foreground px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
        onClick={() => onQuickMood('personal')}
        data-testid="button-quick-personal"
      >
        <User className="w-4 h-4" />
        <span>{getLabel('personal', language)}</span>
      </Button>
    </div>
  );
}
