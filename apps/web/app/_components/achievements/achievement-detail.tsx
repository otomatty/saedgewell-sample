import { motion } from 'motion/react';
import type { WorkWithRelations } from '@kit/types';
import { ExternalLinkIcon } from 'lucide-react';
import { GitHubIcon } from '@kit/ui/icons';
import { Badge } from '@kit/ui/badge';
import { Separator } from '@kit/ui/separator';
import {
  getWorkDetail,
  getWorkTechnologyNames,
  getWorkChallenges,
  getWorkSolutions,
  getWorkResults,
} from '~/utils/work-helpers';

interface AchievementDetailProps {
  work: WorkWithRelations;
  isVisible: boolean;
}

/**
 * 実績の詳細情報を表示するコンポーネント
 *
 * このコンポーネントは以下の機能を提供します：
 * 1. 詳細情報の表示
 *    - プロジェクト概要
 *    - 担当役割
 *    - プロジェクト期間
 *    - チーム規模
 *    - 使用技術
 *    - 課題と解決策
 *    - 成果
 *    - 外部リンク（GitHubやWebサイト）
 *
 * 2. アニメーション効果
 *    - スムーズなフェードイン
 *    - 上からのスライドイン
 *    - 遅延付きの表示
 *
 * 3. レイアウト制御
 *    - スクロール可能なコンテンツ
 *    - レスポンシブな表示
 *    - 適切なパディング
 *    - 最大幅の制限
 *
 * 4. アクセシビリティ
 *    - 適切なHTML構造
 *    - 外部リンクの明示
 *    - スクリーンリーダー対応
 *
 * @param props - コンポーネントのプロパティ
 * @param props.work - 表示する実績データ
 * @param props.isVisible - 詳細が表示状態かどうか
 */
export const AchievementDetail = ({
  work,
  isVisible,
}: AchievementDetailProps) => {
  const transition = {
    duration: 0.5,
    ease: [0.32, 0.72, 0, 1],
  };

  const detailVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      transition,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        ...transition,
        delay: 0.5,
      },
    },
  };

  if (!isVisible) return null;

  // ヘルパー関数を使用してデータにアクセス
  const detail = getWorkDetail(work);
  const technologies = getWorkTechnologyNames(work);
  const challenges = getWorkChallenges(work);
  const solutions = getWorkSolutions(work);
  const results = getWorkResults(work);

  return (
    <motion.div
      className="absolute top-0 left-0 w-full h-full overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-primary/30"
      variants={detailVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex justify-center min-h-full">
        <div className="w-full max-w-3xl mt-60 mb-20">
          <div className="px-6 py-4">
            <div className="prose prose-sm dark:prose-invert text-primary-foreground dark:text-primary">
              <h3 className="text-2xl font-bold mb-4">{work.title}</h3>
              <p className="text-lg mb-6">{work.description}</p>

              {/* プロジェクト概要 */}
              {detail && (
                <section className="mb-6">
                  <h4 className="text-xl font-semibold mb-2">
                    プロジェクト概要
                  </h4>
                  <p>{detail.overview}</p>
                </section>
              )}

              {/* 基本情報 */}
              {detail && (
                <section className="mb-6">
                  <h4 className="text-xl font-semibold mb-2">基本情報</h4>
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <dt className="font-medium">担当役割</dt>
                      <dd>{detail.role}</dd>
                    </div>
                    <div>
                      <dt className="font-medium">プロジェクト期間</dt>
                      <dd>{detail.period}</dd>
                    </div>
                    <div>
                      <dt className="font-medium">チーム規模</dt>
                      <dd>{detail.team_size}</dd>
                    </div>
                  </dl>
                </section>
              )}

              {/* 使用技術 */}
              {technologies.length > 0 && (
                <section className="mb-6">
                  <h4 className="text-xl font-semibold mb-2">使用技術</h4>
                  <div className="flex flex-wrap gap-2">
                    {technologies.map((tech) => (
                      <Badge key={tech} variant="outline">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </section>
              )}

              <Separator className="my-6" />

              {/* 課題と解決策 */}
              {challenges.length > 0 && solutions.length > 0 && (
                <section className="mb-6">
                  <h4 className="text-xl font-semibold mb-2">課題と解決策</h4>
                  <div className="space-y-4">
                    {challenges.map((challenge, index) => {
                      // 対応する解決策を探す
                      const relatedSolutions = solutions.filter(
                        (s) =>
                          s.challenge_id === challenge.id ||
                          s.challenge_id === null
                      );
                      return (
                        <div key={challenge.id}>
                          <h5 className="font-medium">課題 {index + 1}</h5>
                          <p className="mb-2">{challenge.description}</p>
                          {relatedSolutions.length > 0 && (
                            <>
                              <h5 className="font-medium">解決策</h5>
                              {relatedSolutions.map((solution, sIdx) => (
                                <p key={solution.id}>
                                  {relatedSolutions.length > 1
                                    ? `${sIdx + 1}. `
                                    : ''}
                                  {solution.description}
                                </p>
                              ))}
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* 成果 */}
              {results.length > 0 && (
                <section className="mb-6">
                  <h4 className="text-xl font-semibold mb-2">成果</h4>
                  <ul className="list-disc list-inside">
                    {results.map((result) => (
                      <li key={result.id}>{result.description}</li>
                    ))}
                  </ul>
                </section>
              )}

              {/* 外部リンク */}
              <section className="flex gap-4">
                {work.github_url && (
                  <a
                    href={work.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-primary hover:underline"
                  >
                    <GitHubIcon className="mr-2 h-4 w-4" />
                    GitHubを見る
                  </a>
                )}
                {work.website_url && (
                  <a
                    href={work.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-primary hover:underline"
                  >
                    <ExternalLinkIcon className="mr-2 h-4 w-4" />
                    Webサイトを見る
                  </a>
                )}
              </section>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
