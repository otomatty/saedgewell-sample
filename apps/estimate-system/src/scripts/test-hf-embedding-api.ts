// // このテストは、HF Inference API のテストです。
// // 失敗しているので、他の方法を検討する必要があります。

// import { HfInference } from '@huggingface/inference';
// import dotenv from 'dotenv';

// dotenv.config(); // .env ファイルを読み込む

// const hfToken = process.env.HF_ACCESS_TOKEN;
// if (!hfToken) {
//   console.error('エラー: Hugging Face APIトークンが .env にないわよ！');
//   // process.exit(1); // 必要に応じて終了処理
// }

// // トークンがない場合はダミーを使うか、エラーにする
// const inference = new HfInference(hfToken || 'dummy-token');

// // ★ リトライ回数の上限と待機時間（ミリ秒）
// const MAX_RETRIES = 2;
// const RETRY_DELAY_MS = 25000; // 25秒 (estimated_time + α)

// // 例: テンプレート機能の Embedding を取得する関数 (リトライ処理付き)
// async function getFeatureEmbedding(
//   featureName: string,
//   featureDescription: string | null | undefined,
//   projectName: string,
//   projectCategory: string,
//   retryCount = 0 // ★ リトライカウント用の引数を追加
// ): Promise<number[] | null> {
//   // ★ ruri モデルの要件に合わせてプレフィックスを追加！ DB保存用なので「文章:」
//   const inputText = `文章: カテゴリ: ${projectCategory}\nプロジェクト: ${projectName}\n機能: ${featureName}\n説明: ${featureDescription || '説明なし'}`;

//   try {
//     console.log(
//       `[Retry ${retryCount}] HF Inference API呼び出し中 (Model: cl-nagoya/ruri-base-v2, Text: "${inputText.substring(0, 50)}...")` // ログにリトライ回数を表示
//     );

//     const output = await inference.featureExtraction({
//       model: 'cl-nagoya/ruri-base-v2',
//       inputs: inputText,
//     });

//     // console.log('  HF Response raw output:', output); // ← ★ コメントアウト！ 長すぎるから不要！

//     // --- レスポンス形式の判定 ---
//     if (
//       Array.isArray(output) &&
//       output.length > 0 &&
//       Array.isArray(output[0]) &&
//       typeof output[0][0] === 'number'
//     ) {
//       console.log(
//         `  HF Response received. Assuming [[vector]] format. Embedding dimension: ${output[0].length}`
//       );
//       return output[0] as number[];
//     }
//     if (
//       Array.isArray(output) &&
//       output.length > 0 &&
//       typeof output[0] === 'number'
//     ) {
//       console.log(
//         `  HF Response received. Assuming [vector] format. Embedding dimension: ${output.length}`
//       );
//       return output as number[];
//     }
//     console.error(
//       '  HF Inference APIからのレスポンス形式が予期しないものか、数値の配列ではないわ:',
//       output
//     );
//     return null;
//     // --- 判定終了 ---
//   } catch (error: any) {
//     // ★ error の型を any に変更
//     console.error(
//       `[Retry ${retryCount}] Hugging Face Inference APIエラー (ruri-base-v2):`,
//       error
//     );

//     // ★ モデル起動中のエラーか判定し、リトライ上限未満ならリトライ
//     if (
//       error.message && // エラーメッセージがあるか確認
//       error.message.includes('is currently loading') &&
//       retryCount < MAX_RETRIES
//     ) {
//       console.log(
//         `  モデル起動中のエラーみたいね。${RETRY_DELAY_MS / 1000}秒待ってからリトライするわ (Retry ${retryCount + 1}/${MAX_RETRIES})`
//       );
//       await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
//       // 再帰的に自身を呼び出してリトライ
//       return getFeatureEmbedding(
//         featureName,
//         featureDescription,
//         projectName,
//         projectCategory,
//         retryCount + 1 // リトライカウントを増やす
//       );
//     }

//     // リトライ対象外のエラー、またはリトライ上限に達した場合は null を返す
//     console.error('  リトライ不能なエラーか、リトライ上限に達したわ。');
//     return null;
//   }
// }

// // --- テスト実行 ---
// async function test() {
//   console.log('--- Hugging Face Inference API Test Start (with Retry) ---'); // タイトル変更

//   // テストケース1: 在庫管理
//   const embedding1 = await getFeatureEmbedding(
//     '在庫一覧表示',
//     '現在の在庫数を一覧で確認',
//     'サンプル在庫管理システム',
//     'inventory'
//   );
//   if (embedding1) {
//     console.log(
//       '在庫一覧表示 Embedding (最初の5次元):',
//       `[${embedding1.slice(0, 5).join(', ')}]` // ★ slice で表示を短縮
//     );
//   } else {
//     console.log('在庫一覧表示 Embedding の取得に失敗したわ。');
//   }

//   await new Promise((resolve) => setTimeout(resolve, 1000)); // 念のため少し待機

//   // テストケース2: 会議室予約 (これがリトライされるはず)
//   const embedding2 = await getFeatureEmbedding(
//     '会議室予約',
//     '会議室の予約を管理',
//     'サンプル在庫管理システム',
//     'booking'
//   );
//   if (embedding2) {
//     console.log(
//       '会議室予約 Embedding (最初の5次元):',
//       `[${embedding2.slice(0, 5).join(', ')}]` // ★ slice で表示を短縮
//     );
//   } else {
//     console.log('会議室予約 Embedding の取得に失敗したわ。');
//   }

//   console.log('--- Hugging Face Inference API Test End ---');
// }

// test();
