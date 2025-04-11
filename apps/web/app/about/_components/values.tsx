'use client';

import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import { Heart, Lightbulb, Target, Users2 } from 'lucide-react';
import { SectionTitle } from '@kit/ui/section-title';
const values = [
  {
    icon: Heart,
    title: '品質へのこだわり',
    description:
      'クリーンなコードと高いパフォーマンスを追求し、ユーザー体験の向上に貢献します。',
  },
  {
    icon: Lightbulb,
    title: '技術革新',
    description:
      '常に新しい技術やベストプラクティスを学び、プロジェクトに最適なソリューションを提供します。',
  },
  {
    icon: Users2,
    title: 'チームワーク',
    description:
      'オープンなコミュニケーションと知識共有を大切にし、チーム全体の成長を促進します。',
  },
  {
    icon: Target,
    title: '目標達成',
    description:
      'ビジネス目標を理解し、技術で課題を解決することで、プロジェクトの成功に貢献します。',
  },
];

export const Values = () => {
  return (
    <section className="py-20 bg-secondary/5">
      <div className="container mx-auto px-4">
        <SectionTitle
          title="価値観"
          subtitle="エンジニアとしての信念と大切にしている価値観を表示します。"
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mx-auto">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full">
                <CardHeader>
                  <value.icon className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
