import type { TOCItem } from '~/components/toc/table-of-contents';

/**
 * MDXコンテンツから見出しを抽出する
 * @param content - MDXコンテンツのコード文字列
 * @returns 見出し情報の配列
 */
export function extractHeadings(content: string): TOCItem[] {
  console.log(`Extracting headings from content: ${content.slice(0, 200)}...`);

  const headingRegex = /^\s*(#{1,6})\s+(.+)$/gm;
  const headings: TOCItem[] = [];
  let match: RegExpExecArray | null;
  let index = 0;

  match = headingRegex.exec(content);
  while (match !== null) {
    console.log('Found match:', match);
    if (match[1] && match[2]) {
      const level = match[1].length;
      const text = match[2].trim();
      if (text) {
        const baseId = text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');

        const id = baseId || `heading-${index + 1}`;

        headings.push({
          id,
          text,
          level,
        });
        console.log('Added heading:', { id, text, level });
      }
    }
    index++;
    match = headingRegex.exec(content);
  }

  console.log('Extracted headings:', headings);
  return headings;
}
