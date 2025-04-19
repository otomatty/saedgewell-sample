import { atom } from 'jotai';

// 画像URLをキャッシュするためのatomを定義
// キー: 元のURL、値: 最適化されたURL
export const imageUrlAtom = atom<Map<string, string>>(new Map());

// キャッシュされたURLから取得する関数
export const getOptimizedUrl = (
  cache: Map<string, string>,
  originalUrl: string
): string | null => {
  return cache.get(originalUrl) || null;
};

// キャッシュにURLを追加する関数
export const addToCache = (
  cache: Map<string, string>,
  originalUrl: string,
  optimizedUrl: string
): Map<string, string> => {
  const newCache = new Map(cache);
  newCache.set(originalUrl, optimizedUrl);
  return newCache;
};

// キャッシュ更新用のatomを作成
export const updateImageUrlAtom = atom(
  (get) => get(imageUrlAtom),
  (
    get,
    set,
    { originalUrl, optimizedUrl }: { originalUrl: string; optimizedUrl: string }
  ) => {
    const currentCache = get(imageUrlAtom);
    set(imageUrlAtom, addToCache(currentCache, originalUrl, optimizedUrl));
  }
);

// 画像の読み込み状態を追跡するatom
// キー: 画像ID、値: { loading: boolean, ready: boolean }
export type ImageState = {
  loading: boolean;
  ready: boolean;
};

export const imageStatesAtom = atom<Map<string, ImageState>>(new Map());

// 画像状態更新用のatomを作成
export const updateImageStateAtom = atom(
  (get) => get(imageStatesAtom),
  (
    get,
    set,
    {
      id,
      state,
    }: {
      id: string;
      state: ImageState;
    }
  ) => {
    const currentStates = get(imageStatesAtom);
    const newStates = new Map(currentStates);
    newStates.set(id, state);
    set(imageStatesAtom, newStates);
  }
);
