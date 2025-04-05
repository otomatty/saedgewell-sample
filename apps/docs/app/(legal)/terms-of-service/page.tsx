import { PageHeader } from '@kit/ui/page-header';
import { createI18nServerInstance } from '~/lib/i18n/i18n.server';
import { withI18n } from '~/lib/i18n/with-i18n';

export async function generateMetadata() {
  const { t } = await createI18nServerInstance();

  return {
    title: t('marketing:termsOfService'),
  };
}

async function TermsOfServicePage() {
  const { t } = await createI18nServerInstance();

  return (
    <div>
      <PageHeader
        title={'利用規約'}
        description={'当サービスのご利用にあたっての規約を説明します。'}
      />

      <div className={'container mx-auto py-8'}>
        <div>ここに利用規約の内容を記載します。</div>
      </div>
    </div>
  );
}

export default withI18n(TermsOfServicePage);
