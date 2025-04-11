import type { DocumentMappingItem, DocumentMetadata } from '~/types/mdx';

/**
 * コンテキストを考慮したマッチングを行うクラス
 * 文書のコンテキストを分析し、関連性の高いドキュメントを優先的に表示する
 */
export class ContextAwareMatcher {
  private documentContent = '';
  private contextKeywords: Map<string, number> = new Map();
  private importantSections: Map<string, number> = new Map();
  private documentCount = 0; // IDF計算用のドキュメント総数

  /**
   * コンテキストを設定
   * @param content ドキュメントの内容
   */
  setContext(content = ''): void {
    this.documentContent = content;
    this.analyzeContextKeywords();
  }

  /**
   * ドキュメント総数を設定
   * @param count ドキュメント総数
   */
  setDocumentCount(count: number): void {
    this.documentCount = Math.max(1, count); // 最低1件
  }

  /**
   * コンテキストのキーワードを分析
   */
  private analyzeContextKeywords(): void {
    // コンテキストから重要なセクションを抽出
    const sections = this.extractSections(this.documentContent);

    // 各セクションの重要度を設定
    this.importantSections.clear();
    for (const [section, content] of Object.entries(sections)) {
      // セクションの種類に応じた重み付け
      let weight = 1.0;
      if (section === 'heading1') weight = 3.0;
      else if (section === 'heading2') weight = 2.5;
      else if (section === 'heading3') weight = 2.0;
      else if (section === 'codeblock') weight = 1.5;

      this.importantSections.set(section, weight);

      // 各セクションの単語を分析
      const words = this.tokenize(content);

      // キーワードの出現頻度をカウント（セクションの重要度を考慮）
      for (const word of words) {
        const count = (this.contextKeywords.get(word) || 0) + weight;
        this.contextKeywords.set(word, count);
      }
    }
  }

  /**
   * ドキュメントから重要なセクションを抽出
   * @param content ドキュメントの内容
   * @returns セクション名とその内容のマップ
   */
  private extractSections(content: string): Record<string, string> {
    const sections: Record<string, string> = {
      heading1: '',
      heading2: '',
      heading3: '',
      paragraph: '',
      codeblock: '',
      list: '',
    };

    // 見出しを抽出
    const h1Matches = content.match(/^#\s+(.+)$/gm) || [];
    const h2Matches = content.match(/^##\s+(.+)$/gm) || [];
    const h3Matches = content.match(/^###\s+(.+)$/gm) || [];

    // コードブロックを抽出
    const codeMatches = content.match(/```[\s\S]*?```/gm) || [];

    // リストを抽出
    const listMatches = content.match(/^[*-]\s+.+$/gm) || [];

    // パラグラフを抽出（見出し、コードブロック、リスト以外のテキスト）
    const paragraphs =
      content
        .replace(/^#+\s+.+$/gm, '')
        .replace(/```[\s\S]*?```/gm, '')
        .replace(/^[*-]\s+.+$/gm, '')
        .match(/^[^#\n].+$/gm) || [];

    sections.heading1 = h1Matches.join(' ');
    sections.heading2 = h2Matches.join(' ');
    sections.heading3 = h3Matches.join(' ');
    sections.codeblock = codeMatches.join(' ');
    sections.list = listMatches.join(' ');
    sections.paragraph = paragraphs.join(' ');

    return sections;
  }

  /**
   * テキストをトークン化（日本語対応）
   * @param text テキスト
   */
  private tokenize(text: string): string[] {
    if (!text) return [];

    // 日本語と英語の両方に対応したトークン化
    // 1. 英数字と日本語の境界で分割
    // 2. 記号を空白に置換
    // 3. 空白で分割
    return text
      .toLowerCase()
      .replace(/([a-z0-9])([^\sa-z0-9])/gi, '$1 $2')
      .replace(/([^\sa-z0-9])([a-z0-9])/gi, '$1 $2')
      .replace(/[^\w\s\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g, ' ')
      .split(/\s+/)
      .filter((word) => {
        // 日本語の場合は1文字以上、英語の場合は3文字以上
        return (
          (word.match(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/) &&
            word.length >= 1) ||
          (word.match(/[a-z0-9]/i) && word.length >= 3)
        );
      });
  }

  /**
   * キーワードに対するドキュメントの関連度を計算（TF-IDF導入）
   * @param keyword キーワード
   * @param document ドキュメントのメタデータ
   */
  private calculateRelevance(
    keyword: string,
    document: DocumentMetadata
  ): number {
    let score = 0;
    const keywordLower = keyword.toLowerCase();

    // 1. 完全一致のボーナス
    // タイトルとの完全一致
    if (document.title.toLowerCase() === keywordLower) {
      score += 10;
    }
    // タイトルに含まれる
    else if (document.title.toLowerCase().includes(keywordLower)) {
      score += 5;
    }

    // キーワードリストとの完全一致
    if (document.keywords?.some((k) => k.toLowerCase() === keywordLower)) {
      score += 8;
    }
    // キーワードリストに部分一致
    else if (
      document.keywords?.some(
        (k) =>
          k.toLowerCase().includes(keywordLower) ||
          keywordLower.includes(k.toLowerCase())
      )
    ) {
      score += 4;
    }

    // 説明文との一致
    if (document.description?.toLowerCase().includes(keywordLower)) {
      score += 3;
    }

    // 2. コンテキストキーワードとの関連度（TF-IDF的アプローチ）
    const documentWords = this.tokenize(
      `${document.title} ${document.description || ''}`
    );

    // 単語の出現頻度を計算
    const wordFrequency = new Map<string, number>();
    for (const word of documentWords) {
      const count = (wordFrequency.get(word) || 0) + 1;
      wordFrequency.set(word, count);
    }

    // TF-IDF的なスコアリング
    for (const [word, tf] of wordFrequency.entries()) {
      const contextFrequency = this.contextKeywords.get(word) || 0;
      if (contextFrequency > 0) {
        // TF: 単語の出現頻度
        // IDF: 逆文書頻度（全ドキュメント数 / その単語を含むドキュメント数）
        // 簡易的なIDF計算（実際のIDFはドキュメント全体の情報が必要）
        const idf =
          this.documentCount > 0
            ? Math.log(this.documentCount / (contextFrequency + 1)) + 1
            : 1;
        score += tf * idf * contextFrequency * 0.2;
      }
    }

    // 3. 複合キーワードの処理
    // キーワードが複数の単語で構成されている場合の処理
    const keywordTokens = this.tokenize(keyword);
    if (keywordTokens.length > 1) {
      // 複合キーワードの各部分がドキュメントに含まれているかチェック
      const matchCount = keywordTokens.filter(
        (token) =>
          document.title.toLowerCase().includes(token) ||
          document.description?.toLowerCase().includes(token) ||
          document.keywords?.some((k) => k.toLowerCase().includes(token))
      ).length;

      // 一致率に応じたスコア加算
      const matchRatio = matchCount / keywordTokens.length;
      score += matchRatio * 5;
    }

    return score;
  }

  /**
   * コンテキストの関連度に基づいてドキュメントをソート
   * @param keyword キーワード
   * @param documents ドキュメント一覧
   */
  sortByContextRelevance(
    keyword: string,
    documents: DocumentMappingItem[]
  ): DocumentMappingItem[] {
    // ドキュメント数を更新
    this.setDocumentCount(documents.length);

    return [...documents].sort((a, b) => {
      const scoreA = this.calculateRelevance(keyword, a.metadata);
      const scoreB = this.calculateRelevance(keyword, b.metadata);
      return scoreB - scoreA;
    });
  }

  /**
   * 関連キーワードを抽出
   * @param keyword 基準となるキーワード
   * @param documents ドキュメント一覧
   * @param maxKeywords 最大キーワード数
   * @returns 関連キーワードの配列
   */
  extractRelatedKeywords(
    keyword: string,
    documents: DocumentMappingItem[],
    maxKeywords = 5
  ): string[] {
    // コンテキストがない場合は空配列を返す
    if (!this.documentContent) {
      return [];
    }

    const baseTokens = this.tokenize(keyword);
    const keywordScores = new Map<string, number>();

    // 各ドキュメントからキーワードを収集
    for (const doc of documents) {
      const docKeywords = doc.keywords || [];

      // ドキュメントのキーワードを処理
      for (const docKeyword of docKeywords) {
        if (docKeyword.toLowerCase() === keyword.toLowerCase()) continue;

        // 基準キーワードとの関連度を計算
        const tokens = this.tokenize(docKeyword);
        const similarity = this.calculateSimilarity(baseTokens, tokens);

        // コンテキストでの重要度を考慮
        let contextScore = 0;
        for (const token of tokens) {
          contextScore += this.contextKeywords.get(token) || 0;
        }

        const score = similarity * 0.7 + contextScore * 0.3;
        keywordScores.set(
          docKeyword,
          (keywordScores.get(docKeyword) || 0) + score
        );
      }
    }

    // スコア順にソートして上位のキーワードを返す
    return Array.from(keywordScores.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, maxKeywords)
      .map(([keyword]) => keyword);
  }

  /**
   * 2つのトークンリストの類似度を計算
   * @param list1 トークンリスト1
   * @param list2 トークンリスト2
   */
  private calculateSimilarity(list1: string[], list2: string[]): number {
    const intersection = new Set(list1.filter((x) => list2.includes(x)));
    const union = new Set([...list1, ...list2]);
    return intersection.size / union.size;
  }
}
