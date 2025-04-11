import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import KeywordLink from '../keyword-link';
import { KeywordLinkClient } from '../keyword-link-client';
import type { ResolvedKeyword, KeywordLinkProps } from '~/lib/mdx/types';

// モックの設定
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

// KeywordLinkClientコンポーネントをモック
vi.mock('../KeywordLinkClient', () => ({
  KeywordLinkClient: vi.fn().mockImplementation(({ initialData }) => (
    <div data-testid="keyword-link-client">
      <span data-testid="keyword">{initialData.keyword}</span>
      <span data-testid="doc-type">{initialData.docType || 'なし'}</span>
      <span data-testid="is-ambiguous">
        {initialData.isAmbiguous ? 'はい' : 'いいえ'}
      </span>
      <span data-testid="error">{initialData.error || 'なし'}</span>
    </div>
  )),
}));

describe('KeywordLinkコンポーネント', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('基本的なプロパティを正しく渡すこと', () => {
    render(<KeywordLink keyword="テスト" docType="docs" />);

    // モックの呼び出し引数を検証
    const mockCalls = vi.mocked(KeywordLinkClient).mock.calls;
    expect(mockCalls.length).toBe(1);

    const props = mockCalls[0]?.[0];
    expect(props).toEqual({
      keyword: 'テスト',
      docType: 'docs',
      className: undefined,
      initialData: {
        keyword: 'テスト',
        docType: 'docs',
        isAmbiguous: false,
      },
    });
  });

  it('文字列形式のinitialDataを正しくパースすること', () => {
    const mockData: ResolvedKeyword = {
      keyword: 'テスト',
      docType: 'api',
      isAmbiguous: true,
      mapping: {
        path: '/api/test',
        slug: 'test',
        docType: 'api',
        metadata: {
          title: 'テストAPI',
          description: 'テスト用のAPI',
          path: '/api/test',
          slug: 'test',
          docType: 'api',
          keywords: ['テスト'],
          lastModified: '2023-01-01',
        },
        keywords: ['テスト'],
      },
    };

    // KeywordLinkPropsのinitialDataはstring | ResolvedKeywordの型
    const props: KeywordLinkProps = {
      keyword: 'テスト',
      docType: 'api',
      initialData: JSON.stringify(mockData),
    };

    render(<KeywordLink {...props} />);

    // モックの呼び出し引数を検証
    const mockCalls = vi.mocked(KeywordLinkClient).mock.calls;
    expect(mockCalls.length).toBe(1);

    const calledProps = mockCalls[0]?.[0];
    if (!calledProps) {
      fail('KeywordLinkClientが呼び出されていません');
      return;
    }

    expect(calledProps.keyword).toBe('テスト');
    expect(calledProps.docType).toBe('api');
    expect(calledProps.initialData.keyword).toBe('テスト');
    expect(calledProps.initialData.docType).toBe('api');
    expect(calledProps.initialData.isAmbiguous).toBe(true);
    expect(calledProps.initialData.mapping).toBeDefined();
    expect(calledProps.initialData.mapping?.path).toBe('/api/test');
  });

  it('不正なJSON文字列の場合はエラーを設定すること', () => {
    // コンソールエラーをモック
    const consoleErrorMock = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    // KeywordLinkPropsのinitialDataはstring | ResolvedKeywordの型
    const props: KeywordLinkProps = {
      keyword: 'テスト',
      docType: 'docs',
      initialData: '{不正なJSON}',
    };

    render(<KeywordLink {...props} />);

    expect(consoleErrorMock).toHaveBeenCalled();

    // モックの呼び出し引数を検証
    const mockCalls = vi.mocked(KeywordLinkClient).mock.calls;
    expect(mockCalls.length).toBe(1);

    const calledProps = mockCalls[0]?.[0];
    if (!calledProps) {
      fail('KeywordLinkClientが呼び出されていません');
      return;
    }

    expect(calledProps.keyword).toBe('テスト');
    expect(calledProps.docType).toBe('docs');
    expect(calledProps.initialData.keyword).toBe('テスト');
    expect(calledProps.initialData.docType).toBe('docs');
    expect(calledProps.initialData.isAmbiguous).toBe(false);
    expect(calledProps.initialData.error).toBe('データのパースに失敗しました');

    consoleErrorMock.mockRestore();
  });

  it('initialDataがない場合はデフォルト値を設定すること', () => {
    render(<KeywordLink keyword="テスト" />);

    // モックの呼び出し引数を検証
    const mockCalls = vi.mocked(KeywordLinkClient).mock.calls;
    expect(mockCalls.length).toBe(1);

    const calledProps = mockCalls[0]?.[0];
    if (!calledProps) {
      fail('KeywordLinkClientが呼び出されていません');
      return;
    }

    expect(calledProps.keyword).toBe('テスト');
    expect(calledProps.docType).toBeUndefined();
    expect(calledProps.initialData.keyword).toBe('テスト');
    expect(calledProps.initialData.isAmbiguous).toBe(false);
  });
});
