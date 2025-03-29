'use client';

import { useAtom } from 'jotai';
import { Card } from '@kit/ui/card';
import { Label } from '@kit/ui/label';
import { RadioGroup, RadioGroupItem } from '@kit/ui/radio-group';
import { Checkbox } from '@kit/ui/checkbox';
import { formDataAtom } from '../../_atoms/estimate';
import type {
  DesignFormat,
  ImplementationRequirements,
  EstimateFormData,
} from '../../_types/estimate';

export function ImplementationRequirementsStep() {
  const [formData, setFormData] = useAtom(formDataAtom);
  const requirements = formData.implementationRequirements || {
    hasDesign: false,
    designFormat: 'none',
    hasBrandGuidelines: false,
    hasLogo: false,
    hasImages: false,
    hasIcons: false,
    hasCustomFonts: false,
    hasContent: false,
  };

  const updateRequirements = (updates: Partial<ImplementationRequirements>) => {
    setFormData((prev: EstimateFormData) => ({
      ...prev,
      implementationRequirements: {
        ...requirements,
        ...updates,
      },
    }));
  };

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <h3 className="text-lg font-bold mb-4">デザイン関連</h3>
        <div className="space-y-4">
          <div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasDesign"
                checked={requirements.hasDesign}
                onCheckedChange={(checked) => {
                  updateRequirements({
                    hasDesign: checked as boolean,
                    designFormat: checked ? 'none' : undefined,
                  });
                }}
              />
              <Label htmlFor="hasDesign">デザインデータの提供あり</Label>
            </div>
            {requirements.hasDesign && (
              <div className="mt-4 ml-6">
                <Label className="mb-2 block">デザインデータの形式</Label>
                <RadioGroup
                  value={requirements.designFormat}
                  onValueChange={(value) =>
                    updateRequirements({
                      designFormat: value as DesignFormat,
                    })
                  }
                >
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="figma" id="figma" />
                      <Label htmlFor="figma">Figma</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="xd" id="xd" />
                      <Label htmlFor="xd">Adobe XD</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="photoshop" id="photoshop" />
                      <Label htmlFor="photoshop">Photoshop</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sketch" id="sketch" />
                      <Label htmlFor="sketch">Sketch</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="other" />
                      <Label htmlFor="other">その他</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasBrandGuidelines"
              checked={requirements.hasBrandGuidelines}
              onCheckedChange={(checked) =>
                updateRequirements({
                  hasBrandGuidelines: checked as boolean,
                })
              }
            />
            <Label htmlFor="hasBrandGuidelines">
              ブランドガイドラインの提供あり
            </Label>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="text-lg font-bold mb-4">アセット関連</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasLogo"
              checked={requirements.hasLogo}
              onCheckedChange={(checked) =>
                updateRequirements({ hasLogo: checked as boolean })
              }
            />
            <Label htmlFor="hasLogo">ロゴデータの提供あり</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasIcons"
              checked={requirements.hasIcons}
              onCheckedChange={(checked) =>
                updateRequirements({ hasIcons: checked as boolean })
              }
            />
            <Label htmlFor="hasIcons">アイコンデータの提供あり</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasImages"
              checked={requirements.hasImages}
              onCheckedChange={(checked) =>
                updateRequirements({ hasImages: checked as boolean })
              }
            />
            <Label htmlFor="hasImages">画像素材の提供あり</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasCustomFonts"
              checked={requirements.hasCustomFonts}
              onCheckedChange={(checked) =>
                updateRequirements({ hasCustomFonts: checked as boolean })
              }
            />
            <Label htmlFor="hasCustomFonts">カスタムフォントの使用あり</Label>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="text-lg font-bold mb-4">コンテンツ関連</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasContent"
              checked={requirements.hasContent}
              onCheckedChange={(checked) =>
                updateRequirements({ hasContent: checked as boolean })
              }
            />
            <Label htmlFor="hasContent">コンテンツの提供あり</Label>
          </div>
        </div>
      </Card>
    </div>
  );
}
