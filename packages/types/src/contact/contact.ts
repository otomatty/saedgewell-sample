export interface Category {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  created_at: string | null;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface Faq {
  id: string;
  category_id: string;
  question: string;
  answer: string;
  created_at: string | null;
}

export interface ChatMessage {
  id: string;
  chat_id: string;
  message_text: string;
  sender_type: string;
  faq_id: string | null;
  is_escalation_request: boolean;
  timestamp: string | null;
  files?: {
    id: string;
    name: string;
    url: string;
  }[];
}

export interface Chat {
  id: string;
  category_id: string;
  profile_id: string;
  page_url: string | null;
  status: string;
  created_at: string | null;
  messages: ChatMessage[];
}

export interface File {
  id: string;
  message_id: string;
  file_name: string;
  file_url: string;
  file_size: number;
  mime_type: string;
  created_at: string | null;
}
