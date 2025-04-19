'use client';

import { motion } from 'motion/react';
import { Card, CardContent } from '@kit/ui/card';
import { Badge } from '@kit/ui/badge';
import { Code2, Database, Layout, Server } from 'lucide-react';
import { SectionTitle } from '@kit/ui/section-title';

const techStacks = [
  {
    category: 'フロントエンド',
    icon: Layout,
    technologies: [
      { name: 'Next.js', level: 'エキスパート' },
      { name: 'React', level: 'エキスパート' },
      { name: 'TypeScript', level: 'エキスパート' },
      { name: 'Tailwind CSS', level: 'エキスパート' },
      { name: 'Framer Motion', level: '上級' },
      { name: 'shadcn/ui', level: '上級' },
      { name: 'Jotai', level: '上級' },
    ],
  },
  {
    category: 'バックエンド',
    icon: Server,
    technologies: [
      { name: 'Node.js', level: 'エキスパート' },
      { name: 'Python', level: '上級' },
      { name: 'FastAPI', level: '上級' },
      { name: 'Express', level: '上級' },
      { name: 'GraphQL', level: '中級' },
      { name: 'tRPC', level: '中級' },
    ],
  },
  {
    category: 'データベース',
    icon: Database,
    technologies: [
      { name: 'PostgreSQL', level: '上級' },
      { name: 'Supabase', level: '上級' },
      { name: 'Prisma', level: '上級' },
      { name: 'MongoDB', level: '中級' },
      { name: 'Redis', level: '中級' },
    ],
  },
  {
    category: '開発ツール',
    icon: Code2,
    technologies: [
      { name: 'Git', level: 'エキスパート' },
      { name: 'Docker', level: '上級' },
      { name: 'Kubernetes', level: '中級' },
      { name: 'CI/CD', level: '上級' },
      { name: 'AWS', level: '上級' },
      { name: 'Cloudflare', level: '上級' },
    ],
  },
];

const getBadgeVariant = (level: string) => {
  switch (level) {
    case 'エキスパート':
      return 'default';
    case '上級':
      return 'secondary';
    default:
      return 'outline';
  }
};

export const TechStack = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <SectionTitle
          title="技術スタック"
          subtitle="実務で使用している技術一覧を表示します。"
        />

        <div className="grid md:grid-cols-2 gap-4 mx-auto">
          {techStacks.map((stack, stackIndex) => (
            <motion.div
              key={stack.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: stackIndex * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <stack.icon className="h-6 w-6 text-primary" />
                    <h3 className="text-xl font-semibold">{stack.category}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {stack.technologies.map((tech) => (
                      <Badge
                        key={tech.name}
                        variant={getBadgeVariant(tech.level)}
                        className="text-sm"
                      >
                        {tech.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
