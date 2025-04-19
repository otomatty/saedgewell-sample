// // test-embedding-api.ts (みたいな別ファイルを作るイメージ)
// import { GoogleGenerativeAI } from '@google/generative-ai';
// // ★ 共通関数をインポート！
// import { createEmbeddingTextForTemplateFeature } from '../utils/embeddingUtils';

// // APIキーを環境変数から読み込む
// const geminiApiKey = process.env.GEMINI_API_KEY;
// if (!geminiApiKey) {
//   console.error('エラー：Gemini APIキーがないわ！');
//   process.exit(1);
// }
// const genAI = new GoogleGenerativeAI(geminiApiKey);
// const embeddingModel = genAI.getGenerativeModel({
//   model: 'gemini-embedding-exp-03-07',
// });

// // ★ テスト用のコンテキスト情報を追加
// const testContext = {
//   projectName: 'サンプル在庫管理システム',
//   projectCategory: 'inventory',
// };

// // ★ テストデータも機能名と説明のペアにする
// const testFeatures = [
//   { name: '在庫一覧表示', description: '現在の在庫数を一覧で確認' },
//   { name: '在庫手動調整', description: '在庫数の手動調整' },
//   { name: '会議室登録', description: '会議室情報の登録・編集' }, // 別カテゴリの例
//   { name: '会議室予約', description: '会議室の予約を管理' }, // 別カテゴリの例
//   { name: '予約確認', description: '自分の予約を確認' }, // 別カテゴリの例
//   // 他にも怪しいのがあれば追加
// ];

// async function testEmbeddings() {
//   console.log('Embedding API 直接呼び出しテスト開始 (新ロジック版)...');
//   for (const feature of testFeatures) {
//     try {
//       // ★ 共通関数を使って API に渡すテキストを生成
//       const contentToEmbed = createEmbeddingTextForTemplateFeature(
//         feature.name,
//         feature.description,
//         // カテゴリが違う機能の場合は、テストコンテキストも変える例
//         feature.name.includes('会議室') || feature.name.includes('予約')
//           ? 'サンプル会議室予約システム'
//           : testContext.projectName,
//         feature.name.includes('会議室') || feature.name.includes('予約')
//           ? 'booking'
//           : testContext.projectCategory
//       );

//       console.log(
//         `\nTesting Feature: "${feature.name}" (Category: ${feature.name.includes('会議室') || feature.name.includes('予約') ? 'booking' : testContext.projectCategory})`
//       );
//       console.log(
//         `  -> Input Text (first 100): "${contentToEmbed.substring(0, 100)}..."`
//       );

//       // ★ embedContent に生成したテキストを渡す
//       // ★ taskType は削除 (text-embedding-004 では不要/非推奨の可能性)
//       const result = await embeddingModel.embedContent({
//         content: { parts: [{ text: contentToEmbed }], role: 'user' },
//         // taskType: TaskType.RETRIEVAL_DOCUMENT, // 削除
//       });
//       const embedding = result.embedding.values;
//       console.log(
//         `  -> Result Embedding (first 5): [${embedding.slice(0, 5).join(', ')}]`
//       );
//     } catch (error) {
//       console.error(`  -> Error embedding "${feature.name}":`, error);
//     }
//     // レート制限対策で少し待機 (念のため)
//     await new Promise((resolve) => setTimeout(resolve, 1000)); // 1秒待機
//   }
//   console.log('\nテスト完了。');
// }

// testEmbeddings();
