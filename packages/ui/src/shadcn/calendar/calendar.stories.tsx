// @ts-nocheck - Storybookの型定義の問題を回避
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { addDays, format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Calendar } from './index';
import { Button } from '../button';

/**
 * `Calendar`コンポーネントは、日付の選択や表示のためのカレンダーUIを提供します。
 *
 * ## 特徴
 * - 単一日付の選択
 * - 日付範囲の選択
 * - 複数日付の選択
 * - カスタマイズ可能なスタイル
 * - 国際化対応
 * - アクセシビリティ対応
 *
 * ## 使用例
 * ```tsx
 * const [date, setDate] = useState<Date | undefined>(new Date());
 *
 * return (
 *   <Calendar
 *     mode="single"
 *     selected={date}
 *     onSelect={setDate}
 *     className="rounded-md border"
 *   />
 * );
 * ```
 *
 * ## アクセシビリティ
 * - キーボードナビゲーション対応
 * - スクリーンリーダー対応
 * - 適切なARIAラベル
 */
const meta = {
  title: 'Shadcn/Calendar',
  component: Calendar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Calendarコンポーネントは、日付の選択や表示のためのカレンダーUIを提供します。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    mode: {
      control: 'select',
      options: ['single', 'multiple', 'range', 'default'],
      description: 'カレンダーの選択モード',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'single' },
      },
    },
    selected: {
      control: 'date',
      description: '選択された日付',
      table: {
        type: { summary: 'Date | Date[] | DateRange | undefined' },
      },
    },
    onSelect: {
      action: 'selected',
      description: '日付が選択されたときのコールバック',
      table: {
        type: { summary: 'function' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'カレンダーを無効化するかどうか',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    showOutsideDays: {
      control: 'boolean',
      description: '現在の月の外側の日付を表示するかどうか',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    className: {
      control: 'text',
      description: '追加のCSSクラス',
      table: {
        type: { summary: 'string' },
      },
    },
  },
} as Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 基本的なカレンダーの例です。
 * 単一の日付を選択できます。
 */
export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: '基本的なカレンダーの例です。単一の日付を選択できます。',
      },
    },
  },
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    return (
      <div className="space-y-4">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
        />
        <p className="text-center text-sm">
          {date
            ? format(date, 'yyyy年MM月dd日', { locale: ja })
            : '日付が選択されていません'}
        </p>
      </div>
    );
  },
};

/**
 * 日付範囲選択の例です。
 * 開始日と終了日を選択できます。
 */
export const DateRange: Story = {
  parameters: {
    docs: {
      description: {
        story: '日付範囲選択の例です。開始日と終了日を選択できます。',
      },
    },
  },
  render: () => {
    const [dateRange, setDateRange] = useState<{
      from: Date;
      to?: Date;
    }>({
      from: new Date(),
      to: addDays(new Date(), 7),
    });
    return (
      <div className="space-y-4">
        <Calendar
          mode="range"
          selected={dateRange}
          onSelect={setDateRange}
          className="rounded-md border"
          numberOfMonths={2}
        />
        <p className="text-center text-sm">
          {dateRange.from && (
            <>
              {format(dateRange.from, 'yyyy年MM月dd日', { locale: ja })}
              {dateRange.to && (
                <>
                  {' '}
                  〜 {format(dateRange.to, 'yyyy年MM月dd日', { locale: ja })}
                </>
              )}
            </>
          )}
        </p>
      </div>
    );
  },
};

/**
 * 複数日付選択の例です。
 * 複数の日付を選択できます。
 */
export const MultipleDates: Story = {
  parameters: {
    docs: {
      description: {
        story: '複数日付選択の例です。複数の日付を選択できます。',
      },
    },
  },
  render: () => {
    const [dates, setDates] = useState<Date[]>([new Date()]);
    return (
      <div className="space-y-4">
        <Calendar
          mode="multiple"
          selected={dates}
          onSelect={setDates}
          className="rounded-md border"
        />
        <div className="text-center text-sm">
          <p>選択された日付:</p>
          <ul className="mt-2 space-y-1">
            {dates.map((date) => (
              <li key={date.toISOString()}>
                {format(date, 'yyyy年MM月dd日', { locale: ja })}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  },
};

/**
 * 日本語ローカライズの例です。
 * 日本語の曜日と月名を表示します。
 */
export const Localized: Story = {
  parameters: {
    docs: {
      description: {
        story: '日本語ローカライズの例です。日本語の曜日と月名を表示します。',
      },
    },
  },
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    return (
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border"
        locale={ja}
        formatters={{
          formatWeekdayName: (day) => format(day, 'E', { locale: ja }),
          formatCaption: (date) => format(date, 'yyyy年 MMMM', { locale: ja }),
        }}
      />
    );
  },
};

/**
 * 無効化された日付の例です。
 * 特定の日付を選択できないようにします。
 */
export const DisabledDates: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '無効化された日付の例です。特定の日付を選択できないようにします。',
      },
    },
  },
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date());

    // 週末（土日）を無効化
    const disabledDays = [
      { dayOfWeek: [0, 6] }, // 0: 日曜日, 6: 土曜日
    ];

    // 過去の日付を無効化
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return (
      <div className="space-y-4">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
          disabled={disabledDays}
          fromDate={today}
        />
        <p className="text-center text-sm text-muted-foreground">
          週末と過去の日付は選択できません
        </p>
      </div>
    );
  },
};

/**
 * カスタムスタイルの例です。
 * カレンダーのスタイルをカスタマイズしています。
 */
export const CustomStyling: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'カスタムスタイルの例です。カレンダーのスタイルをカスタマイズしています。',
      },
    },
  },
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    return (
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border border-primary/20 bg-background/50 p-4 shadow-md"
        classNames={{
          caption:
            'flex justify-center pt-1 relative items-center text-primary font-bold',
          day_selected:
            'bg-primary/80 text-primary-foreground hover:bg-primary hover:text-primary-foreground',
          day_today: 'bg-secondary/30 text-foreground font-bold',
        }}
      />
    );
  },
};

/**
 * インラインカレンダーピッカーの例です。
 * ボタンクリックでカレンダーを表示します。
 */
export const InlineDatePicker: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'インラインカレンダーピッカーの例です。ボタンクリックでカレンダーを表示します。',
      },
    },
  },
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="space-y-4">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          variant="outline"
          className="w-[240px] justify-start text-left font-normal"
        >
          <span>
            {date
              ? format(date, 'yyyy年MM月dd日', { locale: ja })
              : '日付を選択'}
          </span>
        </Button>
        {isOpen && (
          <div className="rounded-md border shadow-md">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => {
                setDate(newDate);
                setIsOpen(false);
              }}
            />
          </div>
        )}
      </div>
    );
  },
};
