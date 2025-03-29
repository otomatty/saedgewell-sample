'use client';

import { motion } from 'framer-motion';
import { Card } from '@kit/ui/card';
import { Progress } from '@kit/ui/progress';

interface Skill {
  name: string;
  level: number;
  description: string;
}

interface SkillCategoryProps {
  title: string;
  description: string;
  skills: Skill[];
}

export const SkillCategory = ({
  title,
  description,
  skills,
}: SkillCategoryProps) => {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {skills.map((skill, index) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="p-6 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{skill.name}</h3>
                  <span className="text-sm text-muted-foreground">
                    {skill.level}%
                  </span>
                </div>
                <Progress value={skill.level} className="h-2" />
              </div>
              <p className="text-sm text-muted-foreground">
                {skill.description}
              </p>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
