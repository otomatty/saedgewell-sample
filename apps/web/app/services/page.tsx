import type { Metadata } from 'next';
import { ServicesHero } from './_components/services-hero';
import { ServiceCard } from './_components/service-card';
import { ProcessSection } from './_components/process-section';
import { EstimateSection } from './_components/estimate-section';
import { services } from '~/data/services';
import { Container } from '../../components/layout/container';

const processes = [
  {
    step: 1,
    title: 'ヒアリング・要件定義',
    description:
      'プロジェクトの目的、要件、予算、スケジュールなどについて詳しくお伺いします。',
    duration: '1-2週間',
  },
  {
    step: 2,
    title: '設計・提案',
    description:
      'ヒアリングした内容をもとに、システム設計、UI/UX設計、技術選定などを行い、具体的な提案書を作成します。',
    duration: '2-3週間',
  },
  {
    step: 3,
    title: '開発・実装',
    description:
      '承認された設計書に基づいて、実際の開発作業を進めます。定期的な進捗報告と中間デモを行います。',
    duration: 'プロジェクトによる',
  },
  {
    step: 4,
    title: 'テスト・品質確認',
    description:
      '実装したシステムの動作確認、品質チェック、セキュリティテストなどを実施します。',
    duration: '2-3週間',
  },
  {
    step: 5,
    title: 'リリース・納品',
    description:
      '最終確認を経て、本番環境へのデプロイを行います。必要に応じて、運用マニュアルの作成や操作説明も実施します。',
    duration: '1週間',
  },
];

export const metadata: Metadata = {
  title: 'Services',
  description:
    'フリーランスエンジニアとして、Webアプリケーション開発のサービスを提供しています。',
};

export default function ServicesPage() {
  return (
    <>
      <ServicesHero />
      <Container>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </div>
      </Container>
      <ProcessSection processes={processes} />
      <EstimateSection />
    </>
  );
}
