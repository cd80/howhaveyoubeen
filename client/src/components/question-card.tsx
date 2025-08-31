import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RefreshCw, Tag } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface QuestionCardProps {
  questionText: string;
  categoryLabel: string;
  isLoading: boolean;
  onNewQuestion: () => void;
}

export function QuestionCard({ questionText, categoryLabel, isLoading, onNewQuestion }: QuestionCardProps) {
  return (
    <Card className="question-card bg-card border border-border rounded-lg shadow-sm p-8 md:p-12 mb-8 text-center">
      <div className="mb-6">
        <Badge 
          variant="secondary" 
          className="inline-flex items-center space-x-2 bg-secondary rounded-full px-3 py-1 text-xs font-medium text-secondary-foreground mb-4"
          data-testid="badge-category"
        >
          <Tag className="w-3 h-3" />
          <span>{isLoading ? 'Loading...' : categoryLabel}</span>
        </Badge>
      </div>
      
      <div className="question-text mb-8">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-8 w-full max-w-2xl mx-auto" />
            <Skeleton className="h-8 w-3/4 mx-auto" />
          </div>
        ) : (
          <p 
            className="text-2xl md:text-3xl lg:text-4xl font-medium text-foreground leading-relaxed transition-opacity duration-300"
            data-testid="text-question"
          >
            "{questionText}"
          </p>
        )}
      </div>

      <div className="flex justify-center">
        <Button 
          onClick={onNewQuestion}
          disabled={isLoading}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          data-testid="button-new-question"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          <span>Get New Question</span>
        </Button>
      </div>
    </Card>
  );
}
