import type { Metadata } from 'next';
import { AboutHero } from './_components/about-hero';
import { AboutHeader } from './_components/about-header';
import { Career } from './_components/career';
import { Values } from './_components/values';
import { TechStack } from './_components/tech-stack';
import { Certifications } from './_components/certifications';
import { Interests } from './_components/interests';
import { Featured } from './_components/featured';
import { GithubContributions } from './_components/github-contributions';
import { getGithubCalendarContributions } from '~/actions/github';
import type { ContributionDay } from '@kit/types/github';
import { Container } from '../../components/layout/container';

export const metadata: Metadata = {
  title: 'About Me',
  description:
    'プロダクトエンジニアとして、モダンな技術を活用したWeb開発に携わっています。',
};

export default async function AboutPage() {
  const githubUsername = 'otomatty'; // 自身のGithubのユーザー名
  const githubToken = process.env.GITHUB_TOKEN;

  let contributions: ContributionDay[] = [];
  let errorMessage: string | null = null;

  if (!githubToken) {
    errorMessage = 'GITHUB_TOKENが設定されていません。';
  } else {
    try {
      contributions = await getGithubCalendarContributions(
        githubUsername,
        githubToken
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        errorMessage = `GitHubのコントリビューションの取得に失敗しました: ${error.message}`;
      } else {
        errorMessage = 'GitHubのコントリビューションの取得に失敗しました。';
      }
    }
  }

  return (
    <main>
      <AboutHero />
      <Container className="space-y-32">
        <AboutHeader />
        <Career />
        <Values />
        <TechStack />
        <Certifications />
        <Interests />
        <Featured />
        {githubToken && !errorMessage && (
          <GithubContributions contributions={contributions} />
        )}
      </Container>
    </main>
  );
}
