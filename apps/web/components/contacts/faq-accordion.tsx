'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@kit/ui/accordion';
import { cn } from '@kit/ui/utils';
import { Markdown } from '@kit/ui/markdown';

export interface FAQ {
  /**
   * FAQの一意のID
   */
  id: string;
  /**
   * 質問
   */
  question: string;
  /**
   * 回答（Markdown形式）
   */
  answer: string;
}

export interface FAQAccordionProps {
  /**
   * FAQのリスト
   */
  faqs: FAQ[];
  /**
   * 追加のクラス名
   */
  className?: string;
  /**
   * FAQがクリックされた時のコールバック
   */
  onFAQClick?: (faq: FAQ) => void;
}

export const FAQAccordion = ({
  faqs,
  className,
  onFAQClick,
}: FAQAccordionProps) => {
  if (faqs.length === 0) return null;

  return (
    <div className={cn('w-full', className)}>
      <h3 className="mb-4 text-lg font-semibold">関連するFAQ</h3>
      <Accordion type="multiple" className="w-full">
        {faqs.map((faq) => (
          <AccordionItem key={faq.id} value={faq.id}>
            <AccordionTrigger
              onClick={() => onFAQClick?.(faq)}
              className="text-left"
            >
              {faq.question}
            </AccordionTrigger>
            <AccordionContent>
              <Markdown content={faq.answer} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
