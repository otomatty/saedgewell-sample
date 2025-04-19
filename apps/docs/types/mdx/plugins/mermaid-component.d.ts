/**
 * Mermaidコンポーネント関連の型定義
 */
import type React from 'react';

/**
 * Mermaidダイアグラムのプロパティ
 * @param chart - Mermaid構文の文字列
 * @param className - 追加のCSSクラス名
 */
export interface MermaidDiagramProps {
  chart: string;
  className?: string;
}

/**
 * ジェスチャーイベントの型定義（TypeScriptの標準定義にないため）
 */
export interface GestureEvent extends Event {
  scale: number;
  rotation: number;
  clientX: number;
  clientY: number;
}

/**
 * 位置情報の型定義
 */
export interface Position {
  x: number;
  y: number;
}

/**
 * Mermaidダイアグラムのフック戻り値の型定義
 */
export interface UseMermaidDiagramReturn {
  // 参照
  mermaidRef: React.RefObject<HTMLDivElement>;
  diagramContainerRef: React.RefObject<HTMLDivElement>;

  // 状態
  error: string | null;
  isRendered: boolean;
  zoomLevel: number;
  isCollapsed: boolean;
  position: Position;

  // イベントハンドラー
  handleZoom: (newZoomLevel: number, newPosition?: Position) => void;
  resetPosition: () => void;
  resetAll: () => void;
  handleMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleTouchStart: (e: React.TouchEvent<HTMLDivElement>) => void;
  setIsCollapsed: (collapsed: boolean) => void;
}
