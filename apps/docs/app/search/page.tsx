import { Suspense } from 'react';
import { SearchResults } from './_components/search-results';
import { SearchInput } from '~/components/search/search-input';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }> | { q?: string };
}) {
  // searchParamsを非同期で処理
  const params = await searchParams;
  const query = params.q || '';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-3xl font-bold">検索結果</h1>

        <div className="mb-8">
          <SearchInput />
        </div>

        <Suspense fallback={<div>検索中...</div>}>
          <SearchResults query={query} />
        </Suspense>
      </div>
    </div>
  );
}
