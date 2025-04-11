'use client';

import { Card, CardContent, CardHeader } from '@kit/ui/card';
import { Badge } from '@kit/ui/badge';
import { motion } from 'motion/react';

export interface ProcessCardProps {
  step: number;
  title: string;
  description: string;
  duration: string;
  deliverables: string[];
}

export const ProcessCard = ({
  step,
  title,
  description,
  duration,
  deliverables,
}: ProcessCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: step * 0.1 }}
      viewport={{ once: true }}
    >
      <Card className="h-full hover:shadow-lg transition-shadow relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-2 rounded-bl-lg">
          Step {step}
        </div>
        <CardHeader>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold">{title}</h3>
            <p className="text-muted-foreground">{description}</p>
            <p className="text-sm text-muted-foreground">
              想定期間：{duration}
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <div>
            <h4 className="font-semibold mb-3">成果物：</h4>
            <ul className="space-y-2">
              {deliverables.map((deliverable) => (
                <li
                  key={deliverable}
                  className="flex items-center text-sm text-muted-foreground"
                >
                  <Badge variant="secondary" className="mr-2">
                    ✓
                  </Badge>
                  {deliverable}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
