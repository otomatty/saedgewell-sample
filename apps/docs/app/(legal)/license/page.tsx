import { PageHeader } from '@kit/ui/page-header';
import { createI18nServerInstance } from '~/lib/i18n/i18n.server';
import { withI18n } from '~/lib/i18n/with-i18n';

export async function generateMetadata() {
  const { t } = await createI18nServerInstance();

  return {
    title: t('marketing:cookiePolicy'),
  };
}

async function CookiePolicyPage() {
  const { t } = await createI18nServerInstance();

  return (
    <div>
      <PageHeader
        title={'ライセンス'}
        description={'当サイトのライセンスについて説明します。'}
      />

      <div className={'container mx-auto py-8'}>
        <div>ここにライセンスの内容を記載します。</div>
      </div>
    </div>
  );
}

export default withI18n(CookiePolicyPage);
