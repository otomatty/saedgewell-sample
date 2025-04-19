'use client';

import type React from 'react';
import Link from 'next/link';
import {
  BriefcaseBusiness,
  GitBranchPlus,
  Newspaper,
  Award,
  Presentation,
  Link2,
} from 'lucide-react';
import { cn } from '@kit/ui/utils';
import type { Skill, RelatedLink } from '~/types/skill';

interface SkillRelatedLinksProps {
  skill: Skill;
}

// 関連リンクのタイプに応じたアイコンを返すヘルパーコンポーネント
const RelatedLinkIcon: React.FC<{ type: RelatedLink['type'] }> = ({ type }) => {
  const iconProps = { className: 'w-4 h-4 mr-2 flex-shrink-0' };
  switch (type) {
    case 'project':
      return <BriefcaseBusiness {...iconProps} />;
    case 'repository':
      return <GitBranchPlus {...iconProps} />;
    case 'article':
      return <Newspaper {...iconProps} />;
    case 'certificate':
      return <Award {...iconProps} />;
    case 'slides':
      return <Presentation {...iconProps} />;
    default:
      return <Link2 {...iconProps} />;
  }
};

/**
 * スキルの「関連リンク/実績」をリスト形式で表示するコンポーネント。
 */
const SkillRelatedLinks: React.FC<SkillRelatedLinksProps> = ({ skill }) => {
  if (!skill.relatedLinks || skill.relatedLinks.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 space-y-2">
      <h4 className="text-lg font-semibold">関連リンク/実績</h4>
      <ul className="list-none space-y-2 pl-1">
        {skill.relatedLinks.map((link) => (
          <li key={link.url}>
            <Link
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'flex items-center text-sm hover:text-primary hover:underline transition-colors',
                'group'
              )}
            >
              <RelatedLinkIcon type={link.type} />
              <span className="truncate">{link.name}</span>
              <Link2 className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SkillRelatedLinks;
