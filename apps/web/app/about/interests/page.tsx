import { BasicHero } from '@kit/ui/basic-hero';
import Aspirations from './_components/Aspirations';
import InterestsList from './_components/InterestsList';

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
