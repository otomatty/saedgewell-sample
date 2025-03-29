'use client';

import { useAtom } from 'jotai';
import { formDataAtom } from '../../_atoms/estimate';
import { Card } from '@kit/ui/card';
import { Label } from '@kit/ui/label';
import { RadioGroup, RadioGroupItem } from '@kit/ui/radio-group';
import type { ProjectType } from '../../_types/estimate';
import type { EstimateFormData } from '../../_types/estimate';
const projectTypes: {
  value: ProjectType;
  label: string;
  description: string;
}[] = [
  {
    value: 'web',
    label: 'Webサイト',
    description:
      'コーポレートサイト、ランディングページ、ブログなど、情報発信を目的としたWebサイト',
  },
  {
    value: 'app',
    label: 'Webアプリケーション',
    description:
      '会員管理、予約システム、ECサイトなど、特定の機能を持ったWebアプリケーション',
  },
  {
    value: 'other',
    label: 'その他',
    description: '上記以外のプロジェクト',
  },
];

export function ProjectTypeStep() {
  const [formData, setFormData] = useAtom(formDataAtom);

  const handleChange = (value: ProjectType) => {
    setFormData((prev: EstimateFormData) => ({
      ...prev,
      projectType: value,
    }));
  };

  return (
    <RadioGroup
      value={formData.projectType}
      onValueChange={handleChange}
      className="grid gap-4"
    >
      {projectTypes.map((type) => (
        <Label key={type.value} className="cursor-pointer">
          <Card className="relative p-4 transition-colors hover:bg-muted/50">
            <RadioGroupItem
              value={type.value}
              className="absolute right-4 top-4"
            />
            <div className="mb-2 font-bold">{type.label}</div>
            <p className="text-sm text-muted-foreground">{type.description}</p>
          </Card>
        </Label>
      ))}
    </RadioGroup>
  );
}
