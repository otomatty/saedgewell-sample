import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from './index';

/**
 * `Table`コンポーネントは、データを表形式で表示するためのテーブルを提供します。
 *
 * ## 特徴
 * - ヘッダー、ボディ、フッターのセクション分け
 * - カスタマイズ可能なスタイル
 * - アクセシビリティ対応
 * - レスポンシブ対応
 *
 * ## 使用例
 * ```tsx
 * <Table>
 *   <TableHeader>
 *     <TableRow>
 *       <TableHead>ヘッダー</TableHead>
 *     </TableRow>
 *   </TableHeader>
 *   <TableBody>
 *     <TableRow>
 *       <TableCell>データ</TableCell>
 *     </TableRow>
 *   </TableBody>
 * </Table>
 * ```
 *
 * ## アクセシビリティ
 * - WAI-ARIA準拠
 * - スクリーンリーダーで適切に読み上げられる
 */
const meta = {
  title: 'Shadcn/Table',
  component: Table,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Tableコンポーネントは、データを表形式で表示するためのテーブルを提供します。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: '追加のCSSクラス',
    },
  },
} as Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 基本的なTableの例です。
 */
export const Basic: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>名前</TableHead>
          <TableHead>メールアドレス</TableHead>
          <TableHead>役職</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>山田 太郎</TableCell>
          <TableCell>yamada@example.com</TableCell>
          <TableCell>エンジニア</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>鈴木 花子</TableCell>
          <TableCell>suzuki@example.com</TableCell>
          <TableCell>デザイナー</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '基本的なTableの例です。ヘッダーとボディを含むシンプルなテーブルを示しています。',
      },
    },
  },
};

/**
 * フッター付きのTableの例です。
 */
export const WithFooter: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>商品名</TableHead>
          <TableHead>単価</TableHead>
          <TableHead>数量</TableHead>
          <TableHead>小計</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>商品A</TableCell>
          <TableCell>¥1,000</TableCell>
          <TableCell>2</TableCell>
          <TableCell>¥2,000</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>商品B</TableCell>
          <TableCell>¥2,000</TableCell>
          <TableCell>1</TableCell>
          <TableCell>¥2,000</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3} className="text-right">
            合計
          </TableCell>
          <TableCell>¥4,000</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'フッター付きのTableの例です。合計金額を表示するフッターを含むテーブルを示しています。',
      },
    },
  },
};

/**
 * キャプション付きのTableの例です。
 */
export const WithCaption: Story = {
  render: () => (
    <Table>
      <TableCaption>従業員一覧</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>名前</TableHead>
          <TableHead>部署</TableHead>
          <TableHead>入社日</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>001</TableCell>
          <TableCell>山田 太郎</TableCell>
          <TableCell>技術部</TableCell>
          <TableCell>2020-04-01</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>002</TableCell>
          <TableCell>鈴木 花子</TableCell>
          <TableCell>営業部</TableCell>
          <TableCell>2021-07-15</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'キャプション付きのTableの例です。テーブルの説明を表示するキャプションを含むテーブルを示しています。',
      },
    },
  },
};

/**
 * 実際のユースケースでのTableの例です。
 */
export const UseCases: Story = {
  render: () => (
    <div className="space-y-8">
      {/* 請求書の例 */}
      <div>
        <h4 className="text-sm font-medium mb-4">請求書</h4>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>項目</TableHead>
              <TableHead>単価</TableHead>
              <TableHead>数量</TableHead>
              <TableHead>金額</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Webサイト制作</TableCell>
              <TableCell>¥100,000</TableCell>
              <TableCell>1</TableCell>
              <TableCell>¥100,000</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>保守費用</TableCell>
              <TableCell>¥20,000</TableCell>
              <TableCell>3</TableCell>
              <TableCell>¥60,000</TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3} className="text-right">
                小計
              </TableCell>
              <TableCell>¥160,000</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={3} className="text-right">
                消費税（10%）
              </TableCell>
              <TableCell>¥16,000</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={3} className="text-right font-medium">
                合計
              </TableCell>
              <TableCell className="font-medium">¥176,000</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>

      {/* スケジュール表の例 */}
      <div>
        <h4 className="text-sm font-medium mb-4">週間スケジュール</h4>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>時間</TableHead>
              <TableHead>月曜日</TableHead>
              <TableHead>火曜日</TableHead>
              <TableHead>水曜日</TableHead>
              <TableHead>木曜日</TableHead>
              <TableHead>金曜日</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>9:00</TableCell>
              <TableCell>朝会</TableCell>
              <TableCell>朝会</TableCell>
              <TableCell>朝会</TableCell>
              <TableCell>朝会</TableCell>
              <TableCell>朝会</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>10:00</TableCell>
              <TableCell>開発</TableCell>
              <TableCell>開発</TableCell>
              <TableCell>ミーティング</TableCell>
              <TableCell>開発</TableCell>
              <TableCell>開発</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>13:00</TableCell>
              <TableCell>昼休憩</TableCell>
              <TableCell>昼休憩</TableCell>
              <TableCell>昼休憩</TableCell>
              <TableCell>昼休憩</TableCell>
              <TableCell>昼休憩</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>14:00</TableCell>
              <TableCell>開発</TableCell>
              <TableCell>レビュー</TableCell>
              <TableCell>開発</TableCell>
              <TableCell>開発</TableCell>
              <TableCell>週次報告</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '実際のユースケースでのTableの例です。請求書とスケジュール表の例を示しています。',
      },
    },
  },
};
