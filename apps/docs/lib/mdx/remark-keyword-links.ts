import { visit } from 'unist-util-visit';
import type { KeywordIndex, ResolvedKeyword } from '~/types/mdx';
import type { Root, Text } from 'mdast';
import { resolveKeyword } from '~/actions/keywords';

// シンプルに型定義する
interface MdxJsxAttribute {
  type: 'mdxJsxAttribute';
  name: string;
  value: string | boolean | undefined;
}

// ノード型の定義
interface TextNode {
  type: 'text';
  value: string;
}

// mdxJsxFlowElementをmdxJsxElementに変更
interface MdxJsxElement {
  type: string; // 'mdxJsxElement', 'mdxJsxFlowElement', または 'mdxJsxTextElement' を受け入れるように変更
  name: string;
  attributes: MdxJsxAttribute[];
  children: TextNode[];
  data?: { _mdxExplicitJsx?: boolean };
}

// parts配列に入れるノードの型
type PartNode = TextNode | MdxJsxElement;

// 親ノードの子要素の型
type NodeChild = unknown;

export function remarkKeywordLinks(keywordIndex: KeywordIndex) {
  // 非同期transformerを返すように変更
  return async function transformer(tree: Root) {
    const promises: Promise<void>[] = [];
    const replacements: Array<{
      parent: { type: string; children: unknown[] };
      index: number;
      parts: PartNode[];
    }> = [];

    // 最初のパスでテキストノードを見つけてキーワードを解決する
    visit(tree, 'text', (node: Text, index, parent) => {
      // [[キーワード]]形式のマッチングのみを行う
      const matches = node.value.match(/\[\[(.*?)\]\]/g);
      if (!matches) return;

      // テキストを分割して、リンクノードに変換するための準備
      const parts: PartNode[] = [];
      let lastIndex = 0;

      const processMatches = async () => {
        for (const match of matches) {
          const matchIndex = node.value.indexOf(match, lastIndex);

          // マッチした前のテキストを追加
          if (matchIndex > lastIndex) {
            parts.push({
              type: 'text',
              value: node.value.slice(lastIndex, matchIndex),
            });
          }

          // キーワードを抽出
          const keywordMatch = match.match(/\[\[(.*?)\]\]/);
          const keyword = keywordMatch?.[1] || '';

          // キーワードがインデックスに存在するか確認
          const entry = keywordIndex[keyword || ''];
          const isValid = entry && !entry.isAmbiguous;

          // サーバーアクションを使ってキーワードを解決
          let initialData: ResolvedKeyword;
          try {
            initialData = await resolveKeyword(keyword || '', 'wiki');
          } catch (error) {
            console.error('キーワード解決中にエラーが発生しました:', error);
            // エラーが発生した場合はエラー情報を含むデータを作成
            initialData = {
              keyword: keyword || '',
              docType: 'wiki',
              isAmbiguous: false,
              error:
                error instanceof Error
                  ? error.message
                  : '不明なエラーが発生しました',
            };
          }

          // 属性リストを構築
          const attributes: MdxJsxAttribute[] = [
            { type: 'mdxJsxAttribute', name: 'keyword', value: keyword || '' },
            { type: 'mdxJsxAttribute', name: 'isValid', value: !!isValid },
            { type: 'mdxJsxAttribute', name: 'docType', value: 'wiki' },
          ];

          // initialDataを文字列化して属性に追加
          attributes.push({
            type: 'mdxJsxAttribute',
            name: 'initialData',
            value: JSON.stringify(initialData),
          });

          // KeywordLinkコンポーネントノードを作成
          const keywordNode: MdxJsxElement = {
            type: 'mdxJsxTextElement', // インライン要素として扱う
            name: 'KeywordLink',
            attributes,
            children: [{ type: 'text', value: keyword || '' }],
            data: { _mdxExplicitJsx: true },
          };

          parts.push(keywordNode);
          lastIndex = matchIndex + match.length;
        }

        // 残りのテキストを追加
        if (lastIndex < node.value.length) {
          parts.push({
            type: 'text',
            value: node.value.slice(lastIndex),
          });
        }

        // 置き換え情報を保存
        if (parent && typeof index === 'number') {
          replacements.push({ parent, index, parts });
        }
      };

      promises.push(processMatches());
    });

    // すべての非同期処理が完了するのを待つ
    await Promise.all(promises);

    // 置き換えを実行
    for (const { parent, index, parts } of replacements) {
      // @ts-ignore - 型が複雑すぎるため無視
      parent.children.splice(index, 1, ...parts);
    }
  };
}
