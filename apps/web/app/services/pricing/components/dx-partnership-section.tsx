'use client';

import { motion } from 'motion/react';
import { Card, CardContent } from '@kit/ui/card';
import { Badge } from '@kit/ui/badge';
import {
  CheckCircleIcon,
  ArrowRightIcon,
  LightbulbIcon,
  TargetIcon,
  ClockIcon,
  CoinsIcon,
  BriefcaseIcon,
  ShieldIcon,
} from 'lucide-react';
import type { DXPartnership } from '~/data/pricing';
import { cn } from '@kit/ui/utils';

export interface DXPartnershipSectionProps {
  data: DXPartnership;
}

export const DXPartnershipSection = ({ data }: DXPartnershipSectionProps) => {
  return (
    <section className="mb-20">
      {/* Header Section with Gradient Background */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-primary/15 to-primary/5 p-8 rounded-xl mb-12 shadow-sm border border-primary/10"
      >
        <div className="max-w-4xl mx-auto">
          <Badge
            variant="outline"
            className="mb-4 py-1.5 px-3 mx-auto block w-fit border-primary/30 bg-background/80 font-medium"
          >
            特別プラン
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-center">
            {data.title}
          </h2>
          <p className="text-lg text-center mb-8 text-muted-foreground">
            {data.subtitle}
          </p>

          <div className="prose prose-sm dark:prose-invert max-w-none bg-background/70 p-6 rounded-lg shadow-sm">
            {data.description.split('\n\n').map((paragraph, idx) => (
              <p
                key={`p-${paragraph.substring(0, 15)}-${idx}`}
                className="my-3"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Goals Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        viewport={{ once: true }}
        className="mb-14"
      >
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <TargetIcon className="text-primary" size={24} />
          <span>{data.goals.title}</span>
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {data.goals.items.map((item) => (
            <Card
              key={`goal-${item.substring(0, 20).replace(/\s+/g, '-')}`}
              className="hover:shadow-md transition-shadow border-muted/70"
            >
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 rounded-full p-1.5 shrink-0">
                    <CheckCircleIcon className="text-primary h-5 w-5" />
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Services Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        viewport={{ once: true }}
        className="mb-14"
      >
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <BriefcaseIcon className="text-primary" size={24} />
          <span>{data.services.title}</span>
        </h3>
        <div className="space-y-5">
          {data.services.items.map((service) => {
            // サービス名から一意のキーを生成
            const serviceKey = `service-${service.name.substring(0, 20).replace(/\s+/g, '-')}`;
            return (
              <div
                key={serviceKey}
                className="bg-card rounded-lg p-6 border border-muted/70 hover:shadow-md transition-shadow"
              >
                <h4 className="font-semibold text-lg mb-3 flex items-center gap-3">
                  <div className="bg-primary text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center shrink-0">
                    {data.services.items.indexOf(service) + 1}
                  </div>
                  <span className="text-foreground">{service.name}</span>
                </h4>
                <p className="text-sm text-muted-foreground pl-11">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Process Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        viewport={{ once: true }}
        className="mb-14"
      >
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <ClockIcon className="text-primary" size={24} />
          <span>{data.process.title}</span>
        </h3>
        <div className="relative ml-6 pl-6 border-l-2 border-primary/30">
          {data.process.steps.map((step) => {
            // ステップから一意のキーを生成
            const stepKey = `step-${step.step.substring(0, 20).replace(/\s+/g, '-')}`;
            const stepIndex = data.process.steps.indexOf(step);

            return (
              <div key={stepKey} className="mb-10 relative">
                {/* タイムラインの円 */}
                <div className="absolute -left-10 top-0 bg-background border-2 border-primary rounded-full h-7 w-7 flex items-center justify-center">
                  <div className="bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold">
                    {stepIndex + 1}
                  </div>
                </div>
                <div
                  className={cn(
                    'p-5 rounded-lg border border-muted/70 bg-card relative',
                    stepIndex % 2 === 0 ? 'bg-card/50' : 'bg-card'
                  )}
                >
                  <h4 className="font-semibold text-lg mb-2">{step.step}</h4>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Pricing Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        viewport={{ once: true }}
      >
        <Card className="border-primary/20 shadow-md overflow-hidden">
          <div className="bg-primary/10 p-2 border-b border-primary/20">
            <div className="flex justify-center">
              <Badge
                variant="outline"
                className="bg-background/70 text-primary border-primary/30"
              >
                料金プラン
              </Badge>
            </div>
          </div>
          <CardContent className="p-6 md:p-8">
            <div className="flex items-start gap-4 mb-6">
              <CoinsIcon className="text-primary h-6 w-6 shrink-0 mt-1" />
              <div>
                <h3 className="text-2xl font-bold mb-3">
                  {data.pricing.title}
                </h3>
                <div className="text-xl md:text-2xl font-bold text-primary mb-3">
                  {data.pricing.description}
                </div>
                <div className="flex items-start gap-2 text-sm text-muted-foreground mt-4">
                  <ShieldIcon className="h-4 w-4 shrink-0 mt-0.5" />
                  <p>{data.pricing.note}</p>
                </div>
              </div>
            </div>
            <div className="mt-8 flex items-center justify-center md:justify-end">
              <a
                href="/contact"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary/90 transition-colors font-medium"
              >
                <span>まずは無料相談する</span>
                <ArrowRightIcon size={16} />
              </a>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
};
