'use client';

import { ArrowRightIcon } from '@radix-ui/react-icons';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { Button } from '../../shadcn/button';
import { Card } from '../../shadcn/card';
import { MagicCard } from '../magic-card';
import { cn } from '../../lib/utils';
import { useTheme } from 'next-themes';

/**
 * BentoGridコンポーネントのプロパティ定義
 * @interface BentoGridProps
 * @extends {ComponentPropsWithoutRef<"div">}
 * @property {ReactNode} children - グリッド内に表示するBentoCardコンポーネント
 * @property {string} [className] - 追加のスタイリングクラス
 */
interface BentoGridProps extends ComponentPropsWithoutRef<'div'> {
  children: ReactNode;
  className?: string;
}

/**
 * BentoCardコンポーネントのプロパティ定義
 * @interface BentoCardProps
 * @extends {ComponentPropsWithoutRef<"div">}
 * @property {string} name - カードのタイトル
 * @property {string} className - スタイリングクラス（グリッド内での位置やサイズを制御）
 * @property {ReactNode} background - カードの背景に表示するコンテンツ
 * @property {React.ElementType} Icon - カードに表示するアイコンコンポーネント
 * @property {string} description - カードの説明文
 * @property {string} href - クリック時の遷移先URL
 * @property {string} cta - コールトゥアクションのテキスト
 */
interface BentoCardProps extends ComponentPropsWithoutRef<'div'> {
  name: string;
  className: string;
  background: ReactNode;
  Icon: React.ElementType;
  description?: string;
  href: string;
  cta: string;
}

/**
 * MagicBentoCardコンポーネントのプロパティ定義
 * BentoCardPropsを継承し、MagicCardのグラデーションプロパティを追加
 *
 * @interface MagicBentoCardProps
 * @extends {BentoCardProps}
 * @property {number} [gradientSize] - グラデーションの円の大きさ（ピクセル）
 * @property {string} [gradientColor] - グラデーションのベースカラー
 * @property {number} [gradientOpacity] - グラデーションの不透明度（0-1）
 * @property {string} [gradientFrom] - グラデーションの開始色
 * @property {string} [gradientTo] - グラデーションの終了色
 */

/**
 * ベントーグリッドレイアウトを実現するコンポーネント
 *
 * @example
 * ```tsx
 * <BentoGrid>
 *   <BentoCard
 *     name="プロジェクト1"
 *     className="md:col-span-2"
 *     background={<img src="/project1.jpg" alt="プロジェクト1" />}
 *     Icon={ProjectIcon}
 *     description="プロジェクトの説明"
 *     href="/projects/1"
 *     cta="詳細を見る"
 *   />
 *   <BentoCard ... />
 * </BentoGrid>
 * ```
 *
 * @param {BentoGridProps} props - コンポーネントのプロパティ
 * @returns {JSX.Element} ベントーグリッドコンポーネント
 */
const BentoGrid = ({ children, className, ...props }: BentoGridProps) => {
  return (
    <div
      className={cn(
        'grid w-full auto-rows-[16rem] grid-cols-12 gap-4',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * グリッド内に配置する個別のカードコンポーネント
 * ホバー時にアニメーションと追加情報を表示する機能を持つ
 *
 * @example
 * ```tsx
 * <BentoCard
 *   name="プロジェクト1"
 *   className="md:col-span-2"
 *   background={<img src="/project1.jpg" alt="プロジェクト1" />}
 *   Icon={ProjectIcon}
 *   description="プロジェクトの説明文をここに記述します"
 *   href="/projects/1"
 *   cta="詳細を見る"
 * />
 * ```
 *
 * @param {BentoCardProps} props - カードコンポーネントのプロパティ
 * @returns {JSX.Element} ベントーカードコンポーネント
 */
const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
  ...props
}: BentoCardProps) => (
  <Card
    key={name}
    className={cn(
      'group relative col-span-3 flex flex-col justify-between overflow-hidden rounded-xl',
      className
    )}
    {...props}
  >
    <div>{background}</div>
    <div className="pointer-events-none flex transform-gpu flex-col gap-1 p-6 transition-all duration-300 group-hover:-translate-y-10 z-20">
      <Icon className="h-12 w-12 origin-left transform-gpu text-neutral-700 transition-all duration-300 ease-in-out group-hover:scale-75" />
      <h3 className="text-xl font-semibold text-neutral-700 dark:text-neutral-300">
        {name}
      </h3>
      <p className="max-w-lg text-neutral-400">{description}</p>
    </div>

    <div
      className={cn(
        'pointer-events-none absolute bottom-0 flex w-full translate-y-10 transform-gpu flex-row items-center p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 z-20'
      )}
    >
      <Button variant="ghost" asChild size="sm" className="pointer-events-auto">
        <a href={href}>
          {cta}
          <ArrowRightIcon className="ms-2 h-4 w-4 rtl:rotate-180" />
        </a>
      </Button>
    </div>
    <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-black/[.03] group-hover:backdrop-blur-xs dark:group-hover:bg-neutral-800/10 z-10" />
    <div className="absolute inset-0 bg-linear-to-t from-background/95 via-background/95 to-transparent z-5" />
  </Card>
);

/**
 * マジックエフェクト付きのベントーカードコンポーネント
 * マウスの動きに応じてグラデーションエフェクトを表示
 *
 * @example
 * ```tsx
 * <MagicBentoCard
 *   name="プロジェクト"
 *   className="md:col-span-2"
 *   background={<img src="/project.jpg" alt="プロジェクト" />}
 *   Icon={ProjectIcon}
 *   description="プロジェクトの説明"
 *   href="/projects"
 *   cta="詳細を見る"
 * />
 * ```
 */
const MagicBentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
  ...props
}: BentoCardProps) => {
  const { theme } = useTheme();

  return (
    <MagicCard
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-xl shadow-2xl cursor-pointer',
        'transition-all duration-300 ease-in-out',
        className
      )}
      gradientColor={theme === 'dark' ? '#262626' : '#D9D9D955'}
      gradientOpacity={theme === 'dark' ? 0.7 : 0.3}
      {...props}
    >
      <div className="absolute inset-0 z-0">{background}</div>
      <div className="pointer-events-none flex transform-gpu flex-col gap-1 p-6 transition-all duration-300 group-hover:-translate-y-10 z-20">
        <Icon className="h-12 w-12 origin-left transform-gpu transition-all duration-300 ease-in-out group-hover:scale-75 text-foreground" />
        <h3 className="text-2xl font-semibold text-foreground">{name}</h3>
        {description && (
          <p className="max-w-lg text-foreground/70">{description}</p>
        )}
      </div>

      <div className="pointer-events-none absolute bottom-0 flex w-full translate-y-10 transform-gpu flex-row items-center p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 z-20">
        <Button
          variant="ghost"
          asChild
          size="sm"
          className="pointer-events-auto"
        >
          <a href={href}>
            {cta}
            <ArrowRightIcon className="ms-2 h-4 w-4 rtl:rotate-180" />
          </a>
        </Button>
      </div>
      <div className="absolute inset-0 bg-linear-to-t from-background/60 via-background/10 to-transparent z-5" />
    </MagicCard>
  );
};

export { BentoCard, BentoGrid, MagicBentoCard };
