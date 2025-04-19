import '@testing-library/jest-dom';
import { vi, afterEach } from 'vitest';

// グローバルなモックの設定
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

// グローバルなfetchのモック
global.fetch = vi.fn();

// テスト後のクリーンアップ
afterEach(() => {
  vi.clearAllMocks();
});
