import type React from 'react';
import type { ContributionDay } from '~/types/share/github';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@kit/ui/tabs';
import { GithubContributionCalendar } from './github-contribution-calendar';
import { GithubContributionChart } from './github-contribution-chart';
import { SectionTitle } from '@kit/ui/section-title';

interface GithubContributionsProps {
  contributions: ContributionDay[];
}

/**
 * GitHubのコントリビューションを表示するコンポーネント
 * @param {GithubContributionsProps} props
 * @returns {JSX.Element}
 */
export const GithubContributions: React.FC<GithubContributionsProps> = ({
  contributions,
}) => {
  return (
    <div>
      <SectionTitle
        title="GitHub Contributions"
        subtitle="GitHubのコントリビューションを表示します。"
      />
      <Tabs defaultValue="calendar">
        <TabsList>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="chart">Chart</TabsTrigger>
        </TabsList>
        <TabsContent value="calendar">
          <GithubContributionCalendar contributions={contributions} />
        </TabsContent>

        <TabsContent value="chart">
          <GithubContributionChart contributions={contributions} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
