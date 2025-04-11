import { ComponentDetail } from '../../_components/component-detail';
import { getComponentDoc } from '../../utils';
import { Galaxy3D } from '@kit/ui/galaxy-3d';

const CATEGORY = {
  id: 'animation',
  label: 'Animation',
};

export default async function Galaxy3DPage() {
  const component = await getComponentDoc('galaxy-3d');
  if (!component) return null;

  return (
    <>
      <ComponentDetail component={component} category={CATEGORY} />
      <div className="container mb-20">
        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-xl font-semibold">プレビュー</h2>
          <div className="h-[500px]">
            <Galaxy3D />
          </div>
        </div>
      </div>
    </>
  );
}
