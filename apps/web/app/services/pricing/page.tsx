import type { Metadata } from 'next';
import { BasicHero } from '@kit/ui/basic-hero';
import { PricingSection } from './components/pricing-section';
import { PricingFAQ } from './components/pricing-faq';
import { MonthlyPlanSection } from './components/monthly-plan-section';
import { DXPartnershipSection } from './components/dx-partnership-section';
import { Container } from '../../../components/layout/container';
import {
  deliverables,
  faqs,
  monthlyPlans,
  monthlyPlanNotes,
  dxPartnership,
} from '~/data/pricing';

export const metadata: Metadata = {
  title: '料金',
  description: 'プロジェクト別料金目安と月額契約プランをご確認いただけます。',
};

export default function PricingPage() {
  return (
    <>
      <BasicHero
        title="料金"
        description="プロジェクト別料金目安と月額契約プランをご確認いただけます。"
        pattern="dots"
        size="lg"
      />
      <Container className="max-w-7xl">
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8">プロジェクト別 料金目安</h2>
          <p className="text-muted-foreground mb-12 max-w-4xl">
            お客様の多様なニーズにお応えするため、様々なWebサイト・アプリケーション開発に対応しています。
            以下は代表的なプロジェクトの料金目安です。
            <br />
            詳細はお打ち合わせの上、個別にお見積もりいたします。
          </p>

          {deliverables.map((category) => (
            <PricingSection
              key={category.category}
              category={category.category}
              items={category.items}
            />
          ))}
        </section>

        <MonthlyPlanSection plans={monthlyPlans} notes={monthlyPlanNotes} />

        <DXPartnershipSection data={dxPartnership} />

        <PricingFAQ faqs={faqs} />
      </Container>
    </>
  );
}
