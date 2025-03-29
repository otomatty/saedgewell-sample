export type ProjectType = 'web' | 'app' | 'other';
export type Deadline = 'asap' | '1month' | '3months' | '6months' | 'flexible';

export interface EstimateFormData {
  projectType: ProjectType;
  description: string;
  deadline: Deadline;
}

export interface AIQuestion {
  id: string;
  question: string;
  type: 'text' | 'radio';
  options?: string[];
  isAnswered: boolean;
  answer: string;
  description: string;
  skipped: boolean;
}

export interface FeatureProposal {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  isRequired: boolean;
  category: string;
  dependencies?: string[]; // 依存する機能のID
}
