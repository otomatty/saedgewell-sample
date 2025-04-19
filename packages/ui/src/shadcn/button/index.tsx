// @ts-nocheck - Radix UIのSlotコンポーネントと型の互換性問題を回避
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../lib/utils/cn';

/**
 * ボタンのスタイルバリエーションを定義するための設定オブジェクトです。
 * class-variance-authorityを使用して、異なるバリアントとサイズを管理します。
 *
 * @property {object} variants - ボタンのバリアント（見た目）とサイズの設定
 * @property {object} defaultVariants - デフォルトのバリアントとサイズ
 */
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground shadow-2xs hover:bg-destructive/90',
        outline:
          'border border-input bg-background shadow-2xs hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground shadow-2xs hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

/**
 * ボタンコンポーネントのプロパティの型定義です。
 * HTMLButtonElementの属性とボタンバリアントのプロパティを継承します。
 *
 * @property {boolean} [asChild] - 子要素をボタンとして扱うかどうか
 * @property {string} [variant] - ボタンの見た目のバリアント（'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'）
 * @property {string} [size] - ボタンのサイズ（'default' | 'sm' | 'lg' | 'icon'）
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

/**
 * 汎用的なボタンコンポーネントです。
 * 様々なスタイルバリエーションとサイズをサポートし、アクセシビリティにも配慮しています。
 *
 * @example
 * ```tsx
 * // デフォルトのボタン
 * <Button>クリック</Button>
 *
 * // バリアントとサイズを指定
 * <Button variant="destructive" size="lg">削除</Button>
 *
 * // アウトラインスタイル
 * <Button variant="outline">編集</Button>
 *
 * // アイコンボタン
 * <Button size="icon">
 *   <IconComponent />
 * </Button>
 *
 * // カスタムクラスの追加
 * <Button className="my-custom-class">カスタム</Button>
 * ```
 *
 * @property {string} [variant] - ボタンの見た目のバリアント
 * @property {string} [size] - ボタンのサイズ
 * @property {boolean} [asChild=false] - 子要素をボタンとして扱うかどうか
 * @property {string} [className] - 追加のCSSクラス
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
