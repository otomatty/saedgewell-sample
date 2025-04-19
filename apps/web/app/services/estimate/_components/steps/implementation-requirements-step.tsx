'use client';

import { useAtom } from 'jotai';
import { Card } from '@kit/ui/card';
import { Label } from '@kit/ui/label';
import { RadioGroup, RadioGroupItem } from '@kit/ui/radio-group';
import {
  LayoutTemplate,
  SquarePen,
  Image,
  Diamond,
  HelpCircle,
  Minus,
} from 'lucide-react';
import { formDataAtom } from '~/store/estimate';
import type {
  DesignFormat,
  ImplementationRequirements,
  EstimateFormData,
} from '~/types/estimate';
import { cn } from '@kit/ui/utils';

const designFormats: {
  value: DesignFormat;
  label: string;
  icon: React.ElementType;
}[] = [
  { value: 'figma', label: 'Figma', icon: LayoutTemplate },
  { value: 'xd', label: 'Adobe XD', icon: SquarePen },
  { value: 'photoshop', label: 'Photoshop', icon: Image },
  { value: 'sketch', label: 'Sketch', icon: Diamond },
  { value: 'other', label: 'その他', icon: HelpCircle },
  { value: 'none', label: '指定なし', icon: Minus },
];

export function ImplementationRequirementsStep() {
  const [formData, setFormData] = useAtom(formDataAtom);
  const requirements: ImplementationRequirements =
    formData.implementationRequirements || {
      hasDesign: false,
      designFormat: 'none',
      hasBrandGuidelines: false,
      hasLogo: false,
      hasImages: false,
      hasIcons: false,
      hasCustomFonts: false,
      hasContent: false,
    };

  const getRadioValue = (value: boolean | undefined): string => {
    if (value === true) return 'yes';
    if (value === false) return 'no';
    return 'no';
  };

  const updateRequirements = (updates: Partial<ImplementationRequirements>) => {
    setFormData((prev: EstimateFormData) => {
      const prevRequirements = prev.implementationRequirements || {
        hasDesign: false,
        designFormat: 'none',
        hasBrandGuidelines: false,
        hasLogo: false,
        hasImages: false,
        hasIcons: false,
        hasCustomFonts: false,
        hasContent: false,
      };

      let newRequirements: ImplementationRequirements = {
        hasDesign: updates.hasDesign ?? prevRequirements.hasDesign,
        designFormat: updates.designFormat ?? prevRequirements.designFormat,
        hasBrandGuidelines:
          updates.hasBrandGuidelines ?? prevRequirements.hasBrandGuidelines,
        hasLogo: updates.hasLogo ?? prevRequirements.hasLogo,
        hasImages: updates.hasImages ?? prevRequirements.hasImages,
        hasIcons: updates.hasIcons ?? prevRequirements.hasIcons,
        hasCustomFonts:
          updates.hasCustomFonts ?? prevRequirements.hasCustomFonts,
        hasContent: updates.hasContent ?? prevRequirements.hasContent,
      };

      if (newRequirements.hasDesign === false) {
        newRequirements = { ...newRequirements, designFormat: 'none' };
      }

      return {
        ...prev,
        implementationRequirements: newRequirements,
      };
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <Label className="text-base font-medium block mb-2">
          デザインデータはありますか？
        </Label>
        <p className="text-sm text-muted-foreground mb-4">
          Figma、Adobe
          XD、Sketchなどで作成された画面デザインデータがあれば、より忠実な再現と効率的な開発が可能になります。
        </p>
        <RadioGroup
          value={getRadioValue(requirements.hasDesign)}
          onValueChange={(value) => {
            const hasDesign = value === 'yes';
            updateRequirements({
              hasDesign: hasDesign,
              designFormat: hasDesign ? requirements.designFormat : 'none',
            });
          }}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="hasDesign-yes" />
            <Label htmlFor="hasDesign-yes">はい、提供できます</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="hasDesign-no" />
            <Label htmlFor="hasDesign-no">いいえ、ありません</Label>
          </div>
        </RadioGroup>

        {requirements.hasDesign && (
          <div className="mt-4 pt-4 border-t border-muted">
            <Label className="text-base font-medium block mb-4">
              デザインデータの形式を選択してください
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {designFormats.map((format) => (
                <Card
                  key={format.value}
                  className={cn(
                    'p-4 flex flex-col items-center justify-center cursor-pointer transition-colors border-2',
                    {
                      'border-primary bg-primary/10':
                        requirements.designFormat === format.value,
                      'border-transparent hover:border-muted-foreground/50':
                        requirements.designFormat !== format.value,
                    }
                  )}
                  onClick={() =>
                    updateRequirements({ designFormat: format.value })
                  }
                >
                  <div className="mb-2 flex items-center justify-center text-muted-foreground">
                    <format.icon className="w-8 h-8" />
                  </div>
                  <span className="text-sm text-center">{format.label}</span>
                </Card>
              ))}
            </div>
          </div>
        )}
      </Card>

      <Card className="p-4">
        <Label className="text-base font-medium block mb-2">
          ブランドガイドラインはありますか？
        </Label>
        <p className="text-sm text-muted-foreground mb-4">
          色、フォント、ロゴの使用ルールなどが定められたガイドラインがあれば、デザインの一貫性を保ちやすくなります。
        </p>
        <RadioGroup
          value={getRadioValue(requirements.hasBrandGuidelines)}
          onValueChange={(value) =>
            updateRequirements({ hasBrandGuidelines: value === 'yes' })
          }
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="hasBrandGuidelines-yes" />
            <Label htmlFor="hasBrandGuidelines-yes">はい、提供できます</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="hasBrandGuidelines-no" />
            <Label htmlFor="hasBrandGuidelines-no">いいえ、ありません</Label>
          </div>
        </RadioGroup>
      </Card>

      <Card className="p-4">
        <Label className="text-base font-medium block mb-2">
          ロゴデータはありますか？
        </Label>
        <p className="text-sm text-muted-foreground mb-4">
          Webサイトやアプリで使用するロゴのデータ（SVG,
          PNGなど）を提供いただけますか？
        </p>
        <RadioGroup
          value={getRadioValue(requirements.hasLogo)}
          onValueChange={(value) =>
            updateRequirements({ hasLogo: value === 'yes' })
          }
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="hasLogo-yes" />
            <Label htmlFor="hasLogo-yes">はい、提供できます</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="hasLogo-no" />
            <Label htmlFor="hasLogo-no">いいえ、ありません</Label>
          </div>
        </RadioGroup>
      </Card>

      <Card className="p-4">
        <Label className="text-base font-medium block mb-2">
          アイコンデータはありますか？
        </Label>
        <p className="text-sm text-muted-foreground mb-4">
          メニューやボタンなどで使用するアイコンのデータを提供いただけますか？
        </p>
        <RadioGroup
          value={getRadioValue(requirements.hasIcons)}
          onValueChange={(value) =>
            updateRequirements({ hasIcons: value === 'yes' })
          }
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="hasIcons-yes" />
            <Label htmlFor="hasIcons-yes">はい、提供できます</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="hasIcons-no" />
            <Label htmlFor="hasIcons-no">いいえ、ありません</Label>
          </div>
        </RadioGroup>
      </Card>

      <Card className="p-4">
        <Label className="text-base font-medium block mb-2">
          画像素材はありますか？
        </Label>
        <p className="text-sm text-muted-foreground mb-4">
          Webサイトやアプリ内で使用する写真やイラストなどの画像素材を提供いただけますか？
        </p>
        <RadioGroup
          value={getRadioValue(requirements.hasImages)}
          onValueChange={(value) =>
            updateRequirements({ hasImages: value === 'yes' })
          }
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="hasImages-yes" />
            <Label htmlFor="hasImages-yes">はい、提供できます</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="hasImages-no" />
            <Label htmlFor="hasImages-no">いいえ、ありません</Label>
          </div>
        </RadioGroup>
      </Card>

      <Card className="p-4">
        <Label className="text-base font-medium block mb-2">
          使用したいカスタムフォントはありますか？
        </Label>
        <p className="text-sm text-muted-foreground mb-4">
          特定のフォント（有料フォントや特殊なフォント）を使用したい場合、ライセンス情報と合わせてご指定ください。
        </p>
        <RadioGroup
          value={getRadioValue(requirements.hasCustomFonts)}
          onValueChange={(value) =>
            updateRequirements({ hasCustomFonts: value === 'yes' })
          }
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="hasCustomFonts-yes" />
            <Label htmlFor="hasCustomFonts-yes">はい、あります</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="hasCustomFonts-no" />
            <Label htmlFor="hasCustomFonts-no">
              いいえ、ありません（お任せします）
            </Label>
          </div>
        </RadioGroup>
      </Card>

      <Card className="p-4">
        <Label className="text-base font-medium block mb-2">
          掲載するコンテンツ（文章など）は用意されていますか？
        </Label>
        <p className="text-sm text-muted-foreground mb-4">
          Webサイトやアプリに掲載するテキスト、説明文などのコンテンツは作成済みですか？
        </p>
        <RadioGroup
          value={getRadioValue(requirements.hasContent)}
          onValueChange={(value) =>
            updateRequirements({ hasContent: value === 'yes' })
          }
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="hasContent-yes" />
            <Label htmlFor="hasContent-yes">はい、用意があります</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="hasContent-no" />
            <Label htmlFor="hasContent-no">
              いいえ、ありません（作成も依頼します）
            </Label>
          </div>
        </RadioGroup>
      </Card>
    </div>
  );
}
