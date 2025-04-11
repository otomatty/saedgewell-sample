'use client';

import { motion } from 'motion/react';
import { Card, CardContent, CardHeader } from '@kit/ui/card';
import { Badge } from '@kit/ui/badge';

interface ServiceCardProps {
  title: string;
  description: string;
  features: string[];
  price: string;
  technologies: string[];
}

export const ServiceCard = ({
  title,
  description,
  features,
  price,
  technologies,
}: ServiceCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <Card className="h-full hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold">{title}</h3>
            <p className="text-muted-foreground">{description}</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h4 className="font-semibold">主な提供内容：</h4>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              {features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold">使用技術：</h4>
            <div className="flex flex-wrap gap-2">
              {technologies.map((tech) => (
                <Badge key={tech} variant="secondary">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
          <div className="pt-4 border-t">
            <div className="text-center">
              <p className="text-lg font-semibold">{price}</p>
              <p className="text-sm text-muted-foreground">
                ※ 案件の規模や要件により変動します
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
