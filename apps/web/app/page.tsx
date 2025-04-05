// パッケージ
import type { Metric } from '~/types/metrics';
import { getMetrics } from '~/actions/metric';
import { getFeaturedWorks, getPublishedWorks } from '@kit/next/actions';
// 固有コンポーネント
import { Hero } from './_components/hero';
import { Introduction } from './_components/introduction';
import { Achievements } from './_components/achievements';
import { CTASection } from './_components/cta-section';
import { AdditionalAchievements } from './_components/additional-achievements';
import { ClientGearBackground } from './_components/client-gear-background';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import type { Metadata } from 'next';
// サンプルデータ（本番環境では使用しない）
// import { sampleFeaturedWorks } from './_components/achievements/sample-data';
// import { samplePublishedWorks } from './_components/AdditionalAchievements/sample-data';

// メタデータの定義
export const metadata: Metadata = {
  title: 'Saedgewell | 菅井 瑛正',
  description: '菅井瑛正のホームページです',
};

export default async function HomePage() {
  const metrics: Metric[] = await getMetrics();

  // Supabaseセッション情報を取得してデバッグ用に表示
  const supabase = getSupabaseServerClient();
  const { data: sessionData } = await supabase.auth.getSession();

  // 詳細なセッションログを出力
  console.log('[HomePage] セッション検証', {
    hasSession: !!sessionData.session,
    userId: sessionData.session?.user?.id,
    userEmail: sessionData.session?.user?.email,
    provider: sessionData.session?.user?.app_metadata?.provider,
    expiresAt: sessionData.session?.expires_at,
    environment: process.env.NODE_ENV,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  });

  // 実績データを取得
  const featuredWorks = await getFeaturedWorks();
  const publishedWorks = await getPublishedWorks();

  // 開発用にサンプルデータを使用
  // const featuredWorks = sampleFeaturedWorks;
  // const publishedWorks = samplePublishedWorks;

  return (
    <div className="min-h-screen">
      <ClientGearBackground />
      <Hero />
      <Introduction metrics={metrics} />
      <Achievements works={featuredWorks} />
      <AdditionalAchievements works={publishedWorks} />
      <CTASection />
    </div>
  );
}
