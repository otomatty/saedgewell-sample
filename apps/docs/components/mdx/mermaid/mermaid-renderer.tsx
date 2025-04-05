'use client';

import React, { useEffect, useRef } from 'react';

interface MermaidRendererProps {
  chart: string;
}

export function MermaidRenderer({ chart }: MermaidRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartId = useRef(
    `mermaid-${Math.random().toString(36).substring(2, 9)}`
  );

  // デバッグ: 受け取ったチャートの内容を確認
  console.log('🔍 DEBUG - MermaidRenderer received chart:', {
    chartLength: chart?.length || 0,
    chartPreview: chart
      ? chart.substring(0, 100) + (chart.length > 100 ? '...' : '')
      : '',
    chartId: chartId.current,
    containsMermaidKeywords:
      chart?.includes('graph ') ||
      chart?.includes('sequenceDiagram') ||
      chart?.includes('classDiagram') ||
      chart?.includes('stateDiagram') ||
      chart?.includes('gantt') ||
      chart?.includes('pie title') ||
      chart?.includes('erDiagram'),
  });

  useEffect(() => {
    // Mermaidをロードして初期化
    const renderChart = async () => {
      try {
        if (!containerRef.current) return;

        // デバッグ: Mermaidレンダリング開始
        console.log('🔍 DEBUG - Starting Mermaid rendering process');

        // Mermaidをダイナミックインポート
        const mermaid = (await import('mermaid')).default;

        // Mermaidを初期化
        mermaid.initialize({
          startOnLoad: false,
          theme: 'neutral',
          securityLevel: 'loose',
          fontFamily: 'inherit',
        });

        // デバッグ: Mermaid初期化完了
        console.log('🔍 DEBUG - Mermaid initialized');

        // コンテナをクリア
        containerRef.current.innerHTML = '';

        // チャートをレンダリング
        try {
          // デバッグ: チャートのレンダリング開始
          console.log('🔍 DEBUG - Rendering chart with ID:', chartId.current);

          const { svg } = await mermaid.render(chartId.current, chart);

          // デバッグ: SVGの生成成功
          console.log('🔍 DEBUG - SVG generated successfully:', {
            svgLength: svg?.length || 0,
            svgPreview: svg
              ? svg.substring(0, 100) + (svg.length > 100 ? '...' : '')
              : '',
          });

          if (containerRef.current) {
            containerRef.current.innerHTML = svg;

            // SVG要素のスタイルを調整
            const svgElement = containerRef.current.querySelector('svg');
            if (svgElement) {
              svgElement.setAttribute('width', '100%');
              svgElement.setAttribute('height', 'auto');
              svgElement.style.maxWidth = '100%';

              // デバッグ: SVGスタイル適用完了
              console.log('🔍 DEBUG - SVG styles applied');
            } else {
              // デバッグ: SVG要素が見つからない
              console.log('🔍 DEBUG - No SVG element found in rendered output');
            }
          }
        } catch (renderError) {
          // デバッグ: レンダリングエラー
          console.error('🔍 DEBUG - Render error:', renderError);

          // 構文チェックを試みる
          try {
            await mermaid.parse(chart);
            console.log('🔍 DEBUG - Parse successful but render failed');
          } catch (parseError) {
            console.error('🔍 DEBUG - Parse error:', parseError);
          }

          throw renderError;
        }
      } catch (error) {
        console.error(
          'Mermaidダイアグラムのレンダリングに失敗しました:',
          error
        );

        if (containerRef.current) {
          containerRef.current.innerHTML = `
            <div class="p-4 bg-red-50 text-red-500 rounded border border-red-200">
              <p class="font-bold">ダイアグラムのレンダリングエラー</p>
              <p>${error instanceof Error ? error.message : '不明なエラー'}</p>
            </div>
          `;
        }
      }
    };

    renderChart();
  }, [chart]);

  return (
    <div className="mermaid-container">
      <div
        ref={containerRef}
        className="mermaid-diagram bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm max-w-full"
      >
        <div className="flex justify-center items-center p-4">
          <p className="text-gray-500">図を読み込み中...</p>
        </div>
      </div>
    </div>
  );
}
