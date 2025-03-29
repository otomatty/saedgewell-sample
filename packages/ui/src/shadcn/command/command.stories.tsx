import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { useState } from 'react';
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
  Mail,
  MessageSquare,
  PlusCircle,
  Github,
  LifeBuoy,
  Cloud,
  LogOut,
} from 'lucide-react';

import { Button } from '../button';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from './index';

/**
 * `Command`コンポーネントは、キーボードでナビゲーション可能なコマンドメニューを提供します。
 *
 * ## 特徴
 * - キーボードナビゲーション
 * - 検索機能
 * - グループ化
 * - ショートカットの表示
 * - ダイアログ表示
 *
 * ## 使用例
 * ```tsx
 * <Command>
 *   <CommandInput placeholder="コマンドを検索..." />
 *   <CommandList>
 *     <CommandEmpty>結果が見つかりません</CommandEmpty>
 *     <CommandGroup heading="提案">
 *       <CommandItem>
 *         <Calendar className="mr-2 h-4 w-4" />
 *         <span>カレンダー</span>
 *       </CommandItem>
 *       <CommandItem>
 *         <Smile className="mr-2 h-4 w-4" />
 *         <span>絵文字</span>
 *       </CommandItem>
 *     </CommandGroup>
 *   </CommandList>
 * </Command>
 * ```
 *
 * ## アクセシビリティ
 * - キーボードナビゲーション対応
 * - スクリーンリーダー対応
 * - WAI-ARIA準拠
 */
const meta = {
  title: 'Shadcn/Command',
  component: Command,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Commandコンポーネントは、キーボードでナビゲーション可能なコマンドメニューを提供します。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      description: 'Commandの子要素',
      control: {
        type: null,
      },
    },
  },
} as Meta<typeof Command>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 基本的なCommandの例です。
 * シンプルな検索と結果表示を提供します。
 */
export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '基本的なCommandの例です。シンプルな検索と結果表示を提供します。',
      },
    },
  },
  render: () => (
    <div className="w-[400px] border rounded-md">
      <Command>
        <CommandInput placeholder="コマンドを検索..." />
        <CommandList>
          <CommandEmpty>結果が見つかりません</CommandEmpty>
          <CommandGroup heading="提案">
            <CommandItem>
              <Calendar className="mr-2 h-4 w-4" />
              <span>カレンダー</span>
            </CommandItem>
            <CommandItem>
              <Smile className="mr-2 h-4 w-4" />
              <span>絵文字</span>
            </CommandItem>
            <CommandItem>
              <Calculator className="mr-2 h-4 w-4" />
              <span>計算機</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  ),
};

/**
 * グループ化されたCommandの例です。
 * 複数のカテゴリに分けて項目を表示します。
 */
export const WithGroups: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'グループ化されたCommandの例です。複数のカテゴリに分けて項目を表示します。',
      },
    },
  },
  render: () => (
    <div className="w-[400px] border rounded-md">
      <Command>
        <CommandInput placeholder="コマンドを検索..." />
        <CommandList>
          <CommandEmpty>結果が見つかりません</CommandEmpty>
          <CommandGroup heading="提案">
            <CommandItem>
              <Calendar className="mr-2 h-4 w-4" />
              <span>カレンダー</span>
            </CommandItem>
            <CommandItem>
              <Smile className="mr-2 h-4 w-4" />
              <span>絵文字</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="設定">
            <CommandItem>
              <User className="mr-2 h-4 w-4" />
              <span>プロフィール</span>
            </CommandItem>
            <CommandItem>
              <CreditCard className="mr-2 h-4 w-4" />
              <span>お支払い</span>
            </CommandItem>
            <CommandItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>設定</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  ),
};

/**
 * ショートカットを表示するCommandの例です。
 * 各項目にキーボードショートカットを表示します。
 */
export const WithShortcuts: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'ショートカットを表示するCommandの例です。各項目にキーボードショートカットを表示します。',
      },
    },
  },
  render: () => (
    <div className="w-[400px] border rounded-md">
      <Command>
        <CommandInput placeholder="コマンドを検索..." />
        <CommandList>
          <CommandEmpty>結果が見つかりません</CommandEmpty>
          <CommandGroup heading="提案">
            <CommandItem>
              <Calendar className="mr-2 h-4 w-4" />
              <span>カレンダー</span>
              <CommandShortcut>⌘C</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <Smile className="mr-2 h-4 w-4" />
              <span>絵文字</span>
              <CommandShortcut>⌘E</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <Calculator className="mr-2 h-4 w-4" />
              <span>計算機</span>
              <CommandShortcut>⌘K</CommandShortcut>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="設定">
            <CommandItem>
              <User className="mr-2 h-4 w-4" />
              <span>プロフィール</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>設定</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  ),
};

/**
 * 検索機能を持つCommandの例です。
 * 実際に検索結果をフィルタリングします。
 */
export const WithSearch: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '検索機能を持つCommandの例です。実際に検索結果をフィルタリングします。',
      },
    },
  },
  render: () => {
    const [search, setSearch] = useState('');

    const items = [
      {
        icon: <Calendar className="h-4 w-4" />,
        label: 'カレンダー',
        shortcut: '⌘C',
        group: 'アプリ',
      },
      {
        icon: <Smile className="h-4 w-4" />,
        label: '絵文字',
        shortcut: '⌘E',
        group: 'アプリ',
      },
      {
        icon: <Calculator className="h-4 w-4" />,
        label: '計算機',
        shortcut: '⌘K',
        group: 'アプリ',
      },
      {
        icon: <User className="h-4 w-4" />,
        label: 'プロフィール',
        shortcut: '⌘P',
        group: 'アカウント',
      },
      {
        icon: <Settings className="h-4 w-4" />,
        label: '設定',
        shortcut: '⌘S',
        group: 'アカウント',
      },
      {
        icon: <Mail className="h-4 w-4" />,
        label: 'メール',
        shortcut: '⌘M',
        group: 'コミュニケーション',
      },
      {
        icon: <MessageSquare className="h-4 w-4" />,
        label: 'メッセージ',
        shortcut: '⌘N',
        group: 'コミュニケーション',
      },
    ];

    const filteredItems = items.filter((item) =>
      item.label.toLowerCase().includes(search.toLowerCase())
    );

    const groupedItems = filteredItems.reduce(
      (acc, item) => {
        if (!acc[item.group]) {
          acc[item.group] = [];
        }
        acc[item.group].push(item);
        return acc;
      },
      {} as Record<string, typeof items>
    );

    return (
      <div className="w-[400px] border rounded-md">
        <Command>
          <CommandInput
            placeholder="コマンドを検索..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            {filteredItems.length === 0 && (
              <CommandEmpty>結果が見つかりません</CommandEmpty>
            )}
            {Object.entries(groupedItems).map(([group, items]) => (
              <React.Fragment key={group}>
                <CommandGroup heading={group}>
                  {items.map((item) => (
                    <CommandItem key={item.label}>
                      {item.icon}
                      <span className="ml-2">{item.label}</span>
                      {item.shortcut && (
                        <CommandShortcut>{item.shortcut}</CommandShortcut>
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
                {group !== Object.keys(groupedItems).pop() && (
                  <CommandSeparator />
                )}
              </React.Fragment>
            ))}
          </CommandList>
        </Command>
      </div>
    );
  },
};

/**
 * ダイアログとして表示するCommandの例です。
 * ボタンクリックでコマンドパレットを表示します。
 */
export const AsDialog: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'ダイアログとして表示するCommandの例です。ボタンクリックでコマンドパレットを表示します。',
      },
    },
  },
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button
          onClick={() => setOpen(true)}
          variant="outline"
          className="w-[200px]"
        >
          コマンドパレットを開く
        </Button>
        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="コマンドを検索..." />
          <CommandList>
            <CommandEmpty>結果が見つかりません</CommandEmpty>
            <CommandGroup heading="提案">
              <CommandItem>
                <Calendar className="mr-2 h-4 w-4" />
                <span>カレンダー</span>
              </CommandItem>
              <CommandItem>
                <Smile className="mr-2 h-4 w-4" />
                <span>絵文字</span>
              </CommandItem>
              <CommandItem>
                <Calculator className="mr-2 h-4 w-4" />
                <span>計算機</span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="設定">
              <CommandItem>
                <User className="mr-2 h-4 w-4" />
                <span>プロフィール</span>
                <CommandShortcut>⌘P</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>設定</span>
                <CommandShortcut>⌘S</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </>
    );
  },
};

/**
 * アプリケーションメニューの例です。
 * より実践的なコマンドメニューの使用例を示します。
 */
export const ApplicationMenu: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'アプリケーションメニューの例です。より実践的なコマンドメニューの使用例を示します。',
      },
    },
  },
  render: () => (
    <div className="w-[400px] border rounded-md">
      <Command>
        <CommandInput placeholder="検索..." />
        <CommandList>
          <CommandEmpty>結果が見つかりません</CommandEmpty>
          <CommandGroup heading="リンク">
            <CommandItem>
              <Mail className="mr-2 h-4 w-4" />
              <span>受信トレイ</span>
              <CommandShortcut>⌘I</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <MessageSquare className="mr-2 h-4 w-4" />
              <span>メッセージ</span>
              <CommandShortcut>⌘M</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <PlusCircle className="mr-2 h-4 w-4" />
              <span>新規作成</span>
              <CommandShortcut>⌘N</CommandShortcut>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="ツール">
            <CommandItem>
              <Github className="mr-2 h-4 w-4" />
              <span>GitHub</span>
            </CommandItem>
            <CommandItem>
              <LifeBuoy className="mr-2 h-4 w-4" />
              <span>サポート</span>
            </CommandItem>
            <CommandItem>
              <Cloud className="mr-2 h-4 w-4" />
              <span>API</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="設定">
            <CommandItem>
              <User className="mr-2 h-4 w-4" />
              <span>プロフィール</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>設定</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandItem className="text-red-500">
            <LogOut className="mr-2 h-4 w-4" />
            <span>ログアウト</span>
            <CommandShortcut>⌘Q</CommandShortcut>
          </CommandItem>
        </CommandList>
      </Command>
    </div>
  ),
};
