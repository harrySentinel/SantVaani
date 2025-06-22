export interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  user_id?: string;
}

export interface ChatSession {
  id: string;
  user_id?: string;
  created_at: Date;
  updated_at: Date;
}