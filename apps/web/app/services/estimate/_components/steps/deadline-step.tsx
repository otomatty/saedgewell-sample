'use client';

import { useAtom } from 'jotai';
import { formDataAtom } from '~/store/estimate';
import { Card } from '@kit/ui/card';
import { Label } from '@kit/ui/label';
import { RadioGroup, RadioGroupItem } from '@kit/ui/radio-group';
import type { Deadline, EstimateFormData } from '~/types/estimate';

const deadlines: { value: Deadline; label: string; description: string }[] = [
  {
    value: 'asap',
    label: 'できるだけ早く',
    description: '最短での納品を希望（1ヶ月以内）',
  },
  {
    value: '1month',
    label: '1ヶ月以内',
    description: '1ヶ月程度での納品を希望',
  },
  {
    value: '3months',
    label: '3ヶ月以内',
    description: '3ヶ月程度での納品を希望',
  },
  {
    value: '6months',
    label: '6ヶ月以内',
    description: '6ヶ月程度での納品を希望',
  },
  {
    value: 'flexible',
    label: '柔軟に対応可能',
    description: '納期は柔軟に調整可能',
  },
];

export function DeadlineStep() {
  const [formData, setFormData] = useAtom(formDataAtom);

  const handleChange = (value: Deadline) => {
    setFormData((prev: EstimateFormData) => ({
      ...prev,
      deadline: value,
    }));
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        希望する開発期間を選択してください。開発規模や要件によって実際の期間は変動する可能性があります。
      </p>
      <RadioGroup
        value={formData.deadline}
        onValueChange={handleChange}
        className="grid gap-4"
      >
        {deadlines.map((deadline) => (
          <Label key={deadline.value} className="cursor-pointer">
            <Card className="relative p-4 transition-colors hover:bg-muted/50">
              <RadioGroupItem
                value={deadline.value}
                className="absolute right-4 top-4"
              />
              <div className="mb-2 font-bold">{deadline.label}</div>
              <p className="text-sm text-muted-foreground">
                {deadline.description}
              </p>
            </Card>
          </Label>
        ))}
      </RadioGroup>
    </div>
  );
}
