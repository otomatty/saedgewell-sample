'use client';

import { Trans as TransComponent } from 'react-i18next/TransWithoutContext';
import { useTranslation } from 'react-i18next';

export function Trans(props: React.ComponentProps<typeof TransComponent>) {
  const { i18n } = useTranslation();
  return <TransComponent i18n={i18n} {...props} />;
}
