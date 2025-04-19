import { BasicHero } from '@kit/ui/basic-hero';
import Aspirations from './_components/aspirations';
import InterestsList from './_components/interests-list';

const InterestsPage = () => {
  return (
    <div>
      <BasicHero
        title="興味関心"
        description="私の技術的な興味関心や、その他の分野への興味についてご紹介します。"
      />
      <InterestsList />
      <Aspirations />
    </div>
  );
};

export default InterestsPage;
