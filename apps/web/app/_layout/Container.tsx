import { cn } from '@kit/ui/utils';
import type { ReactNode } from 'react';

type ContainerProps = {
  children: ReactNode;
  className?: string;
};

/**
 * コンテンツの最大幅を制限し、一貫したレイアウトを提供するコンテナコンポーネント
 * @param children - コンテナ内に表示するコンテンツ
 * @param className - 追加のスタイルクラス
 */
export function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn('container max-w-5xl py-20 mx-auto', className)}>
      {children}
    </div>
  );
}
