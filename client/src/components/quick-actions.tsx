import { Button } from "@/components/ui/button";
import { Laugh, Heart, Brain } from "lucide-react";
import { type MoodType } from "@shared/schema";

interface QuickActionsProps {
  onQuickMood: (mood: MoodType) => void;
}

export function QuickActions({ onQuickMood }: QuickActionsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-8">
      <Button 
        variant="secondary"
        className="bg-secondary hover:bg-secondary/80 text-secondary-foreground px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
        onClick={() => onQuickMood('funny')}
        data-testid="button-quick-funny"
      >
        <Laugh className="w-4 h-4" />
        <span>Funny Question</span>
      </Button>
      
      <Button 
        variant="secondary"
        className="bg-secondary hover:bg-secondary/80 text-secondary-foreground px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
        onClick={() => onQuickMood('caring')}
        data-testid="button-quick-caring"
      >
        <Heart className="w-4 h-4" />
        <span>Caring Question</span>
      </Button>
      
      <Button 
        variant="secondary"
        className="bg-secondary hover:bg-secondary/80 text-secondary-foreground px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
        onClick={() => onQuickMood('deep')}
        data-testid="button-quick-deep"
      >
        <Brain className="w-4 h-4" />
        <span>Deep Question</span>
      </Button>
    </div>
  );
}
