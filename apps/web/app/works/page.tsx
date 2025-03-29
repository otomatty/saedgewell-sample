import type { Metadata } from 'next';
import { getWorks } from '~/actions/work';
import { getTechnologies } from '~/actions/technology';
import { WorksHero } from './_components/WorksHero';
import { WorksFilter } from './_components/WorksFilter';
import { Container } from '../_layout/Container';

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
