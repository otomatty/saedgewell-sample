'use client';

import { motion } from 'motion/react';
import { Card, CardContent } from '@kit/ui/card';
import { Building2, GraduationCap, Trophy } from 'lucide-react';
import { SectionTitle } from '@kit/ui/section-title';

const careers = [
  {
    id: 1,
    year: '2024',
    title: 'フリーランスエンジニアとして独立',
    description:
      'Web開発を中心に、複数のプロジェクトに参画。技術顧問としても活動。',
    icon: Building2,
  },
  {
    id: 2,
    year: '2022 - 2023',
    title: '株式会社XXX テックリード',
    description:
      'プロジェクトのテックリードとして、アーキテクチャ設計や技術選定を担当。チームのマネジメントも実施。',
    icon: Building2,
  },
  {
    id: 3,
    year: '2019 - 2022',
    title: '株式会社YYY シニアエンジニア',
    description:
      'プロダクトエンジニアとして、複数のプロジェクトに参画。新規サービスの立ち上げも経験。',
    icon: Building2,
  },
  {
    id: 4,
    year: '2019',
    title: '情報処理安全確保支援士 取得',
    description: 'セキュリティ分野のスキルを強化し、資格を取得。',
    icon: Trophy,
  },
  {
    id: 5,
    year: '2019',
    title: 'XX大学大学院 修了',
    description: '情報工学専攻 修士課程修了',
    icon: GraduationCap,
  },
];

export const Career = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <SectionTitle
            title="経歴"
            subtitle="プロダクトエンジニアとしての経歴を表示します。"
          />
          <div className="space-y-8">
            {careers.map((career, index) => (
              <motion.div
                key={career.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="shrink-0">
                        <career.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">
                          {career.year}
                        </div>
                        <h3 className="text-lg font-semibold mb-2">
                          {career.title}
                        </h3>
                        <p className="text-muted-foreground">
                          {career.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
