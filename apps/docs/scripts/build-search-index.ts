import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';
import matter from 'gray-matter';
import { Document } from 'flexsearch';
import type { IndexEntry } from '../types/search.js';
import { searchConfig } from '../config/search.config.js';

/**
 * インデックスを構築する
 */
async function buildSearchIndex() {
  const contentsDir = join(process.cwd(), 'contents');
  const entries: IndexEntry[] = [];

  // ルートのindex.jsonを処理
  const rootIndexPath = join(contentsDir, 'index.json');
  if (existsSync(rootIndexPath)) {
    try {
      const rootIndex = JSON.parse(readFileSync(rootIndexPath, 'utf-8'));
      if (rootIndex.docTypes && Array.isArray(rootIndex.docTypes)) {
        for (const docType of rootIndex.docTypes) {
          const docTypePath = join(contentsDir, docType.id);
          if (!existsSync(docTypePath)) continue;

          entries.push({
            id: docType.id,
            title: docType.title || docType.id,
            description: docType.description || '',
            content: JSON.stringify(docType),
            path: `/${docType.id}`,
            category: docType.category || '',
            sourceType: 'index',
            thumbnail: docType.thumbnail,
          });
        }
      }
    } catch (error) {
      console.error('ルートindex.jsonの処理中にエラーが発生しました:', error);
    }
  }

  // documentsディレクトリを処理
  const documentsDir = join(contentsDir, 'documents');
  if (existsSync(documentsDir)) {
    for (const docTypeDir of readdirSync(documentsDir)) {
      const docTypePath = join(documentsDir, docTypeDir);
      if (!existsSync(docTypePath)) continue;

      // index.jsonを処理
      const indexPath = join(docTypePath, 'index.json');
      if (existsSync(indexPath)) {
        try {
          const docTypeInfo = JSON.parse(readFileSync(indexPath, 'utf-8'));
          entries.push({
            id: `documents/${docTypeDir}`,
            title: docTypeInfo.title || docTypeDir,
            description: docTypeInfo.description || '',
            content: JSON.stringify(docTypeInfo),
            path: `/documents/${docTypeDir}`,
            category: 'documents',
            sourceType: 'index',
            thumbnail: docTypeInfo.thumbnail,
          });
        } catch (error) {
          console.error(
            `documents/${docTypeDir}/index.jsonの処理中にエラーが発生しました:`,
            error
          );
        }
      }

      // MDXファイルを処理
      await processDirectory(
        docTypePath,
        `documents/${docTypeDir}`,
        'documents',
        entries
      );
    }
  }

  // wikiディレクトリを処理
  const wikiDir = join(contentsDir, 'wiki');
  if (existsSync(wikiDir)) {
    // index.jsonを処理
    const wikiIndexPath = join(wikiDir, 'index.json');
    if (existsSync(wikiIndexPath)) {
      try {
        const wikiInfo = JSON.parse(readFileSync(wikiIndexPath, 'utf-8'));
        entries.push({
          id: 'wiki',
          title: wikiInfo.title || 'Wiki',
          description: wikiInfo.description || '',
          content: JSON.stringify(wikiInfo),
          path: '/wiki',
          category: 'wiki',
          sourceType: 'index',
          thumbnail: wikiInfo.thumbnail,
        });
      } catch (error) {
        console.error('wiki/index.jsonの処理中にエラーが発生しました:', error);
      }
    }

    // MDXファイルを処理
    for (const file of readdirSync(wikiDir)) {
      if (extname(file) !== '.mdx' && extname(file) !== '.md') continue;

      const filePath = join(wikiDir, file);
      if (!existsSync(filePath)) continue;

      try {
        const docId = file.replace(/\.mdx?$/, '');
        const { data, content } = matter(readFileSync(filePath, 'utf-8'));

        entries.push({
          id: `wiki/${docId}`,
          title: data.title || docId,
          description: data.description || '',
          content,
          path: `/wiki/${docId}`,
          category: 'wiki',
          sourceType: 'content',
          thumbnail: data.thumbnail,
        });
      } catch (error) {
        console.error(`wiki/${file}の処理中にエラーが発生しました:`, error);
      }
    }
  }

  // FlexSearchインデックスを構築
  // @ts-ignore: FlexSearchの型定義の問題を回避
  const index = new Document<IndexEntry, true>({
    tokenize: 'forward',
    document: {
      id: 'id',
      index: ['title', 'description', 'content'],
      store: true,
    },
  });

  // エントリーをインデックスに追加
  for (const entry of entries) {
    // @ts-ignore: FlexSearchの型定義の問題を回避
    index.add(entry);
  }

  // インデックスをファイルに保存
  const outputPath = join(process.cwd(), searchConfig.index.path);
  const outputDir = join(process.cwd(), 'public', 'search');

  try {
    // 出力ディレクトリが存在しない場合は作成
    if (!existsSync(outputDir)) {
      require('node:fs').mkdirSync(outputDir, { recursive: true });
    }

    // @ts-ignore: FlexSearchの型定義の問題を回避
    const serializedIndex = index.export();

    // serializedIndexが適切な形式かどうかを確認
    if (serializedIndex !== null && serializedIndex !== undefined) {
      // JSON文字列に変換して書き込む
      const jsonString = JSON.stringify(serializedIndex);
      if (typeof jsonString === 'string') {
        writeFileSync(outputPath, jsonString);
        console.log(`検索インデックスを${outputPath}に保存しました`);
      } else {
        console.warn(
          'シリアライズされたインデックスがJSON形式に変換できないため、空のインデックスを保存します'
        );
        writeFileSync(outputPath, JSON.stringify({}));
      }
    } else {
      console.warn(
        'インデックスのエクスポートに失敗したため、空のインデックスを保存します'
      );
      writeFileSync(outputPath, JSON.stringify({}));
    }
  } catch (error) {
    console.error('インデックスの保存中にエラーが発生しました:', error);
    console.warn('エラーが発生したため、空のインデックスを保存します');

    try {
      writeFileSync(outputPath, JSON.stringify({}));
      console.log(`空の検索インデックスを${outputPath}に保存しました`);
    } catch (fallbackError) {
      console.error('空のインデックスの保存にも失敗しました:', fallbackError);
      process.exit(1);
    }
  }
}

/**
 * ディレクトリ内のMDXファイルを再帰的に処理
 */
async function processDirectory(
  dirPath: string,
  basePath: string,
  category: string,
  entries: IndexEntry[]
) {
  if (!existsSync(dirPath)) return;

  for (const entry of readdirSync(dirPath)) {
    const entryPath = join(dirPath, entry);
    const stats = require('node:fs').statSync(entryPath);

    if (stats.isDirectory()) {
      // サブディレクトリを再帰的に処理
      await processDirectory(
        entryPath,
        `${basePath}/${entry}`,
        category,
        entries
      );
    } else if (extname(entry) === '.mdx' || extname(entry) === '.md') {
      try {
        const docId = entry.replace(/\.mdx?$/, '');
        const { data, content } = matter(readFileSync(entryPath, 'utf-8'));

        entries.push({
          id: `${basePath}/${docId}`,
          title: data.title || docId,
          description: data.description || '',
          content,
          path: `/${basePath}/${docId}`,
          category,
          sourceType: 'content',
          thumbnail: data.thumbnail,
        });
      } catch (error) {
        console.error(
          `${basePath}/${entry}の処理中にエラーが発生しました:`,
          error
        );
      }
    }
  }
}

// インデックスの構築を実行
buildSearchIndex().catch((error) => {
  console.error('インデックス構築中にエラーが発生しました:', error);
  process.exit(1);
});
