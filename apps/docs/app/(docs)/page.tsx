import { getDocTypes } from '~/lib/mdx/docs';
import { DocTypeTabs } from './_components/doc-type-tabs';
import type { DocType } from '~/types/mdx/document';
import { Hero } from '~/components/layout/hero';

export default async function HomePage() {
  const { categories, docTypes } = getDocTypes();

  // カテゴリごとにドキュメントタイプをグループ化
  const docTypesByCategory = docTypes.reduce(
    (acc: Record<string, DocType[]>, docType: DocType) => {
      if (docType.category) {
        const category = docType.category;
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(docType);
      }
      return acc;
    },
    {}
  );

  return (
    <div>
      <Hero />

      <div className="container mx-auto px-4 py-12">
        <DocTypeTabs
          categories={categories}
          docTypes={docTypes}
          docTypesByCategory={docTypesByCategory}
        />
      </div>
    </div>
  );
}
