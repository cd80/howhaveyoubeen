import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MOODS,
  OCCASIONS,
  type MoodType,
  type OccasionType,
  type LanguageCode,
} from "@shared/schema";
import { type QuestionFilters } from "@/lib/questions";

interface FilterControlsProps {
  filters: QuestionFilters;
  onFilterChange: (filters: Partial<QuestionFilters>) => void;
  onReset: () => void;
  language: LanguageCode;
}

export function FilterControls({ filters, onFilterChange, onReset, language }: FilterControlsProps) {
  return (
    <div className="mb-6 flex justify-center">
      <div className="flex items-center gap-3 text-sm">
        <Select 
          value={filters.mood || 'all'} 
          onValueChange={(value) => onFilterChange({ mood: value === 'all' ? '' : value as MoodType })}
          data-testid="select-mood"
        >
          <SelectTrigger className="w-auto border-border bg-card text-foreground px-3 py-1 h-8">
            <SelectValue placeholder="Any mood" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any mood</SelectItem>
            {MOODS.map((mood) => (
              <SelectItem key={mood.value} value={mood.value}>
                {mood.label[language] || mood.label.en}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <span className="text-muted-foreground">•</span>

        <Select 
          value={filters.occasion || 'all'} 
          onValueChange={(value) => onFilterChange({ occasion: value === 'all' ? '' : value as OccasionType })}
          data-testid="select-occasion"
        >
          <SelectTrigger className="w-auto border-border bg-card text-foreground px-3 py-1 h-8">
            <SelectValue placeholder="Any occasion" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any occasion</SelectItem>
            {OCCASIONS.map((occasion) => (
              <SelectItem key={occasion.value} value={occasion.value}>
                {occasion.label[language] || occasion.label.en}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {(filters.mood || filters.occasion) && (
          <Button 
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 h-6"
            data-testid="button-reset-filters"
          >
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
