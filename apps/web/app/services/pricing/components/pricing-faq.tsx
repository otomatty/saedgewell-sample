'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@kit/ui/accordion';

export interface FAQ {
  question: string;
  answer: string;
}

export interface PricingFAQProps {
  faqs: FAQ[];
}

export const PricingFAQ = ({ faqs }: PricingFAQProps) => {
  return (
    <section className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-8">よくある質問</h2>
      <Accordion type="single" collapsible className="space-y-4">
        {faqs.map((faq, index) => (
          <AccordionItem key={faq.question} value={`item-${index}`}>
            <AccordionTrigger className="text-left">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};
