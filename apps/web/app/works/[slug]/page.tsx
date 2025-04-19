import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getWorkBySlug, getWorkSlugsForBuild } from '@kit/next/actions';
import type { WorkWithRelations } from '@kit/types/works';
import type { Database } from '~/lib/database.types';
import { WorkDetailHero } from './_components/work-detail-hero';
import { WorkDetail } from './_components/work-detail';
import { Container } from '../../../components/layout/container';

export const dynamic = 'force-static';
export const dynamicParams = false;

// Database内のTechnology型を定義
type Technology = Database['public']['Tables']['technologies']['Row'];

// technologiesから必要なプロパティだけを抽出する関数
function extractTechnologies(work: WorkWithRelations) {
  return work.work_technologies.map((techRel) => {
    // 必要なプロパティだけを抽出
    return {
      id: techRel.technology_id,
      name: techRel.technology?.name || '',
      category: 'programming', // データベース定義に基づいて追加
      created_at: techRel.created_at,
      updated_at: techRel.updated_at,
    };
  });
}

export async function generateStaticParams() {
  try {
    const works = await getWorkSlugsForBuild();
    return works.map((work) => ({
      slug: work.slug,
    }));
  } catch (error) {
    console.error('Error in generateStaticParams:', error);
    // エラーが発生しても空の配列を返して、ビルドを続行できるようにする
    return [];
  }
}

// 実績データの型定義
interface WorkData {
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

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const workData = await getWorkBySlug(slug);
  const work = Array.isArray(workData) ? workData[0] : workData;

  if (!work) {
    return {
      title: 'Not Found | Saedge Well',
      description: 'ページが見つかりませんでした。',
    };
  }

  return {
    title: `${work.title} | Saedge Well`,
    description: work.description,
    openGraph: {
      title: work.title,
      description: work.description,
      type: 'article',
      publishedTime: work.created_at
        ? new Date(work.created_at).toISOString()
        : undefined,
    },
  };
}

export default async function WorkPage({ params }: PageProps) {
  const { slug } = await params;
  const workData = await getWorkBySlug(slug);
  const work = Array.isArray(workData) ? workData[0] : workData;

  if (!work) {
    notFound();
  }

  // 必要なプロパティだけを抽出
  const technologies = extractTechnologies(work);

  return (
    <main>
      <WorkDetailHero
        title={work.title}
        description={work.description}
        technologies={technologies}
        githubUrl={work.github_url}
        websiteUrl={work.website_url}
      />
      <Container>
        <WorkDetail work={work} />
      </Container>
    </main>
  );
}
