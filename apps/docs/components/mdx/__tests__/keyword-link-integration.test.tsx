import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import KeywordLink from '../keyword-link';
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

describe('KeywordLink統合テスト', () => {
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

  it('サーバーコンポーネントからクライアントコンポーネントに正しくデータが渡されること', async () => {
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

    // JSONシリアライズされた文字列としてinitialDataを渡す
    const { container } = render(
      <KeywordLink
        initialData={JSON.stringify(mockData)}
        keyword="テスト"
        docType="docs"
      />
    );

    // ボタン要素が存在すること
    await waitFor(() => {
      const button = container.querySelector('button');
      expect(button).not.toBeNull();

      // テキストが正しいこと
      expect(button?.textContent).toContain('テスト');

      // クラス名が正しいこと
      expect(button?.className).toContain('keyword-link');
      expect(button?.className).toContain('text-blue-500');
    });
  });

  it('サーバーコンポーネントからエラー状態が正しく渡されること', async () => {
    const mockData: ResolvedKeyword = {
      keyword: 'エラー',
      docType: 'docs',
      isAmbiguous: false,
      error: 'キーワードが見つかりません',
    };

    // JSONシリアライズされた文字列としてinitialDataを渡す
    const { container } = render(
      <KeywordLink
        initialData={JSON.stringify(mockData)}
        keyword="エラー"
        docType="docs"
      />
    );

    // span要素が存在すること
    await waitFor(() => {
      const span = container.querySelector('span.keyword-link');
      expect(span).not.toBeNull();

      // テキストが正しいこと
      expect(span?.textContent).toContain('エラー');

      // クラス名が正しいこと
      expect(span?.className).toContain('keyword-link');
      expect(span?.className).toContain('text-red-500');
    });
  });

  it('サーバーコンポーネントから曖昧な参照が正しく渡されること', async () => {
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

    // JSONシリアライズされた文字列としてinitialDataを渡す
    const { container } = render(
      <KeywordLink
        initialData={JSON.stringify(mockData)}
        keyword="曖昧"
        docType="docs"
      />
    );

    // ボタン要素が存在すること
    await waitFor(() => {
      const button = container.querySelector('button');
      expect(button).not.toBeNull();

      // テキストが正しいこと
      expect(button?.textContent).toContain('曖昧');

      // クラス名が正しいこと
      expect(button?.className).toContain('keyword-link');
      expect(button?.className).toContain('text-yellow-600');
    });
  });

  it('initialDataがない場合はAPIを呼び出すこと', async () => {
    const { container } = render(<KeywordLink keyword="API" docType="docs" />);

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
});
