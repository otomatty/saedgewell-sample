'use client';

import { motion } from 'motion/react';
import { Card, CardContent } from '@kit/ui/card';
import { InfoIcon } from 'lucide-react';

export interface MonthlyPlanNotesProps {
  common: string[];
  partnerPlan: string;
  disclaimer: string;
}

export const MonthlyPlanNotes = ({
  common,
  partnerPlan,
  disclaimer,
}: MonthlyPlanNotesProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      viewport={{ once: true }}
      className="mt-8"
    >
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div>
              <h4 className="flex items-center gap-2 text-lg font-semibold mb-3">
                <span>各プラン共通</span>
              </h4>
              <ul className="space-y-2">
                {common.map((note) => (
                  <li
                    key={note}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <span className="text-primary mt-0.5">
                      <InfoIcon size={16} />
                    </span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="flex items-center gap-2 text-lg font-semibold mb-3">
                <span>技術パートナープランについて</span>
              </h4>
              <p className="text-sm text-muted-foreground">{partnerPlan}</p>
            </div>

            <div>
              <h4 className="flex items-center gap-2 text-lg font-semibold mb-3">
                <span>ご留意事項</span>
              </h4>
              <p className="text-sm text-muted-foreground">{disclaimer}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
