/**
 * パスワード更新ページコンポーネント
 *
 * このファイルはユーザーがパスワードを更新するためのページを定義します。
 * 認証済みユーザーのみがアクセスでき、パスワード更新フォームを表示します。
 * 更新後は指定されたコールバックURLまたはホームページにリダイレクトします。
 */

import { UpdatePasswordForm } from '@kit/auth/password-reset';
import { AuthLayoutShell } from '@kit/auth/shared';

import { AppLogo } from '~/components/app-logo';
import pathsConfig from '~/config/paths.config';
import { createI18nServerInstance } from '~/lib/i18n/i18n.server';
import { withI18n } from '~/lib/i18n/with-i18n';
import { requireUserInServerComponent } from '~/lib/server/require-user-in-server-component';

/**
 * ページのメタデータを生成する関数
 *
 * i18nを使用してページタイトルを多言語対応させます。
 *
 * @returns ページのメタデータオブジェクト
 */
export const generateMetadata = async () => {
  const { t } = await createI18nServerInstance();

  return {
    title: t('auth:updatePassword'),
  };
};

/**
 * アプリケーションロゴコンポーネント
 *
 * リンクなしのロゴを表示します。
 */
const Logo = () => <AppLogo href={''} />;

/**
 * パスワード更新ページのプロパティ型定義
 *
 * searchParamsには、更新後のリダイレクト先を指定するcallbackパラメータが含まれます。
 */
interface UpdatePasswordPageProps {
  searchParams: Promise<{
    callback?: string;
  }>;
}

/**
 * パスワード更新ページコンポーネント
 *
 * 認証済みユーザーのみがアクセスできるようにチェックし、
 * パスワード更新フォームを表示します。
 *
 * @param props - ページのプロパティ
 * @returns パスワード更新ページのJSX
 */
async function UpdatePasswordPage(props: UpdatePasswordPageProps) {
  // 認証済みユーザーのみアクセス可能にする
  await requireUserInServerComponent();

  // コールバックURLを取得（指定がなければホームページを使用）
  const { callback } = await props.searchParams;
  const redirectTo = callback ?? pathsConfig.app.home;

  return (
    <AuthLayoutShell Logo={Logo}>
      <UpdatePasswordForm redirectTo={redirectTo} />
    </AuthLayoutShell>
  );
}

// i18nをサポートするためのラッパーでエクスポート
export default withI18n(UpdatePasswordPage);
