import type { Meta, StoryObj } from '@storybook/react';
import { Home, Settings, User, Mail, Bell } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from './index';

/**
 * `Sidebar`コンポーネントは、アプリケーションのナビゲーションとコンテンツ構造を提供する
 * レスポンシブ対応のサイドバーコンポーネントです。
 *
 * ## 特徴
 * - レスポンシブ対応（モバイル時はドロワーメニューに変化）
 * - 折りたたみ可能（offcanvas, icon, noneの3モード）
 * - キーボードショートカット対応（Cmd/Ctrl + B）
 * - アクセシビリティ対応
 * - カスタマイズ可能なスタイリング
 *
 * ## 使用方法
 * ```tsx
 * <SidebarProvider>
 *   <Sidebar>
 *     <SidebarHeader>...</SidebarHeader>
 *     <SidebarContent>...</SidebarContent>
 *     <SidebarFooter>...</SidebarFooter>
 *   </Sidebar>
 * </SidebarProvider>
 * ```
 */
const meta = {
  title: 'Shadcn/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'サイドバーコンポーネントは、アプリケーションのナビゲーションを提供する主要なUIコンポーネントです。',
      },
    },
  },
  decorators: [
    (Story) => (
      <SidebarProvider>
        <Story />
      </SidebarProvider>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 基本的なサイドバーの実装例です。
 * ヘッダー、コンテンツ、フッターを含む標準的な構成を示しています。
 */
export const Basic: Story = {
  render: () => (
    <div className="flex h-screen">
      <Sidebar>
        <SidebarHeader>
          <h2 className="px-2 text-lg font-semibold">アプリケーション</h2>
          <SidebarTrigger className="absolute right-2 top-2" />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>メインメニュー</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="ホーム">
                  <Home />
                  <span>ホーム</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <User />
                  <span>プロフィール</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Mail />
                  <span>メッセージ</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
          <SidebarSeparator />
          <SidebarGroup>
            <SidebarGroupLabel>設定</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Settings />
                  <span>設定</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Bell />
                  <span>通知</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <div className="px-2 py-4 text-sm text-muted-foreground">
            Version 1.0.0
          </div>
        </SidebarFooter>
      </Sidebar>
      <main className="flex-1 p-4">
        <h1 className="text-2xl font-bold">メインコンテンツ</h1>
        <p className="mt-4">
          サイドバーの動作を確認するには、サイドバーの開閉ボタンをクリックするか、
          Cmd/Ctrl + B を押してください。
        </p>
      </main>
    </div>
  ),
};

/**
 * フローティングスタイルのサイドバーの例です。
 * メインコンテンツから浮き上がったような表示になります。
 */
export const Floating: Story = {
  render: () => (
    <div className="flex h-screen bg-slate-100">
      <Sidebar variant="floating">
        <SidebarHeader>
          <h2 className="px-2 text-lg font-semibold">フローティング</h2>
          <SidebarTrigger className="absolute right-2 top-2" />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive>
                  <Home />
                  <span>ホーム</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Settings />
                  <span>設定</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <main className="flex-1 p-4">
        <h1 className="text-2xl font-bold">フローティングスタイル</h1>
      </main>
    </div>
  ),
};

/**
 * アイコンモードでの折りたたみ表示の例です。
 * 折りたたまれた状態でもアイコンが表示され、ホバーでツールチップが表示されます。
 */
export const IconCollapsible: Story = {
  render: () => (
    <div className="flex h-screen">
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <h2 className="px-2 text-lg font-semibold">アイコンモード</h2>
          <SidebarTrigger className="absolute right-2 top-2" />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="ホーム" isActive>
                  <Home />
                  <span>ホーム</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="設定">
                  <Settings />
                  <span>設定</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <main className="flex-1 p-4">
        <h1 className="text-2xl font-bold">アイコンモード</h1>
      </main>
    </div>
  ),
};

/**
 * 右側に配置されたサイドバーの例です。
 * レイアウトを反転させて表示します。
 */
export const RightSide: Story = {
  render: () => (
    <div className="flex h-screen">
      <main className="flex-1 p-4">
        <h1 className="text-2xl font-bold">右サイドバー</h1>
      </main>
      <Sidebar side="right">
        <SidebarHeader>
          <h2 className="px-2 text-lg font-semibold">右サイドバー</h2>
          <SidebarTrigger className="absolute left-2 top-2" />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Home />
                  <span>ホーム</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Settings />
                  <span>設定</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </div>
  ),
};
