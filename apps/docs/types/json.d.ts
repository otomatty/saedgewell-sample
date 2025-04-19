import type { DocNode } from './mdx'; // インポートパスを確認

declare global {
  declare module '*.json' {
    const value: DocNode[];
    export default value;
  }
}
