import type { BlogPost } from '@kit/types/blog';

interface BlogPostListProps {
  blogPosts: BlogPost[];
}

export const BlogPostList: React.FC<BlogPostListProps> = ({ blogPosts }) => {
  return (
    <ul>
      {blogPosts?.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
};
