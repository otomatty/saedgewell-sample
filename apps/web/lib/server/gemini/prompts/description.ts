// import type { ProjectType } from '~/types/estimate'; // 古いパスはコメントアウト
// import type { ProjectType } from '../../../app/services/estimate/_types/estimate'; // 新しいパスを参照
import type { ProjectType } from '../../../../types/estimate'; // さらに階層を遡る

export function generateDescriptionPrompt(
  projectType: ProjectType,
  currentDescription?: string
) {
  const basePrompt = `
あなたはWeb開発の専門家として、クライアントのプロジェクト要件を具体化する役割を担っています。
クライアントから提供された以下の要件を基に、より具体的で実現可能なプロジェクト提案を生成してください。

プロジェクトタイプ: ${(() => {
    switch (projectType) {
      case 'website':
        return 'Webサイト（情報発信、コーポレートサイト、ポートフォリオなど）';
      case 'business_system':
        return '業務システム（社内ツール、顧客管理、在庫管理など）';
      case 'application':
        return 'Webアプリケーション（SaaS、ユーザー向け機能、ECサイトなど）';
      default:
        return 'その他のWebプロジェクト';
    }
  })()}

${
  currentDescription
    ? `
クライアントの現在の要件：
${currentDescription}

上記の要件を基に、以下の点を考慮して具体化・改善を行ってください：
- 不明確な部分の具体化
- 必要な機能の詳細化
- 実現可能性の考慮
- ターゲットユーザーの明確化
- 市場性の考慮
`
    : 'クライアントからの具体的な要件はまだ提供されていません。'
}

以下の形式で厳密なJSONを返してください。コメントや説明は一切含めないでください：

{
  "examples": [
    {
      "title": "具体的なプロジェクトタイトル（40文字以内）",
      "description": "プロジェクトの目的、解決する課題、主要機能の概要、期待される成果を含む300-400文字の説明",
      "features": [
        "具体的な機能の説明（コメントや注釈は含めない）",
        "具体的な機能の説明（コメントや注釈は含めない）",
        "具体的な機能の説明（コメントや注釈は含めない）"
      ],
      "targetUsers": [
        "具体的なユーザー属性や利用シーン（コメントや注釈は含めない）",
        "具体的なユーザー属性や利用シーン（コメントや注釈は含めない）"
      ],
      "references": [
        "https://example.com/reference1",
        "https://example.com/reference2"
      ]
    }
  ]
}

生成時の注意事項：
1. 返却するのは厳密なJSONのみです。説明文やコメントは一切含めないでください。
2. すべてのURLは完全なURL形式（https://から始まる）で記載してください。
3. スラッシュ（/）やバックスラッシュ（\\）を含む説明文は避けてください。
4. 文字列内で改行を使用する場合は \\n を使用してください。
5. プロジェクトの種類に応じて、${currentDescription ? '1' : '3'}つの例を生成してください。

生成する内容の基準：
1. 機能リスト：
   - 必須機能（Must Have）：具体的で実装可能な機能
   - 追加機能（Nice to Have）：将来的な拡張を考慮した機能
   - 拡張機能：スケーラビリティを考慮した機能

2. ターゲットユーザー：
   - 具体的な属性（年齢、職業、興味関心）
   - 具体的な利用シーン
   - 明確なユーザー課題や動機

3. 参考サイト：
   - 完全なURL形式で記載
   - 実在する日本国内のサービスを優先
   - 特徴的な機能や優れたUXを持つサービス

4. 全体的な注意点：
   - 現実的な開発規模
   - モダンな技術トレンド
   - 市場性とスケーラビリティ
`.trim();

  return basePrompt;
}
