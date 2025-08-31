import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const questions = pgTable("questions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  mood: text("mood").notNull(), // funny, caring, warm, enthusiastic, thoughtful, casual, deep
  occasion: text("occasion"), // first-meetup, blind-date, team-meeting, family-dinner, coffee-chat, work-break, video-call
  translations: jsonb("translations").notNull(), // object with language codes as keys
});

export const insertQuestionSchema = createInsertSchema(questions).pick({
  mood: true,
  occasion: true,
  translations: true,
});

export type InsertQuestion = z.infer<typeof insertQuestionSchema>;
export type Question = typeof questions.$inferSelect;

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Language and filter types
export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'zh', name: '中文 (Chinese)' },
  { code: 'hi', name: 'हिन्दी (Hindi)' },
  { code: 'es', name: 'Español (Spanish)' },
  { code: 'ar', name: 'العربية (Arabic)' },
  { code: 'fr', name: 'Français (French)' },
  { code: 'bn', name: 'বাংলা (Bengali)' },
  { code: 'pt', name: 'Português (Portuguese)' },
  { code: 'ru', name: 'Русский (Russian)' },
  { code: 'id', name: 'Bahasa Indonesia' },
  { code: 'ur', name: 'اردو (Urdu)' },
  { code: 'de', name: 'Deutsch (German)' },
  { code: 'ja', name: '日本語 (Japanese)' },
  { code: 'vi', name: 'Tiếng Việt (Vietnamese)' },
  { code: 'ko', name: '한국어 (Korean)' },
  { code: 'it', name: 'Italiano (Italian)' },
] as const;

export const MOODS = [
  { value: 'funny', label: 'Funny' },
  { value: 'caring', label: 'Caring' },
  { value: 'warm', label: 'Warm' },
  { value: 'enthusiastic', label: 'Enthusiastic' },
  { value: 'thoughtful', label: 'Thoughtful' },
  { value: 'casual', label: 'Casual' },
  { value: 'deep', label: 'Deep' },
] as const;

export const OCCASIONS = [
  { value: 'first-meetup', label: 'First Meetup' },
  { value: 'blind-date', label: 'Blind Date' },
  { value: 'team-meeting', label: 'Team Meeting' },
  { value: 'family-dinner', label: 'Family Dinner' },
  { value: 'coffee-chat', label: 'Coffee Chat' },
  { value: 'work-break', label: 'Work Break' },
  { value: 'video-call', label: 'Video Call' },
] as const;

export type LanguageCode = typeof LANGUAGES[number]['code'];
export type MoodType = typeof MOODS[number]['value'];
export type OccasionType = typeof OCCASIONS[number]['value'];
