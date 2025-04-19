import { PageHeader } from '@kit/ui/page-header';
import { createI18nServerInstance } from '~/lib/i18n/i18n.server';
import { withI18n } from '~/lib/i18n/with-i18n';

export async function generateMetadata() {
  const { t } = await createI18nServerInstance();

  return {
    title: t('marketing:privacyPolicy'),
  };
}

async function PrivacyPolicyPage() {
  const { t } = await createI18nServerInstance();

  return (
    <div>
      <PageHeader
        title={'プライバシーポリシー'}
        description={'お客様の個人情報の取り扱いについて説明します。'}
      />

      <div className={'container mx-auto py-8'}>
        <div>ここにプライバシーポリシーの内容を記載します。</div>
      </div>
    </div>
  );
}

export default withI18n(PrivacyPolicyPage);
