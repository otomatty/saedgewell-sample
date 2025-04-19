import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { KeywordLinkClient } from '../keyword-link-client';
import type { ResolvedKeyword } from '~/lib/mdx/types';

// モックの設定
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// グローバルのfetchをモック
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('KeywordLinkClientコンポーネント', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        keyword: 'テスト',
        isAmbiguous: false,
        mapping: {
          path: '/docs/test',
          slug: 'test',
          docType: 'docs',
          metadata: {
            title: 'テストドキュメント',
            description: 'テスト用のドキュメント',
            path: '/docs/test',
            slug: 'test',
            docType: 'docs',
            keywords: ['テスト'],
            lastModified: '2023-01-01',
          },
          keywords: ['テスト'],
        },
      }),
    });
  });

  it('有効なリンクが正しく表示されること', () => {
    const mockData: ResolvedKeyword = {
      keyword: 'テスト',
      docType: 'docs',
      isAmbiguous: false,
      mapping: {
        path: '/docs/test',
        slug: 'test',
        docType: 'docs',
        metadata: {
          title: 'テストドキュメント',
          description: 'テスト用のドキュメント',
          path: '/docs/test',
          slug: 'test',
          docType: 'docs',
          keywords: ['テスト'],
          lastModified: '2023-01-01',
        },
        keywords: ['テスト'],
      },
    };

    const { container } = render(
      <KeywordLinkClient
        initialData={mockData}
        keyword="テスト"
        docType="docs"
      />
    );

    // ボタン要素が存在すること
    const button = container.querySelector('button');
    expect(button).not.toBeNull();

    // テキストが正しいこと
    expect(button?.textContent).toContain('テスト');

    // クラス名が正しいこと
    expect(button?.className).toContain('keyword-link');
    expect(button?.className).toContain('text-blue-500');

    // ツールチップが正しいこと
    expect(button?.getAttribute('title')).toContain('テストドキュメント');
    expect(button?.getAttribute('title')).toContain('テスト用のドキュメント');
  });

  it('エラー状態が正しく表示されること', () => {
    const mockData: ResolvedKeyword = {
      keyword: 'エラー',
      docType: 'docs',
      isAmbiguous: false,
      error: 'キーワードが見つかりません',
    };

    const { container } = render(
      <KeywordLinkClient
        initialData={mockData}
        keyword="エラー"
        docType="docs"
      />
    );

    // span要素が存在すること
    const span = container.querySelector('span.keyword-link');
    expect(span).not.toBeNull();

    // テキストが正しいこと
    expect(span?.textContent).toContain('エラー');

    // クラス名が正しいこと
    expect(span?.className).toContain('keyword-link');
    expect(span?.className).toContain('text-red-500');

    // ツールチップが正しいこと
    expect(span?.getAttribute('title')).toContain('キーワードが見つかりません');

    // エラーアイコンが表示されていること
    const errorIcon = container.querySelector('span.ml-1');
    expect(errorIcon).not.toBeNull();
  });

  it('曖昧な参照が正しく表示されること', () => {
    const mockData: ResolvedKeyword = {
      keyword: '曖昧',
      docType: 'docs',
      isAmbiguous: true,
      mapping: {
        path: '/docs/ambiguous',
        slug: 'ambiguous',
        docType: 'docs',
        metadata: {
          title: '曖昧なドキュメント',
          description: '曖昧な参照のテスト',
          path: '/docs/ambiguous',
          slug: 'ambiguous',
          docType: 'docs',
          keywords: ['曖昧'],
          lastModified: '2023-01-01',
        },
        keywords: ['曖昧'],
      },
      alternatives: [
        {
          path: '/docs/ambiguous2',
          slug: 'ambiguous2',
          docType: 'docs',
          metadata: {
            title: '曖昧なドキュメント2',
            description: '曖昧な参照のテスト2',
            path: '/docs/ambiguous2',
            slug: 'ambiguous2',
            docType: 'docs',
            keywords: ['曖昧'],
            lastModified: '2023-01-01',
          },
          keywords: ['曖昧'],
        },
      ],
    };

    const { container } = render(
      <KeywordLinkClient initialData={mockData} keyword="曖昧" docType="docs" />
    );

    // ボタン要素が存在すること
    const button = container.querySelector('button');
    expect(button).not.toBeNull();

    // テキストが正しいこと
    expect(button?.textContent).toContain('曖昧');

    // クラス名が正しいこと
    expect(button?.className).toContain('keyword-link');
    expect(button?.className).toContain('text-yellow-600');

    // ツールチップが正しいこと
    expect(button?.getAttribute('title')).toContain('曖昧なドキュメント');
    expect(button?.getAttribute('title')).toContain('複数の候補があります');

    // 曖昧アイコンが表示されていること
    const ambiguousIcon = container.querySelector('span.ml-1');
    expect(ambiguousIcon).not.toBeNull();
  });

  it('クリック時に正しいURLにナビゲートすること', () => {
    const mockData: ResolvedKeyword = {
      keyword: 'テスト',
      docType: 'docs',
      isAmbiguous: false,
      mapping: {
        path: '/docs/test',
        slug: 'test',
        docType: 'docs',
        metadata: {
          title: 'テストドキュメント',
          description: 'テスト用のドキュメント',
          path: '/docs/test',
          slug: 'test',
          docType: 'docs',
          keywords: ['テスト'],
          lastModified: '2023-01-01',
        },
        keywords: ['テスト'],
      },
    };

    const { container } = render(
      <KeywordLinkClient
        initialData={mockData}
        keyword="テスト"
        docType="docs"
      />
    );

    // ボタンをクリック
    const button = container.querySelector('button');
    expect(button).not.toBeNull();
    if (button) {
      fireEvent.click(button);
    }

    // 正しいURLにナビゲートすること
    expect(mockPush).toHaveBeenCalledWith('/docs/test');
  });

  it('初期データがない場合はAPIを呼び出すこと', async () => {
    const mockData: ResolvedKeyword = {
      keyword: 'API',
      isAmbiguous: false,
    };

    render(
      <KeywordLinkClient initialData={mockData} keyword="API" docType="docs" />
    );

    // APIが呼び出されること
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
      const calls = mockFetch.mock.calls;
      expect(calls.length).toBeGreaterThan(0);

      if (calls.length > 0 && calls[0] && calls[0][0]) {
        const url = calls[0][0] as string;
        expect(url).toContain('/api/resolve-keyword');
        expect(url).toContain('keyword=API');
        expect(url).toContain('docType=docs');
      }
    });
  });

  it('APIエラー時にエラー表示されること', async () => {
    // APIエラーをモック
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });

    const mockData: ResolvedKeyword = {
      keyword: 'エラーAPI',
      isAmbiguous: false,
    };

    const { container } = render(
      <KeywordLinkClient
        initialData={mockData}
        keyword="エラーAPI"
        docType="docs"
      />
    );

    // エラー表示を待機
    await waitFor(() => {
      const span = container.querySelector('span.text-red-500');
      expect(span).not.toBeNull();
      if (span) {
        expect(span.textContent).toContain('エラーAPI');
      }
    });
  });
});
