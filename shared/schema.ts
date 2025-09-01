import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const questions = pgTable("questions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  mood: text("mood").notNull(), // caring, funny, enthusiastic, respectful, personal
  occasion: text("occasion"), // regular-meeting, team-ot (team orientation), blind-date, social-gathering
  translations: jsonb("translations").notNull(), // object with language codes as keys
});

export const insertQuestionSchema = createInsertSchema(questions).pick({
  mood: true,
  occasion: true,
  translations: true,
});

export type InsertQuestion = z.infer<typeof insertQuestionSchema>;
export type Question = typeof questions.$inferSelect;

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
  {
    value: 'caring',
    label: {
      en: 'Caring',
      zh: '体贴',
      hi: 'स्नेहपूर्ण',
      es: 'Cariñoso',
      ar: 'حنون',
      fr: 'Attentionné',
      bn: 'স্নেহশীল',
      pt: 'Carinhoso',
      ru: 'Заботливый',
      id: 'Peduli',
      ur: 'خیال رکھنے والا',
      de: 'Fürsorglich',
      ja: '思いやりのある',
      vi: 'Quan tâm',
      ko: '배려심 있는',
      it: 'Premuroso',
    },
  },
  {
    value: 'funny',
    label: {
      en: 'Funny',
      zh: '幽默',
      hi: 'मज़ेदार',
      es: 'Divertido',
      ar: 'مضحك',
      fr: 'Drôle',
      bn: 'মজার',
      pt: 'Engraçado',
      ru: 'Смешной',
      id: 'Lucu',
      ur: 'مزاحیہ',
      de: 'Witzig',
      ja: '面白い',
      vi: 'Hài hước',
      ko: '웃긴',
      it: 'Divertente',
    },
  },
  {
    value: 'enthusiastic',
    label: {
      en: 'Enthusiastic',
      zh: '热情',
      hi: 'उत्साही',
      es: 'Entusiasta',
      ar: 'متحمس',
      fr: 'Enthousiaste',
      bn: 'উৎসাহী',
      pt: 'Entusiasmado',
      ru: 'Увлечённый',
      id: 'Antusias',
      ur: 'پرجوش',
      de: 'Begeistert',
      ja: '熱心な',
      vi: 'Nhiệt tình',
      ko: '열정적인',
      it: 'Entusiasta',
    },
  },
  {
    value: 'respectful',
    label: {
      en: 'Respectful',
      zh: '尊重',
      hi: 'आदरपूर्ण',
      es: 'Respetuoso',
      ar: 'محترم',
      fr: 'Respectueux',
      bn: 'শ্রদ্ধাশীল',
      pt: 'Respeitoso',
      ru: 'Уважительный',
      id: 'Penuh hormat',
      ur: 'باادب',
      de: 'Respektvoll',
      ja: '礼儀正しい',
      vi: 'Lịch sự',
      ko: '예의 바른',
      it: 'Rispettoso',
    },
  },
  {
    value: 'personal',
    label: {
      en: 'Personal',
      zh: '私人的',
      hi: 'निजी',
      es: 'Personal',
      ar: 'شخصي',
      fr: 'Personnel',
      bn: 'ব্যক্তিগত',
      pt: 'Pessoal',
      ru: 'Личный',
      id: 'Pribadi',
      ur: 'ذاتی',
      de: 'Persönlich',
      ja: '個人的',
      vi: 'Cá nhân',
      ko: '개인적인',
      it: 'Personale',
    },
  },
] as const;

export const OCCASIONS = [
  {
    value: 'regular-meeting',
    label: {
      en: 'Regular Meeting',
      zh: '例会',
      hi: 'नियमित बैठक',
      es: 'Reunión regular',
      ar: 'اجتماع منتظم',
      fr: 'Réunion régulière',
      bn: 'নিয়মিত সভা',
      pt: 'Reunião regular',
      ru: 'Регулярная встреча',
      id: 'Rapat rutin',
      ur: 'باقاعدہ اجلاس',
      de: 'Regelmäßiges Treffen',
      ja: '定例会議',
      vi: 'Cuộc họp thường kỳ',
      ko: '정기 회의',
      it: 'Riunione periodica',
    },
  },
  {
    value: 'team-ot',
    label: {
      en: 'Team Orientation',
      zh: '团队迎新',
      hi: 'टीम परिचय',
      es: 'Orientación del equipo',
      ar: 'توجيه الفريق',
      fr: "Intégration d'équipe",
      bn: 'দলের পরিচিতি',
      pt: 'Orientação da equipe',
      ru: 'Вводная встреча команды',
      id: 'Orientasi tim',
      ur: 'ٹیم تعارفی اجلاس',
      de: 'Teameinführung',
      ja: 'チームオリエンテーション',
      vi: 'Định hướng nhóm',
      ko: '팀 오리엔테이션',
      it: 'Orientamento del team',
    },
  },
  {
    value: 'blind-date',
    label: {
      en: 'Blind Date',
      zh: '相亲',
      hi: 'ब्लाइंड डेट',
      es: 'Cita a ciegas',
      ar: 'موعد تعارف',
      fr: "Rendez-vous à l'aveugle",
      bn: 'ব্লাইন্ড ডেট',
      pt: 'Encontro às cegas',
      ru: 'Свидание вслепую',
      id: 'Kencan buta',
      ur: 'بلائنڈ ڈیٹ',
      de: 'Blind Date',
      ja: 'ブラインドデート',
      vi: 'Buổi hẹn hò giấu mặt',
      ko: '소개팅',
      it: 'Appuntamento al buio',
    },
  },
  {
    value: 'social-gathering',
    label: {
      en: 'Social Gathering',
      zh: '社交聚会',
      hi: 'सामाजिक समागम',
      es: 'Reunión social',
      ar: 'تجمع اجتماعي',
      fr: 'Rassemblement social',
      bn: 'সামাজিক সমাবেশ',
      pt: 'Encontro social',
      ru: 'Социальная встреча',
      id: 'Acara sosial',
      ur: 'سماجی اجتماع',
      de: 'Geselliges Treffen',
      ja: '交流会',
      vi: 'Buổi giao lưu',
      ko: '사교 모임',
      it: 'Incontro sociale',
    },
  },
] as const;

export type LanguageCode = typeof LANGUAGES[number]['code'];
export type MoodType = typeof MOODS[number]['value'];
export type OccasionType = typeof OCCASIONS[number]['value'];
