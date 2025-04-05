'use client';

import { motion } from 'motion/react';
import { Card } from '@kit/ui/card';
import { Building2, Code2, Users } from 'lucide-react';

interface WorksStatsProps {
  works: Array<{
    category: 'company' | 'freelance' | 'personal';
    technologies: string[];
  }>;
}

export const WorksStats = ({ works }: WorksStatsProps) => {
  // カテゴリーごとのプロジェクト数を計算
  const companyCount = works.filter(
    (work) => work.category === 'company'
  ).length;
  const freelanceCount = works.filter(
    (work) => work.category === 'freelance'
  ).length;
  const personalCount = works.filter(
    (work) => work.category === 'personal'
  ).length;

  // ユニークな技術スタックの数を計算
  const uniqueTechnologies = new Set(works.flatMap((work) => work.technologies))
    .size;

  const stats = [
    {
      label: '企業案件',
      value: companyCount,
      icon: Building2,
      description: '大手企業との取引実績',
    },
    {
      label: 'フリーランス案件',
      value: freelanceCount,
      icon: Users,
      description: 'スタートアップ・中小企業との取引実績',
    },
    {
      label: '個人開発',
      value: personalCount,
      icon: Code2,
      description: 'オープンソース・個人プロジェクト',
    },
    {
      label: '技術スタック',
      value: uniqueTechnologies,
      icon: Code2,
      description: '使用している技術の総数',
    },
  ];

  return (
    <section className="container py-20">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="p-6">
              <div className="space-y-4">
                <div className="p-2 w-fit rounded-lg bg-primary/10">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="text-4xl font-bold">{stat.value}</div>
                  <div className="text-lg font-medium">{stat.label}</div>
                  <div className="text-sm text-muted-foreground">
                    {stat.description}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
