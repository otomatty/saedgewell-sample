// import { getEstimateAgentAdminClient } from '../lib/supabase/client'; // ★ 新しく作った関数をインポート！
// // ★ 共通の Embedding テキスト生成関数をインポート！
// import { createEmbeddingTextForTemplateFeature } from '../utils/embeddingUtils';

// const supabase = getEstimateAgentAdminClient(); // ★ 関数呼び出しでクライアント取得！

// // こっちもAPIキーの設定が必要なんだからね！忘れないでよ！
// import { GoogleGenerativeAI, TaskType } from '@google/generative-ai';
// // TODO: 環境変数からGemini APIキーを読み込む
// const geminiApiKey = process.env.GEMINI_API_KEY;
// if (!geminiApiKey) {
//   console.error('エラー：Gemini APIキーが環境変数に設定されてないわよ！');
//   process.exit(1);
// }
// const genAI = new GoogleGenerativeAI(geminiApiKey);
// // ★ モデル名を embedding-001 に変更！
// console.log('Embeddingモデルとして embedding-001 を使用するわよ。');
// const embeddingModel = genAI.getGenerativeModel({
//   model: 'embedding-001', // モデル名を変更
// });

// // ★ ターゲット次元数を 768 に変更！
// function truncateEmbedding(
//   embedding: number[],
//   targetDimension = 768 // デフォルト値を 768 に変更
// ): number[] {
//   if (!Array.isArray(embedding)) {
//     console.error('エラー：Embeddingが配列じゃないわ！');
//     return []; // 空配列を返すか、エラーを投げるか。今回は空配列ね。
//   }
//   if (embedding.length <= targetDimension) {
//     // console.warn('警告：Embeddingの次元がターゲット次元以下よ。');
//     // 足りない場合の処理は？ ゼロ埋め？ エラー？ アンタが決めるのよ！
//     // 今回はそのまま返すわ。
//     return embedding;
//   }
//   return embedding.slice(0, targetDimension);
// }

// async function generateAndStoreProjectTemplateEmbeddings() {
//   // 関数名も分かりやすく変えたわよ！
//   console.log('プロジェクトテンプレートの概要Embedding生成を開始するわよ。');

//   try {
//     // 1. project_templatesからデータを取得 (content_embeddingがNULLのものだけ)
//     console.log('Embeddingが未設定のプロジェクトテンプレートを取得中...');
//     const { data: templates, error: selectError } = await supabase
//       .schema('estimate_agent')
//       .from('project_templates')
//       // ★ features を取得しないように修正！
//       .select('id, name, category, description')
//       .is('content_embedding', null); // 効率的に未処理のものだけ対象にするわよ

//     if (selectError) {
//       console.error(
//         'テンプレート取得でエラーよ！ DB接続とか確認しなさい！',
//         selectError
//       );
//       throw selectError;
//     }

//     if (!templates || templates.length === 0) {
//       console.log(
//         'Embeddingを生成する対象のテンプレートがないみたいね。処理終了よ。'
//       );
//       return;
//     }

//     console.log(
//       `${templates.length}件のテンプレートが見つかったわ。Embeddingを生成していくわよ。`
//     );

//     // 2. 各テンプレートについてEmbeddingを生成して更新
//     let successCount = 0;
//     let errorCount = 0;
//     const targetDimension = 768; // ★ ターゲット次元数を変数で定義
//     for (const template of templates) {
//       // ★ features を使わずに contentToEmbed を生成！
//       const contentToEmbed = `プロジェクト名: ${template.name}\nカテゴリ: ${template.category}\n概要: ${template.description || '説明なし'}`; // description が null の場合も考慮

//       try {
//         console.log(`ID: ${template.id} のEmbeddingを生成中...`);
//         // embedContent の taskType は text-embedding-004 では不要かもしれないけど、一応残しておくわ。
//         // ダメそうなら消しなさいよ。
//         const result = await embeddingModel.embedContent({
//           content: {
//             parts: [{ text: contentToEmbed }],
//             role: 'user', // ここ！ role を追加するのよ！
//           },
//           // taskType: TaskType.RETRIEVAL_DOCUMENT, // text-embedding-004 では互換性問題の可能性からコメントアウト継続
//         });
//         const originalEmbedding = result.embedding.values;
//         // ★ 元の次元数をログに出力 (モデルによって変わるはず)
//         console.log(
//           `  -> ${originalEmbedding.length}次元のEmbeddingが生成されたわ。`
//         );

//         // ★ ターゲット次元数を 768 に変更して呼び出し！
//         const truncatedEmbedding = truncateEmbedding(
//           originalEmbedding,
//           targetDimension
//         );
//         // ★ ログメッセージは targetDimension を使うように変更
//         console.log(`  -> ${targetDimension}次元に切り詰めたわ。`);

//         if (truncatedEmbedding.length === 0) {
//           console.error(
//             `  -> ID: ${template.id} の次元切り詰め処理で問題発生。スキップするわ。`
//           );
//           errorCount++;
//           continue; // 次のテンプレートへ
//         }

//         // 4. SupabaseのDBを更新 (content_embedding を更新)
//         const { error: updateError } = await supabase
//           .schema('estimate_agent')
//           .from('project_templates')
//           .update({ content_embedding: truncatedEmbedding })
//           .eq('id', template.id);

//         if (updateError) {
//           console.error(
//             `  -> ID: ${template.id} のDB更新でエラーよ！`,
//             updateError
//           );
//           errorCount++;
//           // エラーが起きても処理を続けるか、止めるか。今回は続けるわ。
//         } else {
//           console.log(
//             `  -> ID: ${template.id} の content_embedding をDBに保存したわ。`
//           );
//           successCount++;
//         }
//       } catch (embedError) {
//         console.error(
//           `ID: ${template.id} のEmbedding生成中にAPIエラーか何か発生したわ！ スキップする！`,
//           embedError
//         );
//         errorCount++;
//       }
//       // ★ レート制限対策！ 少し待機処理を入れるわよ！ アンタが自分でやらないから！
//       console.log('  -> レート制限対策で少し待機...');
//       await new Promise((resolve) => setTimeout(resolve, 500)); // 500ミリ秒待機 (適宜調整しなさい！)
//     }

//     console.log('----------------------------------------');
//     console.log(`処理完了！ 成功: ${successCount}件, エラー: ${errorCount}件`);
//     console.log('----------------------------------------');
//   } catch (error) {
//     console.error(
//       'Embedding生成スクリプトの実行中に致命的なエラーが発生したわ！',
//       error
//     );
//     process.exit(1); // 致命的なエラーなら終了させるわ
//   }
// }

// // ★ 新しい関数を追加！
// async function generateAndStoreTemplateFeatureEmbeddings() {
//   console.log(
//     'テンプレート機能 (template_features) の説明Embedding生成を開始するわよ。'
//   );

//   try {
//     // 1. template_featuresからデータを取得 (description_embeddingがNULLのものだけ)
//     // ★ 関連する project_templates の name と category も一緒に取得！
//     console.log(
//       'Embeddingが未設定のテンプレート機能と関連プロジェクト情報を取得中...'
//     );
//     const { data: features, error: selectError } = await supabase
//       .schema('estimate_agent')
//       .from('template_features')
//       // ★ 機能名(name)も必要なので select に追加！
//       // ★ 関連プロジェクト情報も select で指定！
//       .select(
//         `
//         id,
//         name,
//         description,
//         project_templates (
//           name,
//           category
//         )
//       `
//       )
//       .is('description_embedding', null)
//       .not('description', 'is', null); // description が NULL でないもの

//     if (selectError) {
//       console.error(
//         'テンプレート機能の取得でエラーよ！ DB接続とか確認しなさい！',
//         selectError
//       );
//       throw selectError;
//     }

//     if (!features || features.length === 0) {
//       console.log(
//         'テンプレート機能 Embeddingを生成する対象がないみたいね。処理終了よ。' // ログ修正
//       );
//       return;
//     }

//     console.log(
//       `${features.length}件のテンプレート機能が見つかったわ。Embeddingを生成していくわよ。`
//     );

//     // 2. 各機能についてEmbeddingを生成して更新
//     let successCount = 0;
//     let errorCount = 0;
//     const targetDimension = 768; // 同じ次元数を使うわ
//     for (const feature of features) {
//       // ★ 関連プロジェクト情報が取れているかチェック！
//       if (
//         !feature.project_templates ||
//         typeof feature.project_templates !== 'object' || // オブジェクトか確認
//         !('name' in feature.project_templates) || // nameプロパティがあるか確認
//         !('category' in feature.project_templates) // categoryプロパティがあるか確認
//       ) {
//         console.warn(
//           `  -> Feature ID: ${feature.id} の関連プロジェクト情報 (name, category) が取得できなかったわ。スキップするわ。`
//         );
//         errorCount++;
//         continue;
//       }
//       // ★ project_templates の name と category を取り出す
//       const projectName = feature.project_templates.name;
//       const projectCategory = feature.project_templates.category;

//       // description が確実に存在するはずだけど、念のためチェック (selectでnot null指定済みだが)
//       if (!feature.description) {
//         console.warn(
//           `  -> Feature ID: ${feature.id} の description が空よ。スキップするわ。`
//         );
//         continue;
//       }
//       // ★ 機能名もチェック！ (NOT NULL制約前提だが念のため)
//       if (!feature.name) {
//         console.warn(
//           `  -> Feature ID: ${feature.id} の機能名(name)が空よ。スキップするわ。`
//         );
//         continue;
//       }

//       try {
//         // ★ 共通関数を使って Embedding 用テキストを生成！
//         const contentToEmbed = createEmbeddingTextForTemplateFeature(
//           feature.name, // 機能名
//           feature.description, // 機能説明
//           projectName, // プロジェクト名
//           projectCategory // プロジェクトカテゴリ
//         );

//         // ★ デバッグログ追加: APIに送るテキストを表示
//         console.log(
//           `  -> Feature ID: ${feature.id} の API Input Text (first 100 chars): "${contentToEmbed.substring(0, 100)}..."`
//         );

//         console.log(`Feature ID: ${feature.id} のEmbeddingを生成中...`);
//         const result = await embeddingModel.embedContent({
//           content: {
//             parts: [{ text: contentToEmbed }],
//             role: 'user',
//           },
//           // taskType: TaskType.RETRIEVAL_DOCUMENT, // コメントアウト継続
//         });

//         // ★ デバッグログ追加: 生成されたベクトルの最初の数個の値を確認
//         const originalEmbedding = result.embedding.values;
//         console.log(
//           `  -> Generated Embedding (first 5 values): [${originalEmbedding.slice(0, 5).join(', ')}]`
//         );

//         console.log(
//           `  -> ${originalEmbedding.length}次元のEmbeddingが生成されたわ。`
//         );

//         // 3. 次元を切り詰める (768次元へ)
//         const truncatedEmbedding = truncateEmbedding(
//           originalEmbedding,
//           targetDimension
//         );
//         console.log(`  -> ${targetDimension}次元に切り詰めたわ。`);

//         // ★ デバッグログ追加: DBに保存する直前のベクトル（の最初の数個）を表示
//         console.log(
//           `  -> Vector to be saved (first 5 values): [${truncatedEmbedding.slice(0, 5).join(', ')}]`
//         );

//         if (truncatedEmbedding.length === 0) {
//           console.error(
//             `  -> Feature ID: ${feature.id} の次元切り詰め処理で問題発生。スキップするわ。`
//           );
//           errorCount++;
//           continue;
//         }

//         // 4. SupabaseのDBを更新 (description_embedding を更新)
//         const { error: updateError } = await supabase
//           .schema('estimate_agent')
//           .from('template_features') // ★ 更新対象テーブルを変更！
//           .update({ description_embedding: truncatedEmbedding }) // ★ 更新カラムを変更！
//           .eq('id', feature.id);

//         if (updateError) {
//           console.error(
//             `  -> Feature ID: ${feature.id} のDB更新でエラーよ！`,
//             updateError
//           );
//           errorCount++;
//         } else {
//           console.log(
//             `  -> Feature ID: ${feature.id} の description_embedding をDBに保存したわ。`
//           );
//           successCount++;
//         }
//       } catch (embedError) {
//         console.error(
//           `Feature ID: ${feature.id} のEmbedding生成中にAPIエラーか何か発生したわ！ スキップする！`,
//           embedError
//         );
//         errorCount++;
//       }
//       // ★ こっちもレート制限対策の待機処理を入れるわよ！
//       console.log('  -> レート制限対策で少し待機...');
//       await new Promise((resolve) => setTimeout(resolve, 500)); // 500ミリ秒待機
//     }

//     console.log('----------------------------------------');
//     console.log(
//       `テンプレート機能 Embedding 処理完了！ 成功: ${successCount}件, エラー: ${errorCount}件`
//     );
//     console.log('----------------------------------------');
//   } catch (error) {
//     console.error(
//       'テンプレート機能 Embedding生成スクリプトの実行中に致命的なエラーが発生したわ！',
//       error
//     );
//     process.exit(1);
//   }
// }

// // スクリプトを実行！
// // どっちを実行するか、あるいは両方実行するかはアンタが決めるのよ？
// // とりあえず両方呼ぶようにしておくけど、必要に応じてコメントアウトしなさい。
// async function runAllGenerators() {
//   await generateAndStoreProjectTemplateEmbeddings();
//   console.log('\n========================================\n'); // 区切り線
//   await generateAndStoreTemplateFeatureEmbeddings();
// }

// runAllGenerators(); // 両方の関数を順番に実行
