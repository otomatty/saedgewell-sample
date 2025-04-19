import { ComponentDetail } from '../../_components/component-detail';
import { getComponentDoc } from '../../utils';
import { BentoGrid, BentoCard, MagicBentoCard } from '@kit/ui/bento-grid';
import { FileIcon, ImageIcon, VideoIcon } from 'lucide-react';
import { BasicBackground } from './_components/basic-background';

const CATEGORY = {
  id: 'layout',
  label: 'Layout',
};

export default async function BentoGridPage() {
  const component = await getComponentDoc('bento-grid');
  if (!component) return null;

  return (
    <>
      <ComponentDetail component={component} category={CATEGORY} />
      <div className="container mb-20">
        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-xl font-semibold">プレビュー</h2>
          <div className="space-y-8">
            <div>
              <h3 className="mb-4 text-lg font-medium">Basic Cards</h3>
              <BentoGrid>
                <BentoCard
                  name="ドキュメント"
                  className="col-span-4"
                  background={
                    <BasicBackground className="from-neutral-100 to-neutral-200 dark:from-neutral-900 dark:to-neutral-800" />
                  }
                  Icon={FileIcon}
                  description="プロジェクトのドキュメントを管理"
                  href="#"
                  cta="表示"
                />
                <BentoCard
                  name="画像"
                  className="col-span-4"
                  background={
                    <BasicBackground className="from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800" />
                  }
                  Icon={ImageIcon}
                  description="プロジェクトの画像アセット"
                  href="#"
                  cta="表示"
                />
                <BentoCard
                  name="動画"
                  className="col-span-4"
                  background={
                    <BasicBackground className="from-green-100 to-green-200 dark:from-green-900 dark:to-green-800" />
                  }
                  Icon={VideoIcon}
                  description="プロジェクトの動画コンテンツ"
                  href="#"
                  cta="表示"
                />
              </BentoGrid>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-medium">Magic Cards</h3>
              <BentoGrid>
                <MagicBentoCard
                  name="マジックカード1"
                  className="col-span-6"
                  background={
                    <BasicBackground className="from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800" />
                  }
                  Icon={FileIcon}
                  description="マウスに反応するグラデーションエフェクト"
                  href="#"
                  cta="表示"
                />
                <MagicBentoCard
                  name="マジックカード2"
                  className="col-span-6"
                  background={
                    <BasicBackground className="from-pink-100 to-pink-200 dark:from-pink-900 dark:to-pink-800" />
                  }
                  Icon={ImageIcon}
                  description="インタラクティブなホバーエフェクト"
                  href="#"
                  cta="表示"
                />
              </BentoGrid>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
