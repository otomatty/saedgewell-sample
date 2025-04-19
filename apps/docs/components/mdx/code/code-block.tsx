'use client';

import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { CopyButton } from './copy-button';
import hljs from 'highlight.js';
import 'highlight.js/styles/vs2015.css'; // シンタックスハイライトのテーマを選択

// MermaidRendererコンポーネントを動的にインポート
const MermaidRenderer = dynamic(
  () =>
    import('../mermaid/mermaid-renderer').then((mod) => mod.MermaidRenderer),
  {
    ssr: false,
    loading: () => (
      <div className="flex justify-center items-center p-4 border border-gray-200 rounded-md bg-gray-50">
        <p className="text-gray-500">図を読み込み中...</p>
      </div>
    ),
  }
);

// MermaidWrapperコンポーネントを動的にインポート
const MermaidWrapper = dynamic(
  () => import('../mermaid/mermaid-wrapper').then((mod) => mod.MermaidWrapper),
  {
    ssr: false,
    loading: () => (
      <div className="flex justify-center items-center p-4 border border-gray-200 rounded-md bg-gray-50">
        <p className="text-gray-500">図を読み込み中...</p>
      </div>
    ),
  }
);

/**
 * コードエレメントのprops型定義
 */
interface CodeElementProps {
  className?: string;
  children?: React.ReactNode;
  [key: string]: unknown;
}

interface CodeProps {
  'data-language'?: string;
  'data-theme'?: string;
  className?: string;
  children?: React.ReactNode;
  [key: string]: unknown;
}

/**
 * コードブロックコンポーネント
 */
export function CodeBlock({ className, children, ...props }: CodeElementProps) {
  // codeElementの取得
  const codeElement = React.Children.toArray(children).find(
    (child) => React.isValidElement(child) && child.type === 'code'
  ) as React.ReactElement<CodeProps>;

  // 言語の抽出
  let language = '';
  if (codeElement?.props) {
    // className から言語を抽出する試み
    if (codeElement.props.className) {
      const match = /language-(\w+)/.exec(
        codeElement.props.className as string
      );
      if (match) {
        language = match[1] || '';
      }
    }

    // data-language から言語を抽出する試み
    if (!language && codeElement.props['data-language']) {
      language = codeElement.props['data-language'] as string;
    }

    // クラス名に 'language-mermaid' が含まれているかチェック
    if (
      !language &&
      codeElement.props.className &&
      typeof codeElement.props.className === 'string' &&
      codeElement.props.className.includes('mermaid')
    ) {
      language = 'mermaid';
    }

    // コンテンツに 'graph' や 'sequenceDiagram' などのMermaid特有のキーワードが含まれているかチェック
    if (!language && codeElement.props.children) {
      const codeContent =
        typeof codeElement.props.children === 'string'
          ? codeElement.props.children
          : Array.isArray(codeElement.props.children)
            ? codeElement.props.children.join('')
            : '';

      if (
        codeContent.includes('graph ') ||
        codeContent.includes('sequenceDiagram') ||
        codeContent.includes('classDiagram') ||
        codeContent.includes('stateDiagram') ||
        codeContent.includes('gantt') ||
        codeContent.includes('pie title') ||
        codeContent.includes('erDiagram')
      ) {
        language = 'mermaid';
      }
    }
  }

  // コードの取得
  let code = '';
  if (codeElement?.props?.children) {
    if (Array.isArray(codeElement.props.children)) {
      code = codeElement.props.children
        .map((child) => {
          if (typeof child === 'string') return child;
          if (child && typeof child === 'object') {
            // オブジェクト型の子要素からテキストを抽出する試み
            if (React.isValidElement(child)) {
              // 型アサーションを使用して型エラーを回避
              const props = child.props as { children?: React.ReactNode };

              // 子要素がテキストの場合
              if (typeof props.children === 'string') {
                return props.children;
              }

              // 子要素が配列の場合
              if (Array.isArray(props.children)) {
                // 再帰的に子要素からテキストを抽出
                const extractedText = props.children
                  .map((grandChild: React.ReactNode) => {
                    if (typeof grandChild === 'string') return grandChild;
                    // さらに再帰的に抽出を試みる
                    if (React.isValidElement(grandChild)) {
                      const grandProps = grandChild.props as {
                        children?: React.ReactNode;
                      };
                      if (typeof grandProps.children === 'string') {
                        return grandProps.children;
                      }
                    }
                    return '';
                  })
                  .join('');

                return extractedText;
              }

              // 子要素がオブジェクトの場合（例：React要素）
              if (props.children && React.isValidElement(props.children)) {
                const childProps = props.children.props as {
                  children?: string;
                };
                return typeof childProps.children === 'string'
                  ? childProps.children
                  : '';
              }
            }
          }
          return '';
        })
        .join('');
    } else if (typeof codeElement.props.children === 'string') {
      code = codeElement.props.children;
    }
  }

  useEffect(() => {
    // クライアントサイドでhighlight.jsを初期化
    hljs.configure({
      languages: [
        'javascript',
        'typescript',
        'jsx',
        'tsx',
        'html',
        'css',
        'json',
        'bash',
        'markdown',
        'sql',
        'yaml',
        'python',
        'go',
      ],
    });

    // ページ内のすべてのコードブロックにハイライトを適用
    const blocks = document.querySelectorAll('pre code:not(.mermaid)');
    for (const block of blocks) {
      hljs.highlightElement(block as HTMLElement);
    }
  }, []); // code と language が変わったときにハイライトを再適用

  // Mermaidダイアグラムの場合
  if (language === 'mermaid') {
    // Mermaidのテーマ設定を抽出
    let theme: 'default' | 'forest' | 'dark' | 'neutral' | 'custom' = 'default';

    // コードブロックにテーマの指定があるか確認
    if (className && typeof className === 'string') {
      if (className.includes('theme-forest')) {
        theme = 'forest';
      } else if (className.includes('theme-dark')) {
        theme = 'dark';
      } else if (className.includes('theme-neutral')) {
        theme = 'neutral';
      } else if (className.includes('theme-custom')) {
        theme = 'custom';
      }
    }

    return (
      <div className="mermaid-container">
        <MermaidWrapper chart={code} theme={theme} />
      </div>
    );
  }

  // highlight.jsによってハイライトされたコードブロックの場合
  // className に 'hljs' が含まれている場合は、そのまま返す
  if (className?.includes('hljs')) {
    return (
      <div className="relative">
        <CopyButton code={code} />
        <pre className={className} {...props}>
          {children}
        </pre>
      </div>
    );
  }

  // 通常のコードブロックの場合
  return (
    <pre
      className={`${className || ''} language-${language || 'text'} relative p-6`}
      {...props}
    >
      {language && (
        <div className="absolute top-0 right-0 bg-gray-700 text-white px-2 py-1 text-xs rounded-bl">
          {language}
        </div>
      )}
      <CopyButton code={code} />
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === 'code') {
          // コード要素に言語クラスを追加
          const childElement = child as React.ReactElement<CodeProps>;
          return React.cloneElement(childElement, {
            className: `${childElement.props.className || ''} language-${language || 'text'}`,
            'data-language': language || 'text',
          });
        }
        return child;
      })}
    </pre>
  );
}

/**
 * インラインコードコンポーネント
 */
export function InlineCode({
  className,
  children,
  ...props
}: CodeElementProps) {
  // language の抽出
  let language = '';
  if (className) {
    const match = /language-(\w+)/.exec(className);
    if (match) {
      language = match[1] || '';
    }
  }

  // コードの取得
  let code = '';
  if (children) {
    if (typeof children === 'string') {
      code = children;
    } else if (Array.isArray(children)) {
      code = children
        .map((child) => (typeof child === 'string' ? child : ''))
        .join('');
    }
  }

  // ハイライト適用のeffect
  useEffect(() => {
    if (language && code && className?.includes('language-')) {
      // highlight.jsを適用するコード要素を取得
      const codeElements = document.querySelectorAll(
        `code.language-${language}:not(.hljs)`
      );
      for (const el of codeElements) {
        hljs.highlightElement(el as HTMLElement);
      }
    }
  }, [language, code, className]);

  // インラインコードの場合
  if (!className || !className.startsWith('language-')) {
    return (
      <code
        className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm"
        {...props}
      >
        {children}
      </code>
    );
  }

  // highlight.jsによってハイライトされたコードの場合
  if (className?.includes('hljs')) {
    return (
      <code className={`${className} bg-transparent`} {...props}>
        {children}
      </code>
    );
  }

  // 言語に応じたクラス名を追加
  return (
    <code
      className={`${className} language-${language} bg-transparent`}
      data-language={language}
      {...props}
    >
      {children}
    </code>
  );
}
