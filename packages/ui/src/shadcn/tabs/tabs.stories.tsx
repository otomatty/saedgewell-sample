import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './index';
import { Label } from '../label';
import { Input } from '../input';
import { Textarea } from '../textarea';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../select';

/**
 * `Tabs`コンポーネントは、タブ形式でコンテンツを切り替えるためのインターフェースを提供します。
 *
 * ## 特徴
 * - タブの切り替え機能
 * - カスタマイズ可能なスタイル
 * - キーボード操作対応
 * - アクセシビリティ対応
 *
 * ## 使用例
 * ```tsx
 * <Tabs defaultValue="tab1">
 *   <TabsList>
 *     <TabsTrigger value="tab1">タブ1</TabsTrigger>
 *     <TabsTrigger value="tab2">タブ2</TabsTrigger>
 *   </TabsList>
 *   <TabsContent value="tab1">コンテンツ1</TabsContent>
 *   <TabsContent value="tab2">コンテンツ2</TabsContent>
 * </Tabs>
 * ```
 *
 * ## アクセシビリティ
 * - WAI-ARIA準拠
 * - キーボード操作対応
 * - スクリーンリーダーで適切に読み上げられる
 */
const meta = {
  title: 'Shadcn/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Tabsコンポーネントは、タブ形式でコンテンツを切り替えるためのインターフェースを提供します。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    defaultValue: {
      control: 'text',
      description: 'デフォルトで選択されるタブの値',
    },
    value: {
      control: 'text',
      description: '現在選択されているタブの値',
    },
    onValueChange: {
      description: 'タブが切り替えられた時のコールバック関数',
    },
    className: {
      control: 'text',
      description: '追加のCSSクラス',
    },
  },
} as Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 基本的なTabsの例です。
 */
export const Basic: Story = {
  render: () => (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="account">アカウント</TabsTrigger>
        <TabsTrigger value="password">パスワード</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <div className="rounded-md border p-4">
          <h3 className="text-lg font-medium">アカウント設定</h3>
          <p className="text-sm text-muted-foreground">
            アカウントの基本情報を管理します。
          </p>
        </div>
      </TabsContent>
      <TabsContent value="password">
        <div className="rounded-md border p-4">
          <h3 className="text-lg font-medium">パスワード設定</h3>
          <p className="text-sm text-muted-foreground">
            パスワードの変更やセキュリティ設定を行います。
          </p>
        </div>
      </TabsContent>
    </Tabs>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '基本的なTabsの例です。アカウントとパスワードの設定を切り替えるタブを示しています。',
      },
    },
  },
};

/**
 * 3つのタブを持つTabsの例です。
 */
export const ThreeTabs: Story = {
  render: () => (
    <Tabs defaultValue="general" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="general">一般</TabsTrigger>
        <TabsTrigger value="notifications">通知</TabsTrigger>
        <TabsTrigger value="privacy">プライバシー</TabsTrigger>
      </TabsList>
      <TabsContent value="general">
        <div className="rounded-md border p-4">
          <h3 className="text-lg font-medium">一般設定</h3>
          <p className="text-sm text-muted-foreground">
            アプリケーションの基本設定を行います。
          </p>
        </div>
      </TabsContent>
      <TabsContent value="notifications">
        <div className="rounded-md border p-4">
          <h3 className="text-lg font-medium">通知設定</h3>
          <p className="text-sm text-muted-foreground">
            通知の種類や頻度を設定します。
          </p>
        </div>
      </TabsContent>
      <TabsContent value="privacy">
        <div className="rounded-md border p-4">
          <h3 className="text-lg font-medium">プライバシー設定</h3>
          <p className="text-sm text-muted-foreground">
            プライバシーとセキュリティの設定を行います。
          </p>
        </div>
      </TabsContent>
    </Tabs>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '3つのタブを持つTabsの例です。一般、通知、プライバシーの設定を切り替えるタブを示しています。',
      },
    },
  },
};

/**
 * カスタムスタイルを適用したTabsの例です。
 */
export const CustomStyling: Story = {
  render: () => (
    <div className="space-y-8">
      {/* 青色のタブ */}
      <Tabs defaultValue="tab1" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2 bg-blue-100">
          <TabsTrigger
            value="tab1"
            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
          >
            タブ1
          </TabsTrigger>
          <TabsTrigger
            value="tab2"
            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
          >
            タブ2
          </TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">
          <div className="rounded-md border p-4">コンテンツ1</div>
        </TabsContent>
        <TabsContent value="tab2">
          <div className="rounded-md border p-4">コンテンツ2</div>
        </TabsContent>
      </Tabs>

      {/* 緑色のタブ */}
      <Tabs defaultValue="tab1" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2 bg-green-100">
          <TabsTrigger
            value="tab1"
            className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
          >
            タブ1
          </TabsTrigger>
          <TabsTrigger
            value="tab2"
            className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
          >
            タブ2
          </TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">
          <div className="rounded-md border p-4">コンテンツ1</div>
        </TabsContent>
        <TabsContent value="tab2">
          <div className="rounded-md border p-4">コンテンツ2</div>
        </TabsContent>
      </Tabs>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'カスタムスタイルを適用したTabsの例です。className プロパティを使用して色やスタイルをカスタマイズしています。',
      },
    },
  },
};

/**
 * 実際のユースケースでのTabsの例です。
 */
export const UseCases: Story = {
  render: () => (
    <div className="space-y-8">
      {/* プロフィール設定の例 */}
      <div>
        <h4 className="text-sm font-medium mb-4">プロフィール設定</h4>
        <Tabs defaultValue="profile" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">プロフィール</TabsTrigger>
            <TabsTrigger value="preferences">設定</TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
            <div className="rounded-md border p-4 space-y-4">
              <div>
                <Label className="text-sm font-medium">名前</Label>
                <Input
                  type="text"
                  className="mt-1 block w-full rounded-md border p-2"
                  placeholder="山田 太郎"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">メールアドレス</Label>
                <Input
                  type="email"
                  className="mt-1 block w-full rounded-md border p-2"
                  placeholder="yamada@example.com"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">自己紹介</Label>
                <Textarea
                  className="mt-1 block w-full rounded-md border p-2"
                  rows={3}
                  placeholder="自己紹介を入力してください"
                />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="preferences">
            <div className="rounded-md border p-4 space-y-4">
              <div>
                <Label className="text-sm font-medium">言語</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="言語を選択してください" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ja">日本語</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium">タイムゾーン</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="タイムゾーンを選択してください" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Asia/Tokyo">
                      Asia/Tokyo (GMT+9)
                    </SelectItem>
                    <SelectItem value="UTC">UTC (GMT+0)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium">テーマ</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="テーマを選択してください" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">ライト</SelectItem>
                    <SelectItem value="dark">ダーク</SelectItem>
                    <SelectItem value="system">システム</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* 商品詳細の例 */}
      <div>
        <h4 className="text-sm font-medium mb-4">商品詳細</h4>
        <Tabs defaultValue="description" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">商品説明</TabsTrigger>
            <TabsTrigger value="specs">仕様</TabsTrigger>
            <TabsTrigger value="reviews">レビュー</TabsTrigger>
          </TabsList>
          <TabsContent value="description">
            <div className="rounded-md border p-4">
              <h3 className="text-lg font-medium mb-2">商品説明</h3>
              <p className="text-sm text-muted-foreground">
                この商品は高品質な素材を使用し、耐久性と使いやすさを重視して設計されています。
                日常的な使用に最適で、長期間の使用にも耐えられます。
              </p>
            </div>
          </TabsContent>
          <TabsContent value="specs">
            <div className="rounded-md border p-4">
              <h3 className="text-lg font-medium mb-2">商品仕様</h3>
              <dl className="space-y-2">
                <div>
                  <dt className="font-medium">サイズ</dt>
                  <dd className="text-sm text-muted-foreground">
                    W100 × D50 × H30 cm
                  </dd>
                </div>
                <div>
                  <dt className="font-medium">重量</dt>
                  <dd className="text-sm text-muted-foreground">2.5 kg</dd>
                </div>
                <div>
                  <dt className="font-medium">素材</dt>
                  <dd className="text-sm text-muted-foreground">高級木材</dd>
                </div>
              </dl>
            </div>
          </TabsContent>
          <TabsContent value="reviews">
            <div className="rounded-md border p-4">
              <h3 className="text-lg font-medium mb-2">レビュー</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">山田 太郎</span>
                    <span className="text-sm text-muted-foreground">
                      2024-03-15
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    商品の品質が高く、期待通りの商品でした。
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">鈴木 花子</span>
                    <span className="text-sm text-muted-foreground">
                      2024-03-10
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    デザインが美しく、使いやすい商品です。
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '実際のユースケースでのTabsの例です。プロフィール設定と商品詳細の例を示しています。',
      },
    },
  },
};
