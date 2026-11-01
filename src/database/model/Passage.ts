export const PASSAGE_COLLECTION_NAME = 'passages';

export type PassageLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1';

export interface SentenceItem {
  order: number;
  text: string;
  translation: string;
  word_count: number;
}

export default interface Passage {
  id: string;
  topic_id: string;
  title: string;
  level: PassageLevel;
  default_wpm: number;
  description: string;
  sentences: SentenceItem[];
  total_words: number;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

export type PassageSummary = Omit<Passage, 'sentences'> & {
  sentence_count: number;
  sentences?: SentenceItem[];
};
