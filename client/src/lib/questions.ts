import { LANGUAGES, MOODS, OCCASIONS, type LanguageCode, type MoodType, type OccasionType } from "@shared/schema";

export { LANGUAGES, MOODS, OCCASIONS };
export type { LanguageCode, MoodType, OccasionType };

export interface QuestionFilters {
  mood?: MoodType | '';
  occasion?: OccasionType | '';
}

export const DEFAULT_LANGUAGE: LanguageCode = 'en';

export const getLanguageDisplayName = (code: LanguageCode): string => {
  const lang = LANGUAGES.find(l => l.code === code);
  return lang?.name || code;
};

export const getMoodDisplayName = (mood: MoodType): string => {
  const moodObj = MOODS.find(m => m.value === mood);
  return moodObj?.label || mood;
};

export const getOccasionDisplayName = (occasion: OccasionType): string => {
  const occasionObj = OCCASIONS.find(o => o.value === occasion);
  return occasionObj?.label || occasion;
};

// Local storage helpers
export const saveLanguagePreference = (language: LanguageCode) => {
  try {
    localStorage.setItem('preferredLanguage', language);
  } catch (error) {
    console.warn('Failed to save language preference:', error);
  }
};

export const getLanguagePreference = (): LanguageCode => {
  try {
    const saved = localStorage.getItem('preferredLanguage') as LanguageCode;
    if (saved && LANGUAGES.find(l => l.code === saved)) {
      return saved;
    }
  } catch (error) {
    console.warn('Failed to load language preference:', error);
  }
  return DEFAULT_LANGUAGE;
};
