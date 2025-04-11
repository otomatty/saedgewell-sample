import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    // SSR 時のエラーを防ぐために window オブジェクトの存在を確認
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      // ローカルストレージから取得した値があればそれをパースし、なければ初期値を返す
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // エラーが発生した場合は初期値を返し、コンソールにエラーを出力
      console.error(`Error reading localStorage key “${key}”:`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    // SSR 時のエラーを防ぐために window オブジェクトの存在を確認
    if (typeof window !== 'undefined') {
      try {
        // 状態が変更されたらローカルストレージに保存
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        // エラーが発生した場合はコンソールにエラーを出力
        console.error(`Error setting localStorage key “${key}”:`, error);
      }
    }
  }, [key, value]);

  return [value, setValue] as const;
}
