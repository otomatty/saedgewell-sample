'use client';

import type React from 'react';
import { CheckCircle } from 'lucide-react';
import { Card } from '@kit/ui/card';
import type { Skill } from '~/types/skill';

interface SkillStrengthsProps {
  skill: Skill;
}

/**
 * スキルの「得意な領域」をカード形式で表示するコンポーネント。
 */
const SkillStrengths: React.FC<SkillStrengthsProps> = ({ skill }) => {
  if (!skill.strengths || skill.strengths.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <h4 className="text-lg font-semibold mb-3">得意な領域</h4>
      <div className="flex flex-wrap gap-2">
        {skill.strengths.map((strength) => (
          <Card key={strength} className="p-2 flex items-center text-sm">
            <CheckCircle className="w-3.5 h-3.5 mr-1.5 flex-shrink-0 text-primary" />
            <span>{strength}</span>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SkillStrengths;
