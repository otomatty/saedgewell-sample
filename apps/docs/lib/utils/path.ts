import type { DocType } from '~/types/mdx';

/**
 * ドキュメントタイプからURLパスを生成する
 * @param docType ドキュメントタイプ
 * @returns URLパス
 */
export function getDocTypePath(docType: DocType): string {
  // wikiカテゴリの場合はIDに既にwiki/が含まれているため、そのまま使用
  if (docType.category === 'wiki') {
    return `/${docType.id}`;
  }

  // documentsカテゴリの場合は/documents/プレフィックスを追加
  if (docType.category === 'documents') {
    return `/documents/${docType.id}`;
  }

  // journalsカテゴリの場合はIDから重複するjournals/を除去
  if (docType.category === 'journals') {
    // journals/2025-03-21/xxx のような形式からjournalsを除去
    const id = docType.id.startsWith('journals/')
      ? docType.id.substring('journals/'.length)
      : docType.id;
    return `/journals/${id}`;
  }

  // その他のカテゴリの場合は/${category}/${id}の形式で生成
  if (docType.category) {
    return `/${docType.category}/${docType.id}`;
  }

  // カテゴリがない場合は単純に/${id}を返す
  return `/${docType.id}`;
}

/**
 * ドキュメントタイプIDとスラッグからURLパスを生成する
 * @param docTypeId ドキュメントタイプID
 * @param slug スラッグ（任意）
 * @returns URLパス
 */
export function getDocPath(docTypeId: string, slug?: string): string {
  // 1. docTypeIdが既にパス形式（例：wiki/xxx）の場合
  if (docTypeId.includes('/')) {
    return slug ? `/${docTypeId}/${slug}` : `/${docTypeId}`;
  }

  // 2. トップレベルのカテゴリの場合（documents, wiki, development, journals）
  if (['documents', 'wiki', 'development', 'journals'].includes(docTypeId)) {
    return slug ? `/${docTypeId}/${slug}` : `/${docTypeId}`;
  }

  // 3. documentsカテゴリ内のサブディレクトリの場合（デフォルトケース）
  return slug ? `/documents/${docTypeId}/${slug}` : `/documents/${docTypeId}`;
}
