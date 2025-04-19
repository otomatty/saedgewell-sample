export interface Work {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail_url: string | null;
  github_url: string | null;
  website_url: string | null;
  category: 'company' | 'freelance' | 'personal';
  status: 'draft' | 'published' | 'featured' | 'archived';
  created_at: string | null;
  updated_at: string | null;
}

// 実績の詳細情報
export interface WorkDetail {
  id: string;
  work_id: string;
  overview: string;
  role: string;
  period: string;
  team_size: string;
  created_at: string | null;
  updated_at: string | null;
}

// 実績の画像
export interface WorkImage {
  id: string;
  work_id: string;
  url: string;
  alt: string;
  caption: string | null;
  sort_order: number;
  created_at: string | null;
  updated_at: string | null;
}

// 実績の担当業務
export interface WorkResponsibility {
  id: string;
  work_id: string;
  description: string;
  sort_order: number;
  created_at: string | null;
  updated_at: string | null;
}

// 実績の課題
export interface WorkChallenge {
  id: string;
  work_id: string;
  title: string;
  description: string;
  sort_order: number;
  created_at: string | null;
  updated_at: string | null;
}

// 実績の解決策
export interface WorkSolution {
  id: string;
  work_id: string;
  challenge_id: string | null;
  description: string;
  sort_order: number;
  created_at: string | null;
  updated_at: string | null;
}

// 実績の成果
export interface WorkResult {
  id: string;
  work_id: string;
  description: string;
  sort_order: number;
  created_at: string | null;
  updated_at: string | null;
}

// 技術スタック
export interface Technology {
  id: string;
  name: string;
  description: string | null;
  icon_url: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface WorkTechnology {
  id: string;
  work_id: string;
  technology_id: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface WorkTechnologyWithRelations extends WorkTechnology {
  technology: Technology;
}

// フィルター用の型
export interface WorksFilter {
  status?: Work['status'] | 'all';
  category?: Work['category'] | 'all';
  query?: string;
}

// 実績表示用の型定義
export interface FeaturedWork {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  category: 'company' | 'freelance' | 'personal';
  github_url: string | null;
  website_url: string | null;
  details: {
    overview: string;
    role: string;
    period: string;
    team_size: string;
    technologies: string[];
    challenges: string[];
    solutions: string[];
    results: string[];
  };
}

// 実績データの型定義
export interface WorkData {
  title: string;
  description: string;
  thumbnail: string;
  technologies: string[];
  category: 'company' | 'freelance' | 'personal';
  slug: string;
  links?: {
    github?: string;
    website?: string;
  };
  overview: string;
  role: string;
  period: string;
  teamSize: string;
  responsibilities: string[];
  challenges: {
    title: string;
    description: string;
  }[];
  solutions: {
    title: string;
    description: string;
  }[];
  results: string[];
  images: {
    url: string;
    alt: string;
    caption?: string;
  }[];
}

// 拡張された型定義
export interface WorkWithRelations extends Work {
  work_details: WorkDetail[];
  work_images: WorkImage[];
  work_responsibilities: WorkResponsibility[];
  work_challenges: WorkChallenge[];
  work_solutions: WorkSolution[];
  work_results: WorkResult[];
  work_technologies: WorkTechnologyWithRelations[];
}
