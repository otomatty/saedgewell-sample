'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import mermaid from 'mermaid';
import type {
  GestureEvent,
  Position,
  UseMermaidDiagramReturn,
} from '~/types/mdx/plugins/mermaid-component';

// デフォルトのダイアグラム
const DEFAULT_DIAGRAM = `graph TD
    A[開始] --> B[処理]
    B --> C[終了]`;

// ユニークなIDを生成する関数
let idCounter = 0;
function generateUniqueId() {
  return `mermaid-${Date.now()}-${idCounter++}`;
}

// Mermaidの初期化フラグ
let isMermaidInitialized = false;

/**
 * Mermaidダイアグラムのロジックを管理するカスタムフック
 * @param chart - Mermaid構文の文字列
 * @returns ダイアグラム操作に必要な状態と関数
 */
export function useMermaidDiagram(chart: string): UseMermaidDiagramReturn {
  // 空のチャートの場合はデフォルトのダイアグラムを使用
  const actualChart = chart.trim() === '' ? DEFAULT_DIAGRAM : chart;

  // デバッグ: 受け取ったチャートとデフォルト処理後のチャートを確認
  console.log('🔍 useMermaidDiagram received chart:', chart);
  console.log('🔍 useMermaidDiagram using chart:', actualChart);

  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const mermaidRef = useRef<HTMLDivElement>(null);
  // サーバーサイドレンダリング時に固定のIDを使用し、クライアントサイドでユニークなIDを生成
  const [chartId, setChartId] = useState<string>('mermaid-placeholder');
  // レンダリング完了フラグ
  const [isRendered, setIsRendered] = useState(false);
  // ズームレベル
  const [zoomLevel, setZoomLevel] = useState(100);
  // 折りたたみ状態
  const [isCollapsed, setIsCollapsed] = useState(false);
  // ドラッグ移動のための状態
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Position>({ x: 0, y: 0 });
  // ドラッグ操作のための参照
  const diagramContainerRef = useRef<HTMLDivElement>(null);
  // 最後のホイールイベント時間（ズーム操作の頻度制限用）
  const lastWheelEventRef = useRef<number>(0);
  // ジェスチャー操作の状態
  const [isGesturing, setIsGesturing] = useState(false);
  const lastScaleRef = useRef<number>(1);

  // クライアントサイドでのみ実行されるようにする
  useEffect(() => {
    setIsClient(true);
    // クライアントサイドでのみ一意のIDを生成
    const newChartId = generateUniqueId();
    setChartId(newChartId);

    console.log('🔍 useMermaidDiagram initialized with chartId:', newChartId);

    // Mermaidの初期化（一度だけ）
    if (!isMermaidInitialized) {
      console.log('🔍 Initializing mermaid library');
      mermaid.initialize({
        startOnLoad: false,
        theme: 'neutral',
        securityLevel: 'loose',
        fontFamily: 'inherit',
        flowchart: {
          htmlLabels: true,
          curve: 'basis',
          useMaxWidth: true,
        },
        sequence: {
          useMaxWidth: true,
        },
        gantt: {
          useMaxWidth: true,
        },
      });
      isMermaidInitialized = true;
      console.log('🔍 Mermaid library initialized');
    }
  }, []);

  // Mermaidダイアグラムをレンダリングする関数
  const renderDiagram = useCallback(async () => {
    console.log('🔍 renderDiagram called with state:', {
      isClient,
      isRendered,
      chartId,
      mermaidRefExists: !!mermaidRef.current,
    });

    if (!isClient || !mermaidRef.current || isRendered) {
      console.log('🔍 renderDiagram early return:', {
        isClient,
        mermaidRefExists: !!mermaidRef.current,
        isRendered,
      });
      return;
    }

    try {
      // チャートが空白のみかチェック
      if (actualChart.trim() === '') {
        console.log('🔍 Empty chart detected');
        setError('チャートが空です。正しいMermaid構文を入力してください。');
        return;
      }

      // コンテナをクリア
      mermaidRef.current.innerHTML = '';
      console.log('🔍 Cleared mermaid container');

      // チャートのレンダリング
      try {
        console.log('🔍 Attempting to render chart with ID:', chartId);
        console.log('🔍 Chart content:', actualChart);

        const { svg } = await mermaid.render(chartId, actualChart);
        console.log('🔍 Mermaid render successful, svg length:', svg.length);

        // SVGをDOMに挿入
        if (mermaidRef.current) {
          mermaidRef.current.innerHTML = svg;
          console.log('🔍 SVG inserted into DOM');

          // SVG要素を取得してレスポンシブ属性を設定
          const svgElement = mermaidRef.current.querySelector('svg');
          if (svgElement) {
            console.log('🔍 SVG element found, applying styles');
            // SVGの属性を設定してレスポンシブに表示
            svgElement.setAttribute('width', '100%');
            svgElement.setAttribute('height', 'auto');
            svgElement.style.maxWidth = '100%';

            // ドラッグ可能なスタイルを設定
            svgElement.style.cursor = 'grab';
            svgElement.style.transformOrigin = 'top left';
            svgElement.style.transform = `translate(${position.x}px, ${position.y}px) scale(${zoomLevel / 100})`;
            svgElement.style.transition = 'transform 0.1s ease-out';

            // SVGの高さを調整（縦長のダイアグラムの場合）
            const viewBox = svgElement.getAttribute('viewBox');
            if (viewBox) {
              console.log('🔍 ViewBox found:', viewBox);
              const viewBoxValues = viewBox.split(' ').map(Number);
              // viewBoxは通常 "x y width height" の形式
              if (viewBoxValues.length >= 4) {
                const width = viewBoxValues[2];
                const height = viewBoxValues[3];
                console.log('🔍 ViewBox dimensions:', { width, height });

                // 値が有効な場合のみ処理
                if (width && height) {
                  const aspectRatio = width / height;
                  console.log('🔍 Aspect ratio:', aspectRatio);

                  // 縦長のダイアグラムの場合（アスペクト比が1未満）
                  if (aspectRatio < 1) {
                    // 高さを制限（最大500px）
                    const maxHeight = Math.min(height, 500);
                    svgElement.style.height = `${maxHeight}px`;
                    console.log('🔍 Applied height constraint:', maxHeight);
                  } else {
                    // 横長または正方形のダイアグラムの場合は自動調整
                    svgElement.style.height = 'auto';
                    console.log('🔍 Using auto height');
                  }
                }
              }
            }
          } else {
            console.log('🔍 No SVG element found in the rendered output');
          }

          setIsRendered(true);
          console.log('🔍 Set isRendered to true');
        }

        // エラー状態をクリア
        if (error) {
          console.log('🔍 Clearing previous error:', error);
          setError(null);
        }
      } catch (renderError) {
        console.error('🔍 Render error:', renderError);

        // 構文エラーの場合、より詳細な情報を表示
        try {
          // 構文チェック
          console.log('🔍 Attempting to parse chart to check syntax');
          await mermaid.parse(actualChart);
          console.log('🔍 Parse successful but render failed');
        } catch (parseError) {
          console.error('🔍 Parse error:', parseError);
          setError(`Mermaid構文エラー: ${parseError}`);
          return;
        }

        setError(
          renderError instanceof Error
            ? `図の描画中にエラーが発生しました: ${renderError.message}`
            : '図の描画中に不明なエラーが発生しました'
        );
      }
    } catch (err) {
      console.error('🔍 Unexpected error:', err);
      setError(
        err instanceof Error
          ? `予期しないエラーが発生しました: ${err.message}`
          : '予期しないエラーが発生しました'
      );
    }
  }, [isClient, actualChart, chartId, error, isRendered, position, zoomLevel]);

  // チャートが変更されたときにレンダリングを実行
  useEffect(() => {
    if (
      !isClient ||
      !actualChart ||
      !mermaidRef.current ||
      !chartId ||
      isRendered
    ) {
      return;
    }

    // 各ダイアグラムのレンダリングを時間差で実行して競合を避ける
    const timer = setTimeout(
      () => {
        renderDiagram();
      },
      100 + Math.random() * 200
    ); // 100〜300msのランダムな遅延

    return () => clearTimeout(timer);
  }, [isClient, actualChart, chartId, renderDiagram, isRendered]);

  // チャートが変更されたら再レンダリングフラグをリセット
  useEffect(() => {
    setIsRendered(false);
  }, []);

  // テーマ変更時にダイアグラムを再レンダリング
  const handleThemeChange = useCallback(() => {
    setIsRendered(false); // 再レンダリングフラグをリセット
    renderDiagram();
  }, [renderDiagram]);

  // テーマ変更を検知
  useEffect(() => {
    if (!isClient) return;

    window.addEventListener('theme-change', handleThemeChange);
    return () => {
      window.removeEventListener('theme-change', handleThemeChange);
    };
  }, [isClient, handleThemeChange]);

  // ズームレベルを変更する関数（位置指定オプション付き）
  const handleZoom = useCallback(
    (newZoomLevel: number, newPosition?: Position) => {
      // ズームレベルを50%〜200%の範囲に制限
      const clampedZoomLevel = Math.max(50, Math.min(200, newZoomLevel));
      setZoomLevel(clampedZoomLevel);

      // 位置が指定されている場合は更新
      if (newPosition) {
        setPosition(newPosition);
      }

      if (mermaidRef.current) {
        const svgElement = mermaidRef.current.querySelector('svg');
        if (svgElement) {
          const posX = newPosition ? newPosition.x : position.x;
          const posY = newPosition ? newPosition.y : position.y;
          svgElement.style.transform = `translate(${posX}px, ${posY}px) scale(${clampedZoomLevel / 100})`;
          svgElement.style.transformOrigin = 'top left';
        }
      }
    },
    [position]
  );

  // ホイールイベントによるズーム処理
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      // ジェスチャー中はホイールイベントを無視
      if (isGesturing) return;

      // Ctrlキーが押されている場合はピンチズーム操作と判断
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();

        // イベントの頻度を制限（パフォーマンス向上のため）
        const now = Date.now();
        if (now - lastWheelEventRef.current < 16) {
          // 約60FPS
          return;
        }
        lastWheelEventRef.current = now;

        // ズーム量を計算（deltaYの符号を反転）
        const zoomDelta = -e.deltaY;
        // 現在のズームレベルに対して相対的な変化量を計算
        const zoomChange = zoomDelta * 0.5; // 感度調整
        const oldZoom = zoomLevel / 100;
        const newZoom = (zoomLevel + zoomChange) / 100;

        if (mermaidRef.current) {
          const rect = mermaidRef.current.getBoundingClientRect();

          // マウスポインタの位置を取得（要素の左上を原点とする相対座標）
          const mouseX = e.clientX - rect.left;
          const mouseY = e.clientY - rect.top;

          // ズーム前のマウス位置（実際の座標系）
          const oldMouseX = (mouseX - position.x) / oldZoom;
          const oldMouseY = (mouseY - position.y) / oldZoom;

          // ズーム後のマウス位置（実際の座標系）
          const newMouseX = oldMouseX * newZoom;
          const newMouseY = oldMouseY * newZoom;

          // 位置の調整量を計算
          const deltaX = mouseX - (newMouseX + position.x);
          const deltaY = mouseY - (newMouseY + position.y);

          // 新しい位置を設定
          const newPosition = {
            x: position.x + deltaX,
            y: position.y + deltaY,
          };

          setPosition(newPosition);

          // 新しいズームレベルを適用
          handleZoom(zoomLevel + zoomChange, newPosition);
        } else {
          // mermaidRef.currentがない場合は通常のズーム処理
          handleZoom(zoomLevel + zoomChange);
        }
      }
    },
    [zoomLevel, position, handleZoom, isGesturing]
  );

  // ホイールイベントのリスナーを設定
  useEffect(() => {
    if (isRendered && mermaidRef.current) {
      const element = mermaidRef.current;

      // パッシブモードをオフにしてイベントリスナーを追加
      element.addEventListener('wheel', handleWheel, { passive: false });

      return () => {
        element.removeEventListener('wheel', handleWheel);
      };
    }
  }, [isRendered, handleWheel]);

  // ドラッグ開始ハンドラー
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      // ジェスチャー中はドラッグを無効化
      if (isGesturing) return;

      if (!mermaidRef.current) return;

      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });

      // ドラッグ中はカーソルスタイルを変更
      if (mermaidRef.current) {
        mermaidRef.current.style.cursor = 'grabbing';
      }
    },
    [position, isGesturing]
  );

  // ドラッグ中ハンドラー
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !mermaidRef.current) return;

      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;

      setPosition({ x: newX, y: newY });

      // SVG要素の位置を更新
      const svgElement = mermaidRef.current.querySelector('svg');
      if (svgElement) {
        svgElement.style.transform = `translate(${newX}px, ${newY}px) scale(${zoomLevel / 100})`;
      }
    },
    [isDragging, dragStart, zoomLevel]
  );

  // ドラッグ終了ハンドラー
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);

    // カーソルスタイルを元に戻す
    if (mermaidRef.current) {
      mermaidRef.current.style.cursor = 'grab';
    }
  }, []);

  // ドラッグ位置をリセットする関数
  const resetPosition = useCallback(() => {
    setPosition({ x: 0, y: 0 });

    if (mermaidRef.current) {
      const svgElement = mermaidRef.current.querySelector('svg');
      if (svgElement) {
        svgElement.style.transform = `translate(0px, 0px) scale(${zoomLevel / 100})`;
      }
    }
  }, [zoomLevel]);

  // 位置と拡大率を同時にリセットする関数
  const resetAll = useCallback(() => {
    setPosition({ x: 0, y: 0 });
    setZoomLevel(100);

    if (mermaidRef.current) {
      const svgElement = mermaidRef.current.querySelector('svg');
      if (svgElement) {
        svgElement.style.transform = 'translate(0px, 0px) scale(1)';
        svgElement.style.transformOrigin = 'top left';
      }
    }
  }, []);

  // タッチ開始ハンドラー
  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      // ジェスチャー中はタッチを無効化
      if (isGesturing) return;

      if (!mermaidRef.current || e.touches.length !== 1) return;

      const touch = e.touches[0];
      if (!touch) return;

      setIsDragging(true);
      setDragStart({
        x: touch.clientX - position.x,
        y: touch.clientY - position.y,
      });
    },
    [position, isGesturing]
  );

  // タッチ移動ハンドラー
  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging || !mermaidRef.current || e.touches.length !== 1) return;

      const touch = e.touches[0];
      if (!touch) return;

      // スクロールを防止
      e.preventDefault();

      const newX = touch.clientX - dragStart.x;
      const newY = touch.clientY - dragStart.y;

      setPosition({ x: newX, y: newY });

      // SVG要素の位置を更新
      const svgElement = mermaidRef.current.querySelector('svg');
      if (svgElement) {
        svgElement.style.transform = `translate(${newX}px, ${newY}px) scale(${zoomLevel / 100})`;
      }
    },
    [isDragging, dragStart, zoomLevel]
  );

  // タッチ終了ハンドラー
  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // ジェスチャー開始ハンドラー
  const handleGestureStart = useCallback((e: Event) => {
    const gestureEvent = e as GestureEvent;
    setIsGesturing(true);
    lastScaleRef.current = 1;

    // ジェスチャー中はドラッグを無効化
    setIsDragging(false);

    // デフォルトのブラウザ動作を防止
    e.preventDefault();
  }, []);

  // ジェスチャー変更ハンドラー
  const handleGestureChange = useCallback(
    (e: Event) => {
      if (!isGesturing || !mermaidRef.current) return;

      const gestureEvent = e as GestureEvent;
      const scaleDelta = gestureEvent.scale / lastScaleRef.current;
      lastScaleRef.current = gestureEvent.scale;

      // 現在のズームレベルに対して相対的な変化量を計算
      const newZoomLevel = zoomLevel * scaleDelta;

      // ジェスチャーの中心位置を取得
      if (mermaidRef.current) {
        const rect = mermaidRef.current.getBoundingClientRect();

        // ジェスチャーの中心位置（要素の左上を原点とする相対座標）
        const centerX = gestureEvent.clientX - rect.left;
        const centerY = gestureEvent.clientY - rect.top;

        const oldZoom = zoomLevel / 100;
        const newZoom = newZoomLevel / 100;

        // ズーム前の中心位置（実際の座標系）
        const oldCenterX = (centerX - position.x) / oldZoom;
        const oldCenterY = (centerY - position.y) / oldZoom;

        // ズーム後の中心位置（実際の座標系）
        const newCenterX = oldCenterX * newZoom;
        const newCenterY = oldCenterY * newZoom;

        // 位置の調整量を計算
        const deltaX = centerX - (newCenterX + position.x);
        const deltaY = centerY - (newCenterY + position.y);

        // 新しい位置を設定
        const newPosition = {
          x: position.x + deltaX,
          y: position.y + deltaY,
        };

        // 新しいズームレベルを適用
        handleZoom(newZoomLevel, newPosition);
      }

      // デフォルトのブラウザ動作を防止
      e.preventDefault();
    },
    [isGesturing, zoomLevel, position, handleZoom]
  );

  // ジェスチャー終了ハンドラー
  const handleGestureEnd = useCallback((e: Event) => {
    setIsGesturing(false);
    // デフォルトのブラウザ動作を防止
    e.preventDefault();
  }, []);

  // ジェスチャーイベントのリスナーを設定
  useEffect(() => {
    if (isRendered && mermaidRef.current) {
      const element = mermaidRef.current;

      // ジェスチャーイベントリスナーを追加
      element.addEventListener('gesturestart', handleGestureStart);
      element.addEventListener('gesturechange', handleGestureChange);
      element.addEventListener('gestureend', handleGestureEnd);

      return () => {
        element.removeEventListener('gesturestart', handleGestureStart);
        element.removeEventListener('gesturechange', handleGestureChange);
        element.removeEventListener('gestureend', handleGestureEnd);
      };
    }
  }, [isRendered, handleGestureStart, handleGestureChange, handleGestureEnd]);

  // マウスイベントのリスナーを設定
  useEffect(() => {
    if (isRendered) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);

      // タッチデバイス対応
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleTouchEnd);

      // SVG要素の初期スタイルを設定
      if (mermaidRef.current) {
        const svgElement = mermaidRef.current.querySelector('svg');
        if (svgElement) {
          svgElement.style.cursor = 'grab';
          svgElement.style.transformOrigin = 'top left';
        }
      }

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [
    isRendered,
    handleMouseMove,
    handleMouseUp,
    handleTouchMove,
    handleTouchEnd,
  ]);

  // ズームレベルが変更されたときにダイアグラムのサイズを調整
  useEffect(() => {
    if (isRendered && mermaidRef.current) {
      const svgElement = mermaidRef.current.querySelector('svg');
      if (svgElement) {
        svgElement.style.transform = `translate(${position.x}px, ${position.y}px) scale(${zoomLevel / 100})`;
        svgElement.style.transformOrigin = 'top left';
      }
    }
  }, [zoomLevel, isRendered, position]);

  return {
    mermaidRef,
    diagramContainerRef,
    error,
    isRendered,
    zoomLevel,
    isCollapsed,
    position,
    handleZoom,
    resetPosition,
    resetAll,
    handleMouseDown,
    handleTouchStart,
    setIsCollapsed,
  } as UseMermaidDiagramReturn;
}
