import type { Metadata } from 'next';
import { getWorks } from '@kit/next/actions';
import { getTechnologies } from '@kit/next/actions';
import { WorksHero } from './_components/works-hero';
import { WorksFilter } from './_components/works-filter';
import { Container } from '../../components/layout/container';

export const metadata: Metadata = {
  title: '実績一覧 | Saedge Well',
  description: 'これまでの実績をご紹介します。',
};

export default async function WorksPage() {
  const [works, technologies] = await Promise.all([
    getWorks(),
    getTechnologies(),
  ]);

  return (
    <>
      <WorksHero />
      <Container>
        <WorksFilter works={works} technologies={technologies} />
      </Container>
    </>
  );
}
