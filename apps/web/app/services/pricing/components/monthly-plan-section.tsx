'use client';

import { MonthlyPlanTable } from './monthly-plan-table';
import { MonthlyPlanNotes } from './monthly-plan-notes';
import type { MonthlyPlan } from '~/data/pricing';

export interface MonthlyPlanSectionProps {
  plans: MonthlyPlan[];
  notes: {
    common: string[];
    partnerPlan: string;
    disclaimer: string;
  };
}

export const MonthlyPlanSection = ({
  plans,
  notes,
}: MonthlyPlanSectionProps) => {
  return (
    <section className="mb-20">
      <h2 className="text-3xl font-bold mb-4">
        月額契約プラン（技術顧問 / 開発パートナー）
      </h2>
      <p className="text-muted-foreground mb-8">
        お客様のビジネスに深く関与し、技術的な側面から事業成長を継続的にサポートするプランです。
        <br />
        単なる保守運用に留まらず、
        <span className="font-semibold">
          貴社の外部パートナー・技術顧問として
        </span>
        、システムの開発、改善、さらにはITチームの育成支援まで、柔軟に対応いたします。（※ご契約時間内での対応となります）
      </p>

      <MonthlyPlanTable plans={plans} />
      <MonthlyPlanNotes
        common={notes.common}
        partnerPlan={notes.partnerPlan}
        disclaimer={notes.disclaimer}
      />
    </section>
  );
};
