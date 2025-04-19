'use client';

import { PricingCard } from './pricing-card';

export interface PricingItem {
  name: string;
  description: string;
  basePrice: string;
  period: string;
  features: string[];
  note: string;
}

export interface PricingSectionProps {
  category: string;
  items: PricingItem[];
}

export const PricingSection = ({ category, items }: PricingSectionProps) => {
  return (
    <section className="mb-20">
      <h2 className="text-3xl font-bold mb-8">{category}</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, index) => (
          <PricingCard key={item.name} {...item} index={index} />
        ))}
      </div>
    </section>
  );
};
