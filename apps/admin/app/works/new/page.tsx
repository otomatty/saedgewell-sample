import { BackLink } from '@kit/ui/back-link';
import { WorkFormTabs } from '../_components/form/WorkFormTabs';
import type { WorkWithRelations } from '@kit/types/works';

// 新規作成用の初期データ
const emptyWork: WorkWithRelations = {
  id: '',
  title: '',
  slug: '',
  description: '',
  thumbnail_url: null,
  github_url: null,
  website_url: null,
  category: 'company',
  status: 'draft',
  created_at: null,
  updated_at: null,
  work_details: [],
  work_images: [],
  work_responsibilities: [],
  work_challenges: [],
  work_solutions: [],
  work_results: [],
  work_technologies: [],
};

export default function WorkNewPage() {
  return (
    <div className="container py-8 space-y-8">
      <BackLink label="一覧に戻る" href="/admin/works" />
      <WorkFormTabs work={emptyWork} />
    </div>
  );
}
