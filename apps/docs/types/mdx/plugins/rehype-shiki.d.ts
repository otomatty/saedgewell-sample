declare module 'rehype-shiki' {
  import type { Plugin } from 'unified';
  import type { Root } from 'hast';

  interface RehypeShikiOptions {
    theme?: string;
    langs?: string[];
    wrap?: boolean;
    [key: string]: unknown;
  }

  const rehypeShiki: Plugin<[RehypeShikiOptions?], Root>;

  export default rehypeShiki;
}
