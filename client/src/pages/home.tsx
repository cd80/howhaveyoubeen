import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { MessageCircle } from "lucide-react";
import { QuestionCard } from "@/components/question-card";
import { FilterControls } from "@/components/filter-controls";
import { QuickActions } from "@/components/quick-actions";
import { 
  LANGUAGES, 
  type LanguageCode, 
  type MoodType, 
  type OccasionType,
  type Question 
} from "@shared/schema";
import { 
  getLanguagePreference, 
  saveLanguagePreference,
  type QuestionFilters 
} from "@/lib/questions";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";

export default function Home() {
  const [language, setLanguage] = useState<LanguageCode>(getLanguagePreference());
  const [filters, setFilters] = useState<QuestionFilters>({
    mood: '',
    occasion: ''
  });
  const [questionKey, setQuestionKey] = useState(0);

  // Fetch random question
  const { data: question, isLoading, error } = useQuery({
    queryKey: ['/api/questions/random', filters, questionKey],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.mood) params.append('mood', filters.mood);
      if (filters.occasion) params.append('occasion', filters.occasion);
      
      const response = await fetch(`/api/questions/random?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch question');
      }
      return response.json() as Promise<Question>;
    },
  });

  // Handle language change
  useEffect(() => {
    saveLanguagePreference(language);
  }, [language]);

  const handleLanguageChange = (newLanguage: LanguageCode) => {
    setLanguage(newLanguage);
  };

  const handleFilterChange = (newFilters: Partial<QuestionFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setQuestionKey(prev => prev + 1); // Trigger new question fetch
  };

  const handleResetFilters = () => {
    setFilters({ mood: '', occasion: '' });
    setQuestionKey(prev => prev + 1);
  };

  const handleNewQuestion = () => {
    setQuestionKey(prev => prev + 1);
  };

  const handleQuickMood = (mood: MoodType) => {
    handleFilterChange({ mood });
  };

  const getQuestionText = () => {
    if (!question) return '';
    const translations = question.translations as Record<string, string>;
    return translations[language] || translations['en'] || '';
  };

  const getCategoryLabel = () => {
    if (!question) return '';
    
    const parts = [];
    if (question.mood) {
      parts.push(question.mood.charAt(0).toUpperCase() + question.mood.slice(1));
    }
    if (question.occasion) {
      const occasionFormatted = question.occasion
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      parts.push(occasionFormatted);
    }
    return parts.join(' • ') || 'Random';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="w-full bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <MessageCircle className="text-primary text-2xl w-6 h-6" />
            <h1 className="text-xl font-semibold text-foreground">How Have You Been?</h1>
          </div>
          
          {/* Language Selector */}
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-4 0 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
            </svg>
            <Select value={language} onValueChange={handleLanguageChange} data-testid="select-language">
              <SelectTrigger className="w-auto border-border bg-card text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Filter Controls */}
        <FilterControls 
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
        />

        {/* Question Display */}
        <QuestionCard
          questionText={getQuestionText()}
          categoryLabel={getCategoryLabel()}
          isLoading={isLoading}
          onNewQuestion={handleNewQuestion}
        />

        {/* Quick Actions */}
        <QuickActions onQuickMood={handleQuickMood} />
        
        <div className="text-center mt-12 mb-8">
          <p className="text-sm text-muted-foreground">
            Perfect for opening meetings, breaking the ice, or just checking in with each other
          </p>
        </div>

      </main>

    </div>
  );
}
