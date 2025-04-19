'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { Button } from '@kit/ui/button';
import { Card, CardContent } from '@kit/ui/card';
import { Calculator } from 'lucide-react';

export const EstimateSection = () => {
  return (
    <section className="mb-20">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-3xl font-bold mb-4">
                    プロジェクトの見積もり
                  </h2>
                  <p className="text-primary-foreground/90 mb-0 md:mb-4">
                    簡単な質問に答えるだけで、おおよその見積もり金額を算出できます。
                    要件や予算に応じて柔軟に対応いたしますので、まずはお気軽にご確認ください。
                  </p>
                </div>
                <div className="shrink-0">
                  <Button
                    asChild
                    size="lg"
                    variant="secondary"
                    className="group"
                  >
                    <Link
                      href="/services/estimate"
                      className="flex items-center gap-2"
                    >
                      <Calculator className="w-5 h-5 transition-transform group-hover:scale-110" />
                      見積もりを確認する
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};
