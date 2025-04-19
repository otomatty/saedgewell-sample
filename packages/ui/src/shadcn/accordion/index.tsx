'use client';

import type * as React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';

import { cn } from '../../lib/utils/cn';

/**
 * アコーディオンコンポーネントのルート要素です。
 * コンテンツを折りたたみ可能なセクションとして表示するために使用します。
 *
 * @example
 * ```tsx
 * // 単一のアコーディオン
 * <Accordion type="single" collapsible>
 *   <AccordionItem value="item-1">
 *     <AccordionTrigger>タイトル</AccordionTrigger>
 *     <AccordionContent>コンテンツ</AccordionContent>
 *   </AccordionItem>
 * </Accordion>
 *
 * // 複数のアコーディオン
 * <Accordion type="multiple">
 *   <AccordionItem value="item-1">...</AccordionItem>
 *   <AccordionItem value="item-2">...</AccordionItem>
 * </Accordion>
 * ```
 *
 * @property {('single' | 'multiple')} type - アコーディオンの動作モード
 * @property {boolean} [collapsible] - type="single"の場合、すべての項目を閉じることができるかどうか
 * @property {string} [defaultValue] - 初期状態で開く項目のvalue値
 * @property {string} [value] - 現在開いている項目のvalue値（制御コンポーネントとして使用する場合）
 * @property {(value: string) => void} [onValueChange] - 値が変更されたときのコールバック
 */
const Accordion = AccordionPrimitive.Root;

/**
 * アコーディオンの個々の項目を表すコンポーネントです。
 * 各項目は一意のvalue属性を持つ必要があります。
 *
 * @example
 * ```tsx
 * <AccordionItem value="unique-id" className="custom-class">
 *   <AccordionTrigger>タイトル</AccordionTrigger>
 *   <AccordionContent>コンテンツ</AccordionContent>
 * </AccordionItem>
 * ```
 *
 * @property {string} value - 項目を識別するための一意の値
 * @property {string} [className] - カスタムクラス名
 */
function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn('border-b', className)}
      {...props}
    />
  );
}

/**
 * アコーディオンの開閉トリガーとなるコンポーネントです。
 * クリックすると対応するAccordionContentの表示/非表示を切り替えます。
 *
 * @example
 * ```tsx
 * <AccordionTrigger className="custom-class">
 *   セクションのタイトル
 * </AccordionTrigger>
 * ```
 *
 * @property {ReactNode} children - トリガーに表示するコンテンツ
 * @property {string} [className] - カスタムクラス名
 */
function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        className={cn(
          'flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:underline text-left [&[data-state=open]>svg]:rotate-180',
          className
        )}
        {...props}
      >
        {children}
        <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}
AccordionTrigger.displayName = 'AccordionTrigger';

/**
 * アコーディオンの折りたたみ可能なコンテンツ部分を表すコンポーネントです。
 * AccordionTriggerがクリックされると、アニメーション付きで表示/非表示が切り替わります。
 *
 * @example
 * ```tsx
 * <AccordionContent className="custom-class">
 *   <p>折りたたまれるコンテンツ</p>
 *   <div>任意のJSX要素を配置できます</div>
 * </AccordionContent>
 * ```
 *
 * @property {ReactNode} children - 折りたたまれるコンテンツ
 * @property {string} [className] - カスタムクラス名
 */
function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      className={cn(
        'overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down',
        className
      )}
      {...props}
    >
      <div className="pb-4 pt-0">{children}</div>
    </AccordionPrimitive.Content>
  );
}
AccordionContent.displayName = 'AccordionContent';

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
