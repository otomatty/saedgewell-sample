'use client';

import { motion } from 'motion/react';
import { Card, CardContent, CardHeader } from '@kit/ui/card';
import { Badge } from '@kit/ui/badge';
import { Check } from 'lucide-react';
import { cn } from '@kit/ui/utils';

interface PricingFeature {
  name: string;
  included: boolean;
}

interface PricingCardProps {
  name: string;
  description: string;
  price: string;
  period: string;
  features: PricingFeature[];
  recommended?: boolean;
}

export const PricingCard = ({
  name,
  description,
  price,
  period,
  features,
  recommended = false,
}: PricingCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <Card
        className={cn('relative h-full hover:shadow-lg transition-shadow', {
          'border-primary': recommended,
        })}
      >
        {recommended && (
          <Badge
            className="absolute -top-2 left-1/2 -translate-x-1/2"
            variant="default"
          >
            おすすめ
          </Badge>
        )}
        <CardHeader>
          <div className="space-y-2 text-center">
            <h3 className="text-2xl font-bold">{name}</h3>
            <p className="text-muted-foreground">{description}</p>
            <div className="pt-4">
              <span className="text-4xl font-bold">{price}</span>
              <span className="text-muted-foreground">/{period}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {features.map((feature) => (
              <li
                key={feature.name}
                className={cn('flex items-center gap-2', {
                  'text-muted-foreground': !feature.included,
                })}
              >
                <Check
                  className={cn('h-4 w-4', {
                    'text-primary': feature.included,
                    'text-muted-foreground': !feature.included,
                  })}
                />
                {feature.name}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  );
};
