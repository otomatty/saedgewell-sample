import { ComponentDetail } from '../../_components/component-detail';
import { getComponentDoc } from '../../utils';
import { ThemeToggle } from '@kit/ui/theme-toggle';

const CATEGORY = {
  id: 'ui',
  label: 'UI Components',
};

export default async function ThemeTogglePage() {
  const component = await getComponentDoc('theme-toggle');
  if (!component) return null;

  return (
    <>
      <ComponentDetail component={component} category={CATEGORY} />
      <div className="container mb-20">
        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-xl font-semibold">プレビュー</h2>
          <div className="flex min-h-[200px] items-center justify-center">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </>
  );
}
