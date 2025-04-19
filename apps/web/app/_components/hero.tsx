/**
 * トップページのヒーローセクションコンポーネント
 *
 * @description
 * - スクロールに応じて背景がパララックス効果で動作
 * - フレーマーモーションによるアニメーション効果
 * - レスポンシブ対応（モバイル/デスクトップ）
 *
 * @example
 * ```tsx
 * // ページコンポーネントでの使用例
 * export default function Page() {
 *   return <Hero />
 * }
 * ```
 *
 * @features
 * - 背景のLinearRotateアニメーション
 * - スクロールベースのパララックス効果
 * - CTAボタン（実績を見る、お問い合わせ）
 * - テーマ切り替え機能
 */
'use client';

import Link from 'next/link';

import { motion, useScroll, useTransform } from 'motion/react';
import { Button } from '@kit/ui/button';
import { ArrowRight } from 'lucide-react';
import { ContactDialog } from '~/components/contacts/contact-dialog';
import { ThemeSwitch } from '~/components/theme/theme-switch';
import { LinearRotate } from '@kit/ui/linear-rotate';
import { useRef } from 'react';

export const Hero = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen overflow-hidden">
      {/* 背景のアニメーション */}
      <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
        <LinearRotate />
      </motion.div>

      {/* メインコンテンツ */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center gap-8 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tighter">
            最小のリソースから
            <br />
            <span className="aurora-gradient">最大の価値</span>を生み出す
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-foreground/80">
            プロダクトエンジニアとして、あなたのビジョンを現実に
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="group">
              <Link href="/works">実績を見る</Link>
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <ContactDialog triggerSize="lg" />
          </div>
        </motion.div>

        {/* テーマ切り替えボタン */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <ThemeSwitch />
        </motion.div>
      </div>
    </section>
  );
};
