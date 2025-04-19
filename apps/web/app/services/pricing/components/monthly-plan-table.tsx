'use client';

import { motion } from 'motion/react';
import { CheckIcon, Clock, Zap, Users, Crown } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@kit/ui/table';
import { Badge } from '@kit/ui/badge';
import { cn } from '@kit/ui/utils';
import type { MonthlyPlan } from '~/data/pricing';

export interface MonthlyPlanTableProps {
  plans: MonthlyPlan[];
}

export const MonthlyPlanTable = ({ plans }: MonthlyPlanTableProps) => {
  // プランごとにアイコンを取得
  const getPlanIcon = (planName: string, index: number) => {
    if (planName.includes('スポット'))
      return <Clock className="text-green-500" size={20} />;
    if (planName.includes('開発サポート'))
      return <Zap className="text-blue-500" size={20} />;
    if (planName.includes('技術パートナー'))
      return <Crown className="text-amber-500" size={20} />;
    return <Users className="text-primary" size={20} />;
  };

  // プランの背景色を取得
  const getPlanBackgroundClass = (index: number) => {
    if (index === 0) return 'hover:bg-green-50';
    if (index === 1) return 'hover:bg-blue-50';
    if (index === 2) return 'hover:bg-amber-50';
    return 'hover:bg-slate-50';
  };

  // プランのバッジスタイルを取得
  const getPlanBadgeClass = (index: number) => {
    if (index === 0)
      return 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100';
    if (index === 1)
      return 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100';
    if (index === 2)
      return 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100';
    return 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="w-full overflow-x-auto rounded-xl border border-border shadow-sm"
    >
      <Table className="w-full">
        <TableHeader className="bg-muted/30">
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[220px] py-4">プラン</TableHead>
            <TableHead className="text-center py-4">
              月額料金<span className="text-xs ml-1">（税別）</span>
            </TableHead>
            <TableHead className="text-center py-4">稼働時間</TableHead>
            <TableHead className="text-center py-4 hidden md:table-cell">
              おすすめ対象
            </TableHead>
            <TableHead className="text-center py-4">主な対応内容</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {plans.map((plan, index) => (
            <TableRow
              key={plan.name}
              className={cn(
                'transition-colors cursor-pointer',
                getPlanBackgroundClass(index),
                index === plans.length - 1 && 'border-b-0'
              )}
            >
              <TableCell className="font-bold py-6">
                <div className="flex items-center gap-2">
                  {getPlanIcon(plan.name, index)}
                  <Badge
                    variant="outline"
                    className={cn(
                      'text-base font-bold py-1.5 px-3 transition-colors',
                      getPlanBadgeClass(index)
                    )}
                  >
                    {plan.name}
                  </Badge>
                </div>
                {index === 2 && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    技術顧問としての活動に最適
                  </div>
                )}
              </TableCell>
              <TableCell className="text-center">
                <div className="text-xl font-bold text-primary">
                  {plan.price}
                </div>
                {index === 2 && (
                  <div className="text-xs text-muted-foreground mt-1">〜</div>
                )}
              </TableCell>
              <TableCell className="text-center font-medium">
                {plan.hours}
              </TableCell>
              <TableCell className="max-w-[250px] hidden md:table-cell">
                <p className="text-sm text-muted-foreground">
                  {plan.recommendFor}
                </p>
              </TableCell>
              <TableCell>
                <ul className="space-y-2">
                  {plan.services.map((service) => (
                    <li
                      key={service}
                      className="flex items-start gap-2 text-sm"
                    >
                      <span
                        className={cn(
                          'inline-flex shrink-0 rounded-full p-1 mt-0.5',
                          index === 0
                            ? 'bg-green-100 text-green-600'
                            : index === 1
                              ? 'bg-blue-100 text-blue-600'
                              : 'bg-amber-100 text-amber-600'
                        )}
                      >
                        <CheckIcon size={12} />
                      </span>
                      <span className="text-muted-foreground">{service}</span>
                    </li>
                  ))}
                </ul>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </motion.div>
  );
};
