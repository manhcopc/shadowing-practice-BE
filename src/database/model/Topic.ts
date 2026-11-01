export const TOPIC_COLLECTION_NAME = 'topics';

export default interface Topic {
  id: string;
  title: string;
  title_vi: string;
  description: string;
  icon: string;
  order: number;
  passage_count: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}
