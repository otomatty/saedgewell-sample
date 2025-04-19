'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Input } from '@kit/ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@kit/ui/accordion';

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
}

export const FaqAccordion = ({ items }: FaqAccordionProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = items.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <Input
        type="search"
        placeholder="質問を検索..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="max-w-md"
      />
      <AnimatePresence mode="wait">
        <motion.div
          key={searchQuery}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {filteredItems.length > 0 ? (
            <Accordion type="single" collapsible className="space-y-4">
              {filteredItems.map((item, index) => (
                <AccordionItem key={item.question} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    <div className="flex flex-col gap-2">
                      <span className="text-sm text-muted-foreground">
                        {item.category}
                      </span>
                      <h3 className="font-semibold">{item.question}</h3>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {item.answer}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <p className="text-center text-muted-foreground">
              該当する質問が見つかりませんでした。
            </p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
