'use client';

import { motion } from 'motion/react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import {
  PersonIcon,
  StackIcon,
  CodeIcon,
  FileTextIcon,
  GitHubLogoIcon,
  TextIcon,
} from '@radix-ui/react-icons';
import { Notebook, Telescope } from 'lucide-react';
// Utils
import { cn } from '@kit/ui/utils';
// Types
import type { Metric } from '~/types/metrics';
// Components
import { BentoGrid, MagicBentoCard } from '@kit/ui/bento-grid';
import { SectionTitle } from '@kit/ui/section-title';
import { FlickeringGrid } from '@kit/ui/flickering-grid';
import { GridPattern } from '@kit/ui/grid-pattern';
import { ShippoPattern } from '@kit/ui/shippo-pattern';
import { SeigaihaPattern } from '@kit/ui/seigaiha-pattern';
import { DotPattern } from '@kit/ui/dot-pattern';
import { Ripple } from '@kit/ui/ripple';
import { Particles } from '@kit/ui/particles';
// 固有コンポーネント
import { TechStackGrid } from './tech-stack-grid';
import { NumberDisplay } from './number-display';
import { GitHubImages } from './github-images';

interface IntroductionProps {
  metrics: Metric[];
}

/**
 * イントロダクションセクション
 * BentoGridを使用してプロフィール情報を表示
 */
export const Introduction: React.FC<IntroductionProps> = ({ metrics }) => {
  const { resolvedTheme } = useTheme();

  // metricsから必要なデータを抽出
  const developmentExperience =
    metrics.find((m) => m.type === 'development_experience')?.value || 0;
  const projectCount =
    metrics.find((m) => m.type === 'project_count')?.value || 0;
  const articleCount =
    metrics.find((m) => m.type === 'article_count')?.value || 0;
  const personalProjectCount =
    metrics.find((m) => m.type === 'personal_project_count')?.value || 0;

  const cards = [
    // プロフィールカード（左上）
    {
      name: 'Akimasa Sugai',
      className: 'col-span-12 row-span-2 lg:col-span-8',
      background: (
        <div className="relative w-full h-full min-h-[300px] md:min-h-[400px]">
          <Image
            src="/images/profile.webp"
            alt="Profile"
            fill
            className="object-contain object-right-bottom grayscale transition-all duration-300 group-hover:scale-105 absolute z-30"
            priority
          />
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-background/80 to-transparent" />
          <FlickeringGrid
            className="relative inset-0 z-0 [mask-image:radial-gradient(450px_circle_at_center,white,transparent)]"
            squareSize={4}
            gridGap={6}
            color="#D0A900"
            maxOpacity={0.5}
            flickerChance={0.1}
            height={800}
            width={800}
          />
          <p className="absolute top-1/4 line-height-tight left-8 -translate-y-1/2 text-6xl md:text-9xl text-primary font-bold font-[inter]">
            Sugai
          </p>
          <p className="absolute top-2/3 line-height-tight left-8 -translate-y-1/2 text-6xl md:text-9xl text-primary font-bold font-[inter] z-40">
            Akimasa
          </p>
        </div>
      ),
      Icon: PersonIcon,
      description:
        'フロントエンドからバックエンド、インフラまで幅広い技術スタックを活用し、ビジネスの成長に貢献するソリューションを提供しています。',
      href: '/about',
      cta: '詳細プロフィール',
    },
    // 数値カード群
    {
      name: '開発経験',
      className:
        'col-span-6 md:col-start-1 md:col-span-3 lg:col-start-9 lg:col-span-2',
      background: (
        <div className="relative w-full h-full min-h-[150px]">
          <NumberDisplay value={developmentExperience} unit="年" />
          <GridPattern
            width={30}
            height={30}
            x={-1}
            y={-1}
            className="[mask-image:radial-gradient(150px_circle_at_center,white,transparent)] z-10"
          />
        </div>
      ),
      Icon: CodeIcon,
      href: '/experience',
      cta: '経験を見る',
    },
    {
      name: '実績',
      className:
        'col-span-6 md:col-start-4 md:col-span-3 lg:col-start-11 lg:col-span-2',
      background: (
        <div className="relative w-full h-full min-h-[150px]">
          <NumberDisplay value={projectCount} unit="件" />
          <ShippoPattern
            className={cn(
              '[mask-image:radial-gradient(150px_circle_at_center,white,transparent)]'
            )}
          />
        </div>
      ),
      Icon: TextIcon,
      href: '/works',
      cta: '実績を見る',
    },
    {
      name: '技術記事',
      className: 'col-span-6 md:col-span-3 lg:col-start-9 lg:col-span-2',
      background: (
        <div className="relative w-full h-full min-h-[150px]">
          <NumberDisplay value={articleCount} unit="記事" />
          <SeigaihaPattern
            color="#987D00"
            backgroundColor={resolvedTheme === 'dark' ? '#182e12' : '#fafbf3'}
            className={cn(
              '[mask-image:radial-gradient(150px_circle_at_center,white,transparent)] opacity-90'
            )}
          />
        </div>
      ),
      Icon: FileTextIcon,
      href: '/blog',
      cta: '記事を読む',
    },
    {
      name: '個人開発',
      className:
        'col-span-6 md:col-start-10 md:col-span-3 lg:col-start-11 lg:col-span-2',
      background: (
        <div className="relative w-full h-full min-h-[150px]">
          <NumberDisplay value={personalProjectCount} unit="個" />
          <DotPattern
            className={cn(
              '[mask-image:radial-gradient(150px_circle_at_center,white,transparent)]'
            )}
          />
        </div>
      ),
      Icon: CodeIcon,
      href: '/works/personal',
      cta: '実績を見る',
    },
    // SNSリンク群
    {
      name: 'GitHub',
      className:
        'col-span-12 row-span-2 md:col-start-1 md:col-span-6 md:row-span-2  lg:col-span-4',
      background: (
        <div className="relative w-full h-full min-h-[300px] group">
          <div className="absolute inset-0 flex items-center justify-center">
            <GitHubImages />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/50 to-transparent z-40 transition-opacity duration-500 group-hover:opacity-0" />
          <Ripple
            className={cn(
              'absolute inset-0 z-0 [mask-image:radial-gradient(450px_circle_at_center,white,transparent)]'
            )}
          />
        </div>
      ),
      Icon: GitHubLogoIcon,
      href: 'https://github.com/otomatty',
      cta: 'リポジトリを見る',
    },
    {
      name: '興味・価値観',
      description: '興味と価値観',
      className: 'hidden lg:!block lg:col-start-5 lg:col-span-2',
      background: (
        <div className="relative w-full h-full min-h-[150px]">
          <GridPattern
            width={20}
            height={20}
            x={-1}
            y={-1}
            className="absolute inset-0 [mask-image:radial-gradient(150px_circle_at_center,white,transparent)] z-10 opacity-60"
          />
        </div>
      ),
      Icon: Telescope,
      href: '/about/interests',
      cta: '詳しく見る',
    },
    {
      name: 'スガイのメモ',
      description: '知識とアイデア',
      className: 'hidden lg:!block lg:col-start-5 lg:col-span-2',
      background: (
        <div className="relative w-full h-full min-h-[150px]">
          <DotPattern className="absolute inset-0 [mask-image:radial-gradient(150px_circle_at_center,white,transparent)] z-10 opacity-60" />
        </div>
      ),
      Icon: Notebook,
      href: '/note',
      cta: '詳しく見る',
    },
    // 技術スタックカード
    {
      name: '技術スタック',
      className:
        'col-span-12 row-span-2 md:col-start-7 md:row-start-4 md:col-span-6 md:row-span-2 lg:row-start-3',
      background: (
        <div className="relative w-full h-full min-h-[300px]">
          <TechStackGrid />
          <Particles />
        </div>
      ),
      Icon: StackIcon,
      description: 'モダンな技術スタックを活用した開発経験',
      href: '/skills',
      cta: 'スキル詳細',
    },
  ] as const;

  return (
    <section className="relative w-full">
      {/* BentoGridセクション */}
      <div className="py-10 md:py-20">
        <div className="container mx-auto px-4">
          <SectionTitle
            title="About Me"
            subtitle="私のプロフィールと実績"
            className="mb-8 md:mb-16"
          />
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <BentoGrid>
              {cards.map((card) => (
                <MagicBentoCard key={card.name} {...card} />
              ))}
            </BentoGrid>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
