'use client';

import { Card, CardContent, CardHeader } from '@kit/ui/card';
import { Badge } from '@kit/ui/badge';
import { motion } from 'motion/react';
import {
  FileText,
  Briefcase,
  Settings,
  Zap,
  Users,
  Globe,
  ShoppingBag,
  Store,
  Rocket,
  BarChart2,
  Check,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@kit/ui/utils';
import Link from 'next/link';

export interface PricingFeature {
  name: string;
}

export interface PricingCardProps {
  name: string;
  description: string;
  basePrice: string;
  period: string;
  features: string[];
  featuresIcons?: string[];
  note: string;
  index: number;
  isRecommended?: boolean;
  icon?: string;
}

// Lucide-Reactのアイコンコンポーネントを取得する関数
const getIconComponent = (iconName: string | undefined) => {
  switch (iconName) {
    case 'FileText':
      return <FileText size={24} />;
    case 'Briefcase':
      return <Briefcase size={24} />;
    case 'Settings':
      return <Settings size={24} />;
    case 'Zap':
      return <Zap size={24} />;
    case 'Users':
      return <Users size={24} />;
    case 'Globe':
      return <Globe size={24} />;
    case 'ShoppingBag':
      return <ShoppingBag size={24} />;
    case 'Store':
      return <Store size={24} />;
    case 'Rocket':
      return <Rocket size={24} />;
    case 'BarChart2':
      return <BarChart2 size={24} />;
    default:
      // デフォルトアイコン
      return <FileText size={24} />;
  }
};

export const PricingCard = ({
  name,
  description,
  basePrice,
  period,
  features,
  featuresIcons = [], // 絵文字アイコンのリスト
  note,
  index,
  isRecommended = false,
  icon, // アイコン名
}: PricingCardProps) => {
  const iconComponent = getIconComponent(icon);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="h-full"
    >
      <Link href="/contact" className="block h-full no-underline">
        <Card
          className={cn(
            'h-full overflow-hidden transition-all duration-300 border group cursor-pointer',
            isRecommended
              ? 'border-primary shadow-lg shadow-primary/20 relative z-10 scale-105 md:scale-105 lg:mt-0 hover:shadow-xl hover:shadow-primary/30'
              : 'hover:shadow-md hover:border-primary/50'
          )}
        >
          {isRecommended && (
            <div className="absolute top-0 right-0 left-0 bg-primary text-primary-foreground text-center py-1 text-xs font-semibold">
              おすすめプラン
            </div>
          )}

          <CardHeader className={cn('pb-8 pt-8', isRecommended && 'pt-10')}>
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <span className="mr-2 text-primary" aria-label={name}>
                    {iconComponent}
                  </span>
                  <h3 className="text-2xl font-bold">{name}</h3>
                </div>
                {index === 0 && !name.includes('ベーシック') && (
                  <Badge
                    variant="outline"
                    className="ml-2 bg-green-50 text-green-700 border-green-200"
                  >
                    エントリー
                  </Badge>
                )}
                {index === 1 && !isRecommended && (
                  <Badge
                    variant="outline"
                    className="ml-2 bg-blue-50 text-blue-700 border-blue-200"
                  >
                    人気
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground mt-1">{description}</p>
              <div className="pt-4 border-t">
                <div className="flex items-baseline">
                  <div className="text-3xl font-bold">{basePrice}</div>
                  <div className="text-sm text-muted-foreground ml-2">〜</div>
                </div>
                <p className="text-sm text-muted-foreground">
                  標準期間：{period}
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 pb-8">
            <div>
              <h4 className="font-semibold mb-4">主な機能：</h4>
              <ul className="space-y-3">
                {features.map((feature, idx) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <span className="text-primary mt-0.5 shrink-0 w-5 h-5 flex items-center justify-center">
                      {featuresIcons?.[idx] ? (
                        <span role="img" aria-label={feature}>
                          {featuresIcons[idx]}
                        </span>
                      ) : (
                        <Check size={16} />
                      )}
                    </span>
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-sm text-muted-foreground">※ {note}</p>
            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-primary text-sm flex items-center">
                お問い合わせ <ArrowRight size={14} className="ml-1" />
              </span>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
};
