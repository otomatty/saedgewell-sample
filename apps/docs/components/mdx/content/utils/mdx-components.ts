import { H1, H2, H3, H4, H5, H6 } from '../elements/headings';
import {
  Paragraph,
  UnorderedList,
  OrderedList,
  ListItem,
  Blockquote,
  HorizontalRule,
} from '../elements/text-elements';
import { Strong, Emphasis, Anchor } from '../elements/inline-elements';
import { CodeBlock, InlineCode } from '../../code/code-block';
import KeywordLink from '../../keyword/keyword-link';
import { KeywordLinkDebug } from '../../keyword/keyword-link-debug';

/**
 * MDXコンポーネントのマッピング
 * MDXRemoteに渡すコンポーネントオブジェクト
 */
export const MDXComponents = {
  // 見出しコンポーネント
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  h6: H6,

  // テキスト要素コンポーネント
  p: Paragraph,
  ul: UnorderedList,
  ol: OrderedList,
  li: ListItem,
  blockquote: Blockquote,
  hr: HorizontalRule,

  // インライン要素コンポーネント
  strong: Strong,
  em: Emphasis,
  a: Anchor,

  // コードブロックコンポーネント
  pre: CodeBlock,
  code: InlineCode,

  // キーワードリンクコンポーネント
  KeywordLink,
  KeywordLinkDebug,
};
