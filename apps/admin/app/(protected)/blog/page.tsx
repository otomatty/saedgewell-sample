import { Suspense } from 'react';
import { PageHeader } from '@kit/ui/page-header';
import {
  getBlogPostsForAdmin,
  getBlogStats,
  getBlogPostsCountByCategory,
  getDraftBlogPostsCount,
} from '@kit/next/actions';
import { StatsCard } from './_components/stats-card';
import { Book, BookOpenCheck, Tag, File } from 'lucide-react';
import { BlogPostList } from './_components/blog-post-list';
import Link from 'next/link';
import { Button } from '@kit/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';

export const metadata = {
  title: 'ブログ管理',
  description: 'ブログ記事の管理と統計情報を確認できます。',
};

const LOADING_ITEMS = {
  stats: Array.from({ length: 4 }, (_, i) => `stats-list-skeleton-${i + 1}`),
};

const AdminPostsPage = async () => {
  const [blogPosts, stats, categoryCounts, draftCount] = await Promise.all([
    getBlogPostsForAdmin(),
    getBlogStats(),
    getBlogPostsCountByCategory(),
    getDraftBlogPostsCount(),
  ]);

  return (
    <div className="space-y-4">
      <PageHeader
        title="ブログ管理"
        actions={
          <Link href="/admin/posts/create">
            <Button>ブログ記事を作成</Button>
          </Link>
        }
      />
      <div className="container">
        <div className="space-y-8">
          <Suspense
            fallback={
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {LOADING_ITEMS.stats.map((id) => (
                  <Card key={id}>
                    <CardContent className="pt-6">
                      <div className="h-20 bg-muted animate-pulse rounded" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            }
          >
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <StatsCard
                title="総記事数"
                value={stats.totalPosts}
                icon={<Book />}
              />
              <StatsCard
                title="公開済み記事数"
                value={stats.totalPublishedPosts}
                icon={<BookOpenCheck />}
              />
              <StatsCard
                title="下書き記事数"
                value={draftCount}
                icon={<File />}
              />
              {categoryCounts.map((category) => (
                <StatsCard
                  key={category.id}
                  title={`${category.name}の記事数`}
                  value={category.count}
                  icon={<Tag />}
                />
              ))}
            </div>
          </Suspense>

          <Suspense
            fallback={
              <Card>
                <CardHeader>
                  <CardTitle>最近のブログ記事</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="h-48 bg-muted animate-pulse rounded" />
                </CardContent>
              </Card>
            }
          >
            <div>
              <h2 className="text-2xl font-bold mb-4">最近のブログ記事</h2>
              <BlogPostList blogPosts={blogPosts} />
            </div>
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default AdminPostsPage;
