'use client';

import { motion } from 'motion/react';
import Image from 'next/image';

export const AboutHeader = () => {
  return (
    <section className="py-20 bg-secondary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative w-32 h-32 mx-auto mb-8">
              <Image
                src="/images/akimasapf.webp"
                alt="Profile"
                fill
                className="object-cover rounded-full border-solid border-primary/20"
                priority
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">菅井 瑛正</h1>
            <p className="text-xl text-muted-foreground mb-8">
              プロダクトエンジニア / テックリード
            </p>
            <div className="prose prose-lg dark:prose-invert mx-auto">
              <p className="text-left">
                フロントエンドからバックエンド、インフラまで幅広い技術スタックを持つプロダクトエンジニアとして、
                複数のプロジェクトでテックリードを務めてきました。
                ユーザー体験とビジネス価値の向上を常に意識し、技術選定から実装、運用まで一貫して担当しています。
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
