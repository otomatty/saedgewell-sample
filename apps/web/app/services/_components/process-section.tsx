'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { ProcessCard } from './process-card';
import type { ProcessCardProps } from './process-card';
import { Button } from '@kit/ui/button';
import { ArrowRight } from 'lucide-react';

export interface ProcessSectionProps {
  processes: ProcessCardProps[];
}

export const ProcessSection = ({ processes }: ProcessSectionProps) => {
  return (
    <section className="mb-20">
      <div className="container">
        <div className="flex justify-between items-start mb-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold mb-4">開発プロセス</h2>
            <p className="text-muted-foreground">
              プロジェクトは以下のステップで進めていきます。各ステップで必要な成果物を作成し、お客様との合意を得ながら進行します。
            </p>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Button asChild>
              <Link
                href="/services/process"
                className="flex items-center gap-2"
              >
                詳しく見る
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </motion.div>
        </div>

        <div className="max-w-3xl mx-auto">
          {processes.map((process, index) => (
            <ProcessCard
              key={process.step}
              {...process}
              isLast={index === processes.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
