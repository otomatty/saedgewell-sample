'use server';

import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { getSupabaseServerAdminClient } from '@kit/supabase/server-admin-client';
import { revalidatePath } from 'next/cache';
import { snakeToCamel } from '@kit/shared/utils';
import type { BlogPost, BlogCategory } from '@kit/types/blog';

/**
 * 全てのブログ記事を取得
 */
export async function getBlogPosts() {
  const supabase = await getSupabaseServerClient();

  const { data, error } = await supabase
    .from('blog_posts')
    .select(`
			*,
			blog_posts_categories(
				blog_categories(*)
			)
		`)
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Supabase Query Error:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
    throw new Error(`Failed to fetch blog posts: ${error.message}`);
  }

  return data;
}

/**
 * スラッグから記事を取得
 */
export async function getBlogPostBySlug(slug: string) {
  const supabase = await getSupabaseServerClient();

  const { data, error } = await supabase
    .from('blog_posts')
    .select(`
			*,
			blog_posts_categories(
				blog_categories(*)
			)
		`)
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error) {
    return null;
  }

  return data;
}

/**
 * カテゴリー別のブログ記事を取得
 */
export async function getBlogPostsByCategory(categoryId: string) {
  const supabase = await getSupabaseServerClient();

  const { data, error } = await supabase
    .from('blog_posts')
    .select(`
      *,
      blog_posts_categories!inner(
        blog_categories!inner(*)
      )
    `)
    .eq('blog_posts_categories.category_id', categoryId)
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch blog posts by category: ${error.message}`);
  }

  return data;
}

/**
 * 全てのブログカテゴリーを取得
 */
export async function getBlogCategories() {
  const supabase = await getSupabaseServerClient();

  const { data, error } = await supabase
    .from('blog_categories')
    .select('*')
    .order('name');

  if (error) {
    throw new Error(`Failed to fetch blog categories: ${error.message}`);
  }

  return data as BlogCategory[];
}

/**
 * ブログ記事を作成
 * @param {string} title - ブログ記事のタイトル
 * @param {string} slug - ブログ記事のスラッグ
 * @param {string} content - ブログ記事のコンテンツ
 * @param {string[]} categoryIds - ブログ記事のカテゴリーIDリスト
 * @returns {Promise<BlogPost>} - 作成されたブログ記事
 */
export async function createBlogPost(
  title: string,
  slug: string,
  content: string,
  categoryIds: string[]
) {
  const supabase = await getSupabaseServerClient();

  const { data: post, error: postError } = await supabase
    .from('blog_posts')
    .insert([
      {
        title,
        slug,
        content,
        status: 'draft', // 初期状態は下書き
        description: '', // description を追加
        estimated_reading_time: 0, // estimated_reading_time を追加
      },
    ])
    .select('*')
    .single();

  if (postError) {
    console.error('Supabase Query Error:', {
      message: postError.message,
      details: postError.details,
      hint: postError.hint,
      code: postError.code,
    });
    throw new Error(`Failed to create blog post: ${postError.message}`);
  }

  // 中間テーブルにカテゴリーとの関連を追加
  for (const categoryId of categoryIds) {
    const { error: categoryError } = await supabase
      .from('blog_posts_categories')
      .insert([
        {
          post_id: post.id,
          category_id: categoryId,
        },
      ]);

    if (categoryError) {
      console.error('Supabase Query Error:', {
        message: categoryError.message,
        details: categoryError.details,
        hint: categoryError.hint,
        code: categoryError.code,
      });
      throw new Error(
        `Failed to create blog post category: ${categoryError.message}`
      );
    }
  }

  revalidatePath('/admin/blog'); // 管理画面のブログ一覧を再検証
  return post;
}

/**
 * ブログ記事を更新
 * @param {string} id - ブログ記事のID
 * @param {string} title - ブログ記事の新しいタイトル
 * @param {string} slug - ブログ記事の新しいスラッグ
 * @param {string} content - ブログ記事の新しいコンテンツ
 * @param {string[]} categoryIds - ブログ記事の新しいカテゴリーIDリスト
 * @returns {Promise<BlogPost>} - 更新されたブログ記事
 */
export async function updateBlogPost(
  id: string,
  title: string,
  slug: string,
  content: string,
  categoryIds: string[]
) {
  const supabase = await getSupabaseServerClient();

  const { data: post, error: postError } = await supabase
    .from('blog_posts')
    .update({
      title,
      slug,
      content,
    })
    .eq('id', id)
    .select('*')
    .single();

  if (postError) {
    console.error('Supabase Query Error:', {
      message: postError.message,
      details: postError.details,
      hint: postError.hint,
      code: postError.code,
    });
    throw new Error(`Failed to update blog post: ${postError.message}`);
  }

  // 既存のカテゴリーとの関連を削除
  const { error: deleteError } = await supabase
    .from('blog_posts_categories')
    .delete()
    .eq('post_id', id);

  if (deleteError) {
    console.error('Supabase Query Error:', {
      message: deleteError.message,
      details: deleteError.details,
      hint: deleteError.hint,
      code: deleteError.code,
    });
    throw new Error(
      `Failed to delete blog post categories: ${deleteError.message}`
    );
  }

  // 新しいカテゴリーとの関連を追加
  for (const categoryId of categoryIds) {
    const { error: categoryError } = await supabase
      .from('blog_posts_categories')
      .insert([
        {
          post_id: id,
          category_id: categoryId,
        },
      ]);

    if (categoryError) {
      console.error('Supabase Query Error:', {
        message: categoryError.message,
        details: categoryError.details,
        hint: categoryError.hint,
        code: categoryError.code,
      });
      throw new Error(
        `Failed to create blog post category: ${categoryError.message}`
      );
    }
  }

  revalidatePath('/admin/blog'); // 管理画面のブログ一覧を再検証
  return post;
}

/**
 * ブログ記事を公開
 * @param {string} id - ブログ記事のID
 */
export async function publishBlogPost(id: string) {
  const supabase = await getSupabaseServerClient();

  const { error } = await supabase
    .from('blog_posts')
    .update({
      status: 'published',
    })
    .eq('id', id);

  if (error) {
    console.error('Supabase Query Error:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
    throw new Error(`Failed to publish blog post: ${error.message}`);
  }

  revalidatePath(`/blog/${id}`); // ブログ記事のページを再検証
  revalidatePath('/admin/blog'); // 管理画面のブログ一覧を再検証
}

/**
 * 管理画面用のブログ記事一覧を取得
 */
export const getBlogPostsForAdmin = async (): Promise<BlogPost[]> => {
  const supabase = await getSupabaseServerClient();

  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select(
        `
				id,
				created_at,
				updated_at,
				published_at,
				title,
				slug,
				content,
				description,
				estimated_reading_time,
				status,
				thumbnail_url,
				blog_posts_categories (
					blog_categories (
						id,
						created_at,
						name
					)
				)
			`
      )
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching blog posts:', error);
      return [];
    }

    // snake_case -> camelCase 変換
    const convertedData = data.map((item) => snakeToCamel(item));

    return convertedData as unknown as BlogPost[];
  } catch (error) {
    console.error('Unexpected error fetching blog posts:', error);
    return [];
  }
};

/**
 * ブログ記事の統計情報を取得
 */
export async function getBlogStats() {
  const supabase = await getSupabaseServerClient();

  const { data, error } = await supabase
    .from('blog_posts')
    .select('*', { count: 'exact' });

  if (error) {
    console.error('Supabase Query Error:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
    throw new Error(`Failed to fetch blog stats: ${error.message}`);
  }

  const totalPosts = data ? data.length : 0;

  const { data: publishedPosts, error: publishedError } = await supabase
    .from('blog_posts')
    .select('*', { count: 'exact' })
    .eq('status', 'published');

  if (publishedError) {
    console.error('Supabase Query Error:', {
      message: publishedError.message,
      details: publishedError.details,
      hint: publishedError.hint,
      code: publishedError.code,
    });
    throw new Error(
      `Failed to fetch published blog posts: ${publishedError.message}`
    );
  }

  const totalPublishedPosts = publishedPosts ? publishedPosts.length : 0;

  return {
    totalPosts,
    totalPublishedPosts,
  };
}

/**
 * カテゴリー別記事数を取得
 */
export async function getBlogPostsCountByCategory() {
  const supabase = await getSupabaseServerClient();

  const { data, error } = await supabase.from('blog_categories').select(`
			id,
			name,
			blog_posts_categories(
				count
			)
		`);

  if (error) {
    console.error('Supabase Query Error:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
    throw new Error(
      `Failed to fetch blog posts count by category: ${error.message}`
    );
  }

  return data.map((category) => ({
    id: category.id,
    name: category.name,
    count: category.blog_posts_categories
      ? category.blog_posts_categories.length
      : 0,
  }));
}

/**
 * 下書き記事数を取得
 */
export async function getDraftBlogPostsCount() {
  const supabase = await getSupabaseServerClient();

  const { data, error, count } = await supabase
    .from('blog_posts')
    .select('*', { count: 'exact' })
    .eq('status', 'draft');

  if (error) {
    console.error('Supabase Query Error:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
    throw new Error(`Failed to fetch draft blog posts count: ${error.message}`);
  }

  return count || 0;
}

/**
 * ブログカテゴリーを作成
 * @param {string} name - ブログカテゴリー名
 */
export async function createBlogCategory(name: string) {
  const supabase = await getSupabaseServerClient();

  const { data, error } = await supabase
    .from('blog_categories')
    .insert([{ name }])
    .select('*')
    .single();

  if (error) {
    console.error('Supabase Query Error:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
    throw new Error(`Failed to create blog category: ${error.message}`);
  }

  // より柔軟なパス指定に変更
  revalidatePath('/admin/posts/categories');
  revalidatePath('/admin/posts/create');
  return data;
}

/**
 * ビルド時に公開済みの記事のスラッグを取得
 */
export async function getPublishedSlugsForBuild() {
  try {
    // ビルド時はadminクライアントを使用
    const supabase = getSupabaseServerAdminClient();

    const { data, error } = await supabase
      .from('blog_posts')
      .select('slug')
      .eq('status', 'published');

    if (error) {
      console.error('Failed to fetch blog slugs:', error);
      throw new Error(`Failed to fetch blog slugs: ${error.message}`);
    }

    if (!data || data.length === 0) {
      return [];
    }

    return data.map((post) => post.slug);
  } catch (err) {
    console.error('Error in getPublishedSlugsForBuild:', err);
    throw new Error(
      `Failed to fetch blog slugs: ${err instanceof Error ? err.message : String(err)}`
    );
  }
}
