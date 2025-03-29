/**
 * UIコンポーネント関連の型定義
 */
import type { ComponentPropsWithoutRef, ReactElement } from "react";

/**
 * Toastコンポーネントのプロパティ型
 * 注: 実際のToastコンポーネントの型を参照するためのプレースホルダー
 */
export interface ToastProps extends ComponentPropsWithoutRef<"li"> {
	/**
	 * トーストの表示状態
	 */
	open?: boolean;
	/**
	 * トーストの表示状態が変更されたときのコールバック
	 */
	onOpenChange?: (open: boolean) => void;
	/**
	 * トーストのバリアント
	 */
	variant?: "default" | "destructive" | "success" | "warning" | "info";
}

/**
 * ToastActionコンポーネントの要素型
 * 注: 実際のToastActionコンポーネントの型を参照するためのプレースホルダー
 */
export interface ToastActionProps extends ComponentPropsWithoutRef<"button"> {
	/**
	 * アクションがトリガーされたときに呼び出されるコールバック
	 */
	altText?: string;
}

/**
 * ToastActionの要素型
 */
export type ToastActionElement = ReactElement<ToastActionProps>;
