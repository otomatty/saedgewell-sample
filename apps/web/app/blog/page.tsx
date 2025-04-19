import type { Metadata } from 'next';
import { BlogHero } from './_components/blog-hero';
import { BlogCard } from './_components/blog-card';
import { Input } from '@kit/ui/input';
import { Badge } from '@kit/ui/badge';
import { getBlogPosts, getBlogCategories } from '@kit/next/actions';
import type { BlogCategory, BlogPost } from '@kit/types';
import { Container } from '../../components/layout/container';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Web開発、プログラミング、キャリアについての記事を発信しています。',
};

export default async function BlogPage() {
  // Server Actionsを使用してデータを取得
  const [posts, categories] = await Promise.all([
    getBlogPosts() as Promise<BlogPost[]>,
    getBlogCategories(),
  ]);

  // カテゴリー名の配列を作成
  const categoryNames = categories.map((category) => category.name);

  return (
    <main>
      <BlogHero />
      <Container>
        {/* 検索とフィルター */}
        <div className="mb-12 space-y-6">
          <Input
            type="search"
            placeholder="記事を検索..."
            className="max-w-md"
          />
          <div className="flex flex-wrap gap-2">
            {categoryNames.map((category) => (
              <Badge
                key={category}
                variant="outline"
                className="cursor-pointer"
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* 記事一覧 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post: BlogPost) => (
            <BlogCard
              key={post.id}
              title={post.title}
              description={post.description}
              slug={post.slug}
              thumbnail={post.thumbnail_url ?? ''}
              publishedAt={post.created_at || ''}
              categories={post.blog_posts_categories
                .map((pc) => pc.blog_categories?.name)
                .filter((name): name is string => name !== undefined)}
              estimatedReadingTime={post.estimated_reading_time}
            />
          ))}
        </div>
      </Container>
    </main>
  );
}
