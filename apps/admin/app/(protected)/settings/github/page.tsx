import type { Metadata } from 'next';
import { GitHubSettingsForm } from './_components/github-settings-form';
import { GitHubSettingsList } from './_components/github-settings-list';
import { PageHeader } from '@kit/ui/page-header';

export const metadata: Metadata = {
  title: 'GitHub設定',
  description: 'GitHub連携の設定を行います。',
};

export default function GitHubSettingsPage() {
  return (
    <>
      <PageHeader title="GitHub設定" />
      <div className="container mx-auto py-6 space-y-8">
        <GitHubSettingsForm />
        <GitHubSettingsList />
      </div>
    </>
  );
}
