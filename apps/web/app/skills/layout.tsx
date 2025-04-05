import type { Metadata } from 'next';
import type React from 'react';

// このルート ( /skills ) のメタデータを定義
export const metadata: Metadata = {
  title: 'Skills',
  description:
    'フロントエンド、バックエンド、インフラ、デザインなど、幅広い開発スキルを活かしてプロジェクトに貢献します。', // 説明を少し修正
};

interface SkillsLayoutProps {
  children: React.ReactNode;
}

/**
 * スキルページのレイアウトコンポーネント (Server Component)
 * このルートのメタデータを定義し、子要素を表示します。
 */
const SkillsLayout: React.FC<SkillsLayoutProps> = ({ children }) => {
  // ここで必要であれば共通のヘッダーやフッターなどを配置することも可能
  return <>{children}</>; // 基本的には子要素をそのまま返す
};

export default SkillsLayout;
