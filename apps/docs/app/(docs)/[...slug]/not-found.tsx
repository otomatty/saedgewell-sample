import Link from 'next/link';
import { Button } from '@kit/ui/button';
import { Search } from 'lucide-react';
import {
  findSimilarDocuments,
  type SimplifiedDoc,
} from '~/lib/mdx/similar-docs';

/**
 * ドキュメントが見つからない場合のカスタムエラーページ
 * ユーザーに役立つ情報と代替アクションを提供します
 */
export default async function DocNotFound() {
  // 関連ドキュメントを検索
  let suggestedDocs: SimplifiedDoc[] = [];

  try {
    // 一般的なドキュメントを検索
    suggestedDocs = await findSimilarDocuments('documentation', 5);
  } catch (error) {
    console.error('関連ドキュメントの検索中にエラーが発生しました:', error);
  }

  return (
    <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[70vh]">
      <div className="bg-white dark:bg-gray-800 p-8 max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-center mb-6">
          ドキュメントが見つかりません
        </h1>

        <div className="space-y-6">
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-md p-4">
            <h2 className="text-lg font-semibold text-amber-800 dark:text-amber-300 mb-2">
              考えられる原因
            </h2>
            <ul className="list-disc list-inside space-y-2 text-amber-700 dark:text-amber-400">
              <li>URLが間違っている可能性があります</li>
              <li>ドキュメントが移動または削除された可能性があります</li>
              <li>
                リンク先のドキュメントがまだ作成されていない可能性があります
              </li>
            </ul>
          </div>

          {suggestedDocs.length > 0 && (
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-md p-4">
              <h2 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-2">
                おすすめのドキュメント
              </h2>
              <ul className="space-y-2">
                {suggestedDocs.map((doc: SimplifiedDoc) => (
                  <li key={doc.path}>
                    <Link
                      href={doc.path}
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {doc.title}
                    </Link>
                    {doc.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {doc.description}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-4">
            <h2 className="text-lg font-semibold mb-2">
              次のアクションをお試しください
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              <Link href="/" className="no-underline">
                <Button variant="outline" className="w-full">
                  ホームページに戻る
                </Button>
              </Link>

              <Link href="/search" className="no-underline">
                <Button className="w-full flex items-center justify-center gap-2">
                  <Search size={16} />
                  <span>ドキュメントを検索</span>
                </Button>
              </Link>
            </div>

            <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
              <p>
                このエラーが継続する場合は、
                <a
                  href="https://github.com/your-repo/issues/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  問題を報告
                </a>
                してください。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
