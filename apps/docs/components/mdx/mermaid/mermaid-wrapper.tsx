import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import type { MermaidConfig as MermaidLibConfig } from 'mermaid';

interface MermaidWrapperProps {
  chart: string;
  theme?: 'default' | 'forest' | 'dark' | 'neutral' | 'custom'; // カスタムテーマを追加
}

/**
 * Mermaidダイアグラムをレンダリングするコンポーネント
 * @param chart - Mermaidの図表定義
 * @param theme - 使用するテーマ（オプション）
 */
export function MermaidWrapper({
  chart,
  theme = 'default',
}: MermaidWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [renderedSvg, setRenderedSvg] = useState<string | null>(null);
  const [diagramType, setDiagramType] = useState<string>('default');

  useEffect(() => {
    // チャートの種類を判定
    const detectDiagramType = (chartContent: string): string => {
      if (
        chartContent.trim().startsWith('graph ') ||
        chartContent.trim().startsWith('flowchart ')
      ) {
        return 'flowchart';
      }
      if (chartContent.trim().startsWith('sequenceDiagram')) {
        return 'sequence';
      }
      if (chartContent.trim().startsWith('classDiagram')) {
        return 'class';
      }
      if (chartContent.trim().startsWith('stateDiagram')) {
        return 'state';
      }
      if (chartContent.trim().startsWith('gantt')) {
        return 'gantt';
      }
      if (chartContent.trim().startsWith('pie ')) {
        return 'pie';
      }
      if (chartContent.trim().startsWith('erDiagram')) {
        return 'er';
      }
      return 'default';
    };

    const type = detectDiagramType(chart);
    setDiagramType(type);
    console.log(`🔍 Mermaid: 図の種類を検出 - ${type}`);

    // Mermaid.jsをダイナミックインポート
    const loadMermaid = async () => {
      if (!chart) {
        setError('チャートデータが空です');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        console.log('🔄 Mermaid: ライブラリをロード中...');

        // Mermaid.jsをインポート
        const mermaid = (await import('mermaid')).default;
        console.log('✅ Mermaid: ライブラリのロード成功');

        // ダイアグラム種類に基づいたテーマ選択
        let selectedTheme = theme;

        // ダイアグラム種類ごとに最適なテーマを選択（prop指定がない場合）
        if (theme === 'default') {
          // すべてのダイアグラムタイプでデフォルトテーマを使用
          selectedTheme = 'default';

          // 以下のコードをコメントアウト
          /*
          if (type === 'class' || type === 'er') {
            selectedTheme = 'forest'; // クラス図とER図はforestテーマが読みやすい
          } else if (type === 'state') {
            selectedTheme = 'default'; // 状態図はdefaultテーマ
          } else if (type === 'sequence') {
            selectedTheme = 'default'; // シーケンス図はdefaultテーマ
          }
          */
        }

        // 図の種類に応じた設定
        const config: MermaidLibConfig = {
          startOnLoad: false,
          theme: 'null', // カスタム色を使用するため
          securityLevel: 'loose',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          logLevel: 'info', // 文字列に変更
          flowchart: {
            htmlLabels: true,
            curve: 'basis',
            diagramPadding: 20,
            nodeSpacing: 50,
            rankSpacing: 80,
            padding: 20,
            useMaxWidth: true,
          },
          sequence: {
            diagramMarginX: 50,
            diagramMarginY: 20,
            actorMargin: 80,
            width: 150,
            height: 65,
            boxMargin: 10,
            boxTextMargin: 5,
            noteMargin: 10,
            messageMargin: 40,
            mirrorActors: true,
            useMaxWidth: true,
            // シーケンス図の色設定
            actorFontSize: 14,
            noteFontSize: 14,
            messageFontSize: 14,
          },
          gantt: {
            titleTopMargin: 25,
            barHeight: 30,
            barGap: 8,
            topPadding: 75,
            leftPadding: 100,
            gridLineStartPadding: 50,
            fontSize: 14,
            sectionFontSize: 16,
            numberSectionStyles: 4,
            useMaxWidth: true,
            fontFamily: 'ui-sans-serif, system-ui, sans-serif',
          },
          pie: {
            useMaxWidth: true,
            textPosition: 0.5,
          },
          er: {
            useMaxWidth: true,
            entityPadding: 30,
            fontSize: 14,
            layoutDirection: 'TB',
          },
          classDiagram: {
            useMaxWidth: true,
            diagramPadding: 40,
            fontSize: 14,
          },
          stateDiagram: {
            diagramPadding: 40,
            fontSize: 14,
            labelHeight: 30,
            useMaxWidth: true,
          },
        };

        // カスタムテーマの適用
        if (theme === 'custom') {
          // baseテーマはすでに設定済み: theme: selectedTheme === 'custom' ? 'base' : selectedTheme

          // ダークモードの検出
          const isDarkMode =
            typeof window !== 'undefined' &&
            window.matchMedia &&
            window.matchMedia('(prefers-color-scheme: dark)').matches;

          // ダークモード用のカスタムテーマ
          if (isDarkMode) {
            config.themeVariables = {
              // ダークモード用カラー
              primaryColor: '#42a5f5', // プライマリカラー（明るめのブルー）
              primaryBorderColor: '#1e88e5', // プライマリボーダー
              primaryTextColor: '#ffffff', // プライマリテキスト
              secondaryColor: '#ffb74d', // セカンダリカラー（明るめのオレンジ）
              tertiaryColor: '#9575cd', // アクセントカラー（明るめのパープル）

              // ノード
              nodeBorder: '#42a5f5', // ノードのボーダー
              nodeTextColor: '#e0e0e0', // ノードテキスト

              // 線とテキスト
              lineColor: '#bdbdbd', // 線の色
              textColor: '#e0e0e0', // テキスト色
              mainBkg: '#2d3748', // メイン背景

              // フローチャート
              clusterBkg: '#1a2638', // クラスター背景
              clusterBorder: '#42a5f5', // クラスターボーダー

              // シーケンス図
              actorBorder: '#42a5f5', // アクター境界線
              actorBkg: '#1e3a5f', // アクター背景
              actorTextColor: '#e0e0e0', // アクターテキスト
              actorLineColor: '#42a5f5', // アクターライン
              signalColor: '#64b5f6', // シグナルライン

              // クラス図
              classText: '#e0e0e0', // クラステキスト

              // 状態図
              labelColor: '#e0e0e0', // ラベル

              // その他
              noteBkgColor: '#5d4037', // メモ背景
              noteBorderColor: '#8d6e63', // メモ境界線
              noteTextColor: '#e0e0e0', // メモテキスト
            };
          } else {
            // ライトモード用カスタムテーマ（既存の設定）
            config.themeVariables = {
              // ベースカラー
              primaryColor: '#1e88e5', // プライマリカラー
              primaryBorderColor: '#1565c0', // プライマリボーダー
              primaryTextColor: '#ffffff', // プライマリテキスト
              secondaryColor: '#ff9800', // セカンダリカラー
              tertiaryColor: '#6a1b9a', // アクセントカラー

              // ノード
              nodeBorder: '#1e88e5', // ノードのボーダー
              nodeTextColor: '#212121', // ノードテキスト

              // 線とテキスト
              lineColor: '#37474f', // 線の色
              textColor: '#212121', // テキスト色
              mainBkg: '#ffffff', // メイン背景

              // フローチャート
              clusterBkg: '#e3f2fd', // クラスター背景
              clusterBorder: '#1565c0', // クラスターボーダー

              // シーケンス図
              actorBorder: '#1565c0', // アクター境界線
              actorBkg: '#bbdefb', // アクター背景
              actorTextColor: '#212121', // アクターテキスト
              actorLineColor: '#1565c0', // アクターライン
              signalColor: '#1e88e5', // シグナルライン

              // クラス図
              classText: '#212121', // クラステキスト

              // 状態図
              labelColor: '#212121', // ラベル

              // その他
              noteBkgColor: '#fff8e1', // メモ背景
              noteBorderColor: '#ffca28', // メモ境界線
              noteTextColor: '#212121', // メモテキスト
            };
          }
        }

        // 図の種類に応じた追加設定
        if (type === 'class' || type === 'er') {
          // クラス図とER図は大きめに表示
          config.fontSize = 14;
        } else if (type === 'state' || type === 'gantt') {
          // 状態遷移図とガントチャートはさらに大きく
          config.fontSize = 16;
        }

        // mermaid.initializeに型キャストを使用して渡す（型互換性の問題を回避）
        // @ts-ignore: 型の不一致があるが、動作上は問題ない
        mermaid.initialize(config);
        console.log('✅ Mermaid: 初期化完了');

        // ユニークなID生成
        const id = `mermaid-${Math.random().toString(36).substring(2, 11)}`;
        console.log(`🔄 Mermaid: レンダリング開始 (ID: ${id})`);
        console.log(
          '📊 Mermaid: チャートデータ',
          chart.substring(0, 100) + (chart.length > 100 ? '...' : '')
        );

        // レンダリング - コンテナに依存せずにSVGを生成
        const { svg } = await mermaid.render(id, chart);
        console.log(`✅ Mermaid: SVG生成完了 ${svg.substring(0, 100)}...`);

        // SVGを最適化
        const optimizedSvg = optimizeSvg(svg, type);

        // SVGをステートに保存
        setRenderedSvg(optimizedSvg);
        setError(null);
      } catch (err) {
        console.error('❌ Mermaid: レンダリングエラー', err);
        setError(
          err instanceof Error
            ? err.message
            : '図表のレンダリングに失敗しました'
        );

        // エラーの詳細情報を表示
        if (err instanceof Error) {
          console.error('エラー詳細:', {
            name: err.name,
            message: err.message,
            stack: err.stack,
          });
        }

        // チャートデータを表示（デバッグ用）
        console.log('📊 問題のあるチャートデータ:', chart);
      } finally {
        setIsLoading(false);
      }
    };

    loadMermaid();
  }, [chart, theme]);

  // SVGを最適化する関数
  const optimizeSvg = (svg: string, type: string): string => {
    // DOMParserを使用してSVG文字列をパース
    const parser = new DOMParser();
    const doc = parser.parseFromString(svg, 'image/svg+xml');
    const svgElement = doc.documentElement;

    // viewBox属性を取得または作成
    let viewBox = svgElement.getAttribute('viewBox');
    if (!viewBox) {
      // デフォルト値を大きくする（100ではなく800）
      const width = svgElement.getAttribute('width') || '800';
      const height = svgElement.getAttribute('height') || '600';
      viewBox = `0 0 ${width} ${height}`;
      svgElement.setAttribute('viewBox', viewBox);
    }

    // 幅と高さを設定（最大幅を制限）
    const originalWidth = Number.parseFloat(
      svgElement.getAttribute('width') || '800'
    );
    const originalHeight = Number.parseFloat(
      svgElement.getAttribute('height') || '600'
    );

    // 図の種類に応じた最小幅を設定
    let minWidth = 800;
    if (type === 'class' || type === 'er') {
      minWidth = 900;
    } else if (type === 'state' || type === 'gantt') {
      minWidth = 1000;
    }

    // 幅が最小幅より小さい場合は調整
    let adjustedWidth = originalWidth;
    if (originalWidth < minWidth) {
      adjustedWidth = minWidth;
      svgElement.setAttribute('width', `${adjustedWidth}px`);
    }

    // 図の種類に応じたスケーリング
    let maxWidth = 1000; // デフォルトの最大幅
    let scale = 1;

    // 図の種類に応じて最大幅とスケールを調整
    switch (type) {
      case 'class':
      case 'er':
        // クラス図とER図は大きめに表示
        maxWidth = 1000;
        scale = adjustedWidth > maxWidth ? maxWidth / adjustedWidth : 1;
        break;
      case 'state':
      case 'gantt':
        // 状態遷移図とガントチャートはさらに大きく
        maxWidth = 1000;
        scale = adjustedWidth > maxWidth ? maxWidth / adjustedWidth : 1;
        break;
      default:
        // その他の図は通常サイズ
        scale = adjustedWidth > maxWidth ? maxWidth / adjustedWidth : 1;
    }

    // スケールに応じてSVG属性を設定
    svgElement.setAttribute('width', `${adjustedWidth}px`);
    svgElement.setAttribute('height', `${originalHeight}px`);

    if (adjustedWidth > maxWidth) {
      // 大きすぎる場合はスケールダウン
      svgElement.setAttribute(
        'style',
        `max-width: ${maxWidth}px; transform-origin: 0 0; transform: scale(${scale});`
      );
    } else {
      // 通常サイズ
      svgElement.setAttribute('style', 'max-width: 100%;');
    }

    // 最適化されたSVG文字列を返す
    return new XMLSerializer().serializeToString(svgElement);
  };

  // SVGがレンダリングされたらDOMに挿入
  useEffect(() => {
    if (renderedSvg && containerRef.current) {
      containerRef.current.innerHTML = renderedSvg;
      console.log('✅ Mermaid: DOMに挿入完了');

      // SVG要素にスタイルを適用
      const svgElement = containerRef.current.querySelector('svg');
      if (svgElement) {
        // SVGの実際のサイズを確認
        const svgWidth = Number.parseFloat(
          svgElement.getAttribute('width') || '0'
        );

        // 幅が小さすぎる場合は調整
        if (svgWidth < 300) {
          // 図の種類に応じた適切なサイズに調整
          let newWidth = 800;
          if (diagramType === 'class' || diagramType === 'er') {
            newWidth = 900;
          } else if (diagramType === 'state' || diagramType === 'gantt') {
            newWidth = 1000;
          }

          svgElement.setAttribute('width', `${newWidth}px`);
          svgElement.style.width = `${newWidth}px`;
        }

        // 図の種類に応じたスタイル調整
        switch (diagramType) {
          case 'class':
            // SVGの属性を直接設定
            svgElement.setAttribute('width', '900px');
            svgElement.style.maxWidth = '1000px';
            applyClassDiagramStyles(svgElement);
            break;
          case 'er':
            // SVGの属性を直接設定
            svgElement.setAttribute('width', '900px');
            svgElement.style.maxWidth = '1000px';
            applyERDiagramStyles(svgElement);
            break;
          case 'state':
            // SVGの属性を直接設定
            svgElement.setAttribute('width', '1000px');
            svgElement.style.maxWidth = '1000px';
            applyStateDiagramStyles(svgElement);
            break;
          case 'gantt':
            // SVGの属性を直接設定
            svgElement.setAttribute('width', '1000px');
            svgElement.style.maxWidth = '1000px';
            applyGanttChartStyles(svgElement);
            break;
          default:
            applyDefaultStyles(svgElement);
        }
      }
    }
  }, [renderedSvg, diagramType]);

  // クラス図のスタイルを適用
  const applyClassDiagramStyles = (svgElement: SVGElement) => {
    // クラスボックスのスタイル
    const classNodes = svgElement.querySelectorAll('.classGroup');
    for (const node of classNodes) {
      const rect = node.querySelector('rect');
      if (rect) {
        (rect as SVGElement).style.minWidth = '180px';
        (rect as SVGElement).style.minHeight = '50px';
        (rect as SVGElement).style.rx = '4px';
        (rect as SVGElement).style.ry = '4px';
        // 影を追加
        (rect as SVGElement).style.filter =
          'drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.1))';
      }

      // クラス名のテキスト
      const titleText = node.querySelector('.classTitle');
      if (titleText) {
        (titleText as SVGElement).style.fontSize = '16px';
        (titleText as SVGElement).style.fontWeight = '600';
      }

      // メソッドとプロパティのテキスト
      const texts = node.querySelectorAll('text:not(.classTitle)');
      for (const text of texts) {
        (text as SVGElement).style.fontSize = '14px';
      }
    }

    // 関係線のスタイル
    const edges = svgElement.querySelectorAll('.relation');
    for (const edge of edges) {
      const path = edge.querySelector('path');
      if (path) {
        (path as SVGElement).style.strokeWidth = '2px';
      }
    }
  };

  // ER図のスタイルを適用
  const applyERDiagramStyles = (svgElement: SVGElement) => {
    // エンティティのスタイル
    const entities = svgElement.querySelectorAll('.er.entityBox');
    for (const entity of entities) {
      const rect = entity.querySelector('rect');
      if (rect) {
        (rect as SVGElement).style.minWidth = '180px';
        (rect as SVGElement).style.minHeight = '50px';
        (rect as SVGElement).style.rx = '4px';
        (rect as SVGElement).style.ry = '4px';
        // 影を追加
        (rect as SVGElement).style.filter =
          'drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.1))';
      }

      // エンティティ名のテキスト
      const titleText = entity.querySelector('.er.entityLabel');
      if (titleText) {
        (titleText as SVGElement).style.fontSize = '16px';
        (titleText as SVGElement).style.fontWeight = '600';
      }

      // 属性のテキスト
      const texts = entity.querySelectorAll('text:not(.er.entityLabel)');
      for (const text of texts) {
        (text as SVGElement).style.fontSize = '14px';
      }
    }

    // リレーションのスタイル
    const relations = svgElement.querySelectorAll('.er.relationshipLine');
    for (const relation of relations) {
      (relation as SVGElement).style.strokeWidth = '2px';
    }
  };

  // 状態遷移図のスタイルを適用
  const applyStateDiagramStyles = (svgElement: SVGElement) => {
    // 状態ノードのスタイル
    const stateNodes = svgElement.querySelectorAll('.stateGroup');
    for (const node of stateNodes) {
      const rect = node.querySelector('rect');
      if (rect) {
        (rect as SVGElement).style.minWidth = '150px';
        (rect as SVGElement).style.minHeight = '60px';
        (rect as SVGElement).style.rx = '8px';
        (rect as SVGElement).style.ry = '8px';
        // 影を追加
        (rect as SVGElement).style.filter =
          'drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.1))';
      }

      // 状態名のテキスト
      const texts = node.querySelectorAll('text');
      for (const text of texts) {
        (text as SVGElement).style.fontSize = '16px';
        (text as SVGElement).style.fontWeight = '500';
      }
    }

    // 遷移線のスタイル
    const transitions = svgElement.querySelectorAll('.transition');
    for (const transition of transitions) {
      const path = transition.querySelector('path');
      if (path) {
        (path as SVGElement).style.strokeWidth = '2px';
      }

      // 遷移ラベルのテキスト
      const label = transition.querySelector('text');
      if (label) {
        (label as SVGElement).style.fontSize = '14px';
      }
    }
  };

  // ガントチャートのスタイルを適用
  const applyGanttChartStyles = (svgElement: SVGElement) => {
    // タイトルのスタイル
    const title = svgElement.querySelector('.titleText');
    if (title) {
      (title as SVGElement).style.fontSize = '18px';
      (title as SVGElement).style.fontWeight = '600';
    }

    // セクション名のスタイル
    const sectionTitles = svgElement.querySelectorAll('.sectionTitle');
    for (const title of sectionTitles) {
      (title as SVGElement).style.fontSize = '16px';
      (title as SVGElement).style.fontWeight = '500';
    }

    // タスク名のスタイル
    const taskTexts = svgElement.querySelectorAll('.taskText');
    for (const text of taskTexts) {
      (text as SVGElement).style.fontSize = '14px';
    }

    // バーのスタイル
    const taskRects = svgElement.querySelectorAll('.task');
    for (const rect of taskRects) {
      (rect as SVGElement).style.height = '30px';
      (rect as SVGElement).style.rx = '4px';
      (rect as SVGElement).style.ry = '4px';
      // グラデーションを追加
      const fill = (rect as SVGElement).getAttribute('fill');
      if (fill) {
        // ガントチャートのバーに光沢効果を追加
        (rect as SVGElement).style.filter = 'brightness(1.05)';
      }
    }

    // グリッド線のスタイル
    const gridLines = svgElement.querySelectorAll('.grid .tick line');
    for (const line of gridLines) {
      (line as SVGElement).style.strokeWidth = '0.5px';
      (line as SVGElement).style.strokeDasharray = '4,4';
    }
  };

  // デフォルトのスタイルを適用
  const applyDefaultStyles = (svgElement: SVGElement) => {
    // ノードのスタイルを一定に保つための処理
    const nodes = svgElement.querySelectorAll('.node');
    for (const node of nodes) {
      const rect = node.querySelector('rect, circle, ellipse, polygon, path');
      if (rect) {
        // ノードの最小サイズを設定
        (rect as SVGElement).style.minWidth = '120px';
        (rect as SVGElement).style.minHeight = '40px';

        // 角丸と影を追加
        if (rect.tagName === 'rect') {
          (rect as SVGElement).style.rx = '4px';
          (rect as SVGElement).style.ry = '4px';
        }
        (rect as SVGElement).style.filter =
          'drop-shadow(0px 2px 3px rgba(0, 0, 0, 0.1))';

        // ノードの形状を保持
        (rect as SVGElement).style.transformBox = 'fill-box';
        (rect as SVGElement).style.transformOrigin = 'center';
      }

      // テキストのスタイルを調整
      const text = node.querySelector('text');
      if (text) {
        (text as SVGElement).style.fontSize = '14px';
        (text as SVGElement).style.fontWeight = '500';
      }
    }

    // エッジ（線）のスタイルを調整
    const edges = svgElement.querySelectorAll('.edgePath');
    for (const edge of edges) {
      const path = edge.querySelector('.path');
      if (path) {
        (path as SVGElement).style.strokeWidth = '1.5px';
      }

      // エッジラベルを強調
      const edgeLabel = edge.querySelector('.edgeLabel');
      if (edgeLabel) {
        const labelRect = edgeLabel.querySelector('rect');
        if (labelRect) {
          (labelRect as SVGElement).style.rx = '3px';
          (labelRect as SVGElement).style.ry = '3px';
          (labelRect as SVGElement).style.filter =
            'drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.05))';
        }
      }
    }

    // フローチャート特有の処理
    const clusters = svgElement.querySelectorAll('.cluster');
    for (const cluster of clusters) {
      const rect = cluster.querySelector('rect');
      if (rect) {
        (rect as SVGElement).style.rx = '4px';
        (rect as SVGElement).style.ry = '4px';
        (rect as SVGElement).style.filter =
          'drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.08))';
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
        <div className="animate-pulse text-gray-500 dark:text-gray-400">
          図表を読み込み中...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-red-300 bg-red-50 dark:bg-red-900/20 rounded-md">
        <h3 className="text-red-800 dark:text-red-400 font-medium">
          図表エラー
        </h3>
        <p className="text-red-600 dark:text-red-300 text-sm mt-1">{error}</p>
        <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs overflow-auto">
          {chart}
        </pre>
      </div>
    );
  }

  // 図の種類に応じたクラス名を追加
  const diagramClass = `mermaid-diagram mermaid-${diagramType}`;

  return (
    <div
      ref={containerRef}
      className={`${diagramClass} overflow-auto my-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-md shadow-sm`}
      style={{
        margin: '0 auto',
        border: '1px solid rgba(0,0,0,0.05)',
        transition: 'all 0.3s ease',
      }}
    />
  );
}
