import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '../button';
import { DataTable } from './index';
import { DataTableColumnHeader } from './column-header';

/**
 * `DataTable`コンポーネントは、データの表示、ソート、フィルタリング、ページネーションなどの機能を提供する高度なテーブルコンポーネントです。
 *
 * ## 特徴
 * - ソート機能
 * - フィルタリング機能
 * - 検索機能
 * - ページネーション
 * - 行の選択
 * - カラムの表示/非表示
 * - 行の編集/削除
 *
 * ## 使用例
 * ```tsx
 * import { DataTable } from "@/components/ui/data-table";
 * import { columns } from "./columns";
 *
 * export default function Page() {
 *   const data = [
 *     {
 *       id: 1,
 *       name: "Example",
 *       status: "active"
 *     }
 *   ];
 *
 *   return (
 *     <DataTable
 *       columns={columns}
 *       data={data}
 *       searchableColumns={[
 *         {
 *           id: "name",
 *           title: "名前"
 *         }
 *       ]}
 *       filterableColumns={[
 *         {
 *           id: "status",
 *           title: "ステータス",
 *           options: [
 *             { label: "有効", value: "active" },
 *             { label: "無効", value: "inactive" }
 *           ]
 *         }
 *       ]}
 *     />
 *   );
 * }
 * ```
 *
 * ## アクセシビリティ
 * - キーボードナビゲーション対応
 * - スクリーンリーダー対応
 * - 適切なARIAラベル
 */
const meta = {
  title: 'Shadcn/DataTable',
  component: DataTable,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'DataTableコンポーネントは、データの表示、ソート、フィルタリング、ページネーションなどの機能を提供する高度なテーブルコンポーネントです。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    columns: {
      description: 'テーブルのカラム定義',
      control: {
        type: null,
      },
    },
    data: {
      description: 'テーブルのデータ配列',
      control: {
        type: null,
      },
    },
    filterableColumns: {
      description: 'フィルター可能なカラムの設定',
      control: {
        type: null,
      },
    },
    searchableColumns: {
      description: '検索可能なカラムの設定',
      control: {
        type: null,
      },
    },
    deleteRow: {
      description: '行の削除処理',
      control: {
        type: null,
      },
    },
    editRow: {
      description: '行の編集処理',
      control: {
        type: null,
      },
    },
    create: {
      description: '新規作成ボタンの設定',
      control: {
        type: null,
      },
    },
  },
} as Meta<typeof DataTable>;

export default meta;
type Story = StoryObj<typeof meta>;

// サンプルデータ
type User = {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  role: 'admin' | 'user' | 'guest';
  lastLogin: string;
};

const users: User[] = [
  {
    id: '1',
    name: '山田太郎',
    email: 'taro.yamada@example.com',
    status: 'active',
    role: 'admin',
    lastLogin: '2023-12-01',
  },
  {
    id: '2',
    name: '佐藤花子',
    email: 'hanako.sato@example.com',
    status: 'active',
    role: 'user',
    lastLogin: '2023-12-05',
  },
  {
    id: '3',
    name: '鈴木一郎',
    email: 'ichiro.suzuki@example.com',
    status: 'inactive',
    role: 'user',
    lastLogin: '2023-11-20',
  },
  {
    id: '4',
    name: '田中美咲',
    email: 'misaki.tanaka@example.com',
    status: 'active',
    role: 'guest',
    lastLogin: '2023-12-10',
  },
  {
    id: '5',
    name: '伊藤健太',
    email: 'kenta.ito@example.com',
    status: 'inactive',
    role: 'user',
    lastLogin: '2023-11-15',
  },
  {
    id: '6',
    name: '渡辺直樹',
    email: 'naoki.watanabe@example.com',
    status: 'active',
    role: 'admin',
    lastLogin: '2023-12-08',
  },
  {
    id: '7',
    name: '小林さくら',
    email: 'sakura.kobayashi@example.com',
    status: 'active',
    role: 'user',
    lastLogin: '2023-12-07',
  },
  {
    id: '8',
    name: '加藤雄太',
    email: 'yuta.kato@example.com',
    status: 'inactive',
    role: 'guest',
    lastLogin: '2023-11-25',
  },
  {
    id: '9',
    name: '松本恵子',
    email: 'keiko.matsumoto@example.com',
    status: 'active',
    role: 'user',
    lastLogin: '2023-12-03',
  },
  {
    id: '10',
    name: '井上大輔',
    email: 'daisuke.inoue@example.com',
    status: 'active',
    role: 'admin',
    lastLogin: '2023-12-09',
  },
  {
    id: '11',
    name: '木村真理子',
    email: 'mariko.kimura@example.com',
    status: 'inactive',
    role: 'user',
    lastLogin: '2023-11-18',
  },
  {
    id: '12',
    name: '高橋誠',
    email: 'makoto.takahashi@example.com',
    status: 'active',
    role: 'user',
    lastLogin: '2023-12-06',
  },
];

// カラム定義
const columns = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="名前" />
    ),
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="メールアドレス" />
    ),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ステータス" />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <div className="flex items-center">
          <span
            className={`mr-2 h-2 w-2 rounded-full ${
              status === 'active' ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
          {status === 'active' ? '有効' : '無効'}
        </div>
      );
    },
  },
  {
    accessorKey: 'role',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="役割" />
    ),
    cell: ({ row }) => {
      const role = row.getValue('role') as string;
      const roleMap = {
        admin: '管理者',
        user: 'ユーザー',
        guest: 'ゲスト',
      };
      return roleMap[role as keyof typeof roleMap] || role;
    },
  },
  {
    accessorKey: 'lastLogin',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="最終ログイン" />
    ),
  },
];

/**
 * 基本的なDataTableの例です。
 * シンプルなデータ表示とページネーションを提供します。
 */
export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '基本的なDataTableの例です。シンプルなデータ表示とページネーションを提供します。',
      },
    },
  },
  render: () => (
    <div className="w-[800px]">
      <DataTable columns={columns} data={users} />
    </div>
  ),
};

/**
 * 検索機能を持つDataTableの例です。
 * 名前とメールアドレスで検索できます。
 */
export const WithSearch: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '検索機能を持つDataTableの例です。名前とメールアドレスで検索できます。',
      },
    },
  },
  render: () => (
    <div className="w-[800px]">
      <DataTable
        columns={columns}
        data={users}
        searchableColumns={[
          {
            id: 'name',
            title: '名前',
          },
          {
            id: 'email',
            title: 'メールアドレス',
          },
        ]}
      />
    </div>
  ),
};

/**
 * フィルター機能を持つDataTableの例です。
 * ステータスと役割でフィルタリングできます。
 */
export const WithFilters: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'フィルター機能を持つDataTableの例です。ステータスと役割でフィルタリングできます。',
      },
    },
  },
  render: () => (
    <div className="w-[800px]">
      <DataTable
        columns={columns}
        data={users}
        filterableColumns={[
          {
            id: 'status',
            title: 'ステータス',
            options: [
              { label: '有効', value: 'active' },
              { label: '無効', value: 'inactive' },
            ],
          },
          {
            id: 'role',
            title: '役割',
            options: [
              { label: '管理者', value: 'admin' },
              { label: 'ユーザー', value: 'user' },
              { label: 'ゲスト', value: 'guest' },
            ],
          },
        ]}
      />
    </div>
  ),
};

/**
 * 編集・削除機能を持つDataTableの例です。
 * 行の編集と削除が可能です。
 */
export const WithActions: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '編集・削除機能を持つDataTableの例です。行の編集と削除が可能です。',
      },
    },
  },
  render: () => {
    const [tableData, setTableData] = useState(users);

    const handleEdit = async (user: User) => {
      console.log('Edit user:', user);
      // 実際のアプリケーションでは、ここで編集ダイアログを表示するなどの処理を行います
      return Promise.resolve();
    };

    const handleDelete = async (user: User) => {
      console.log('Delete user:', user);
      setTableData(tableData.filter((item) => item.id !== user.id));
      return Promise.resolve();
    };

    return (
      <div className="w-[800px]">
        <DataTable
          columns={columns}
          data={tableData}
          editRow={handleEdit}
          deleteRow={handleDelete}
        />
      </div>
    );
  },
};

/**
 * 新規作成ボタンを持つDataTableの例です。
 * 新しいユーザーを追加するためのボタンが表示されます。
 */
export const WithCreateButton: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '新規作成ボタンを持つDataTableの例です。新しいユーザーを追加するためのボタンが表示されます。',
      },
    },
  },
  render: () => {
    const handleCreate = () => {
      console.log('Create new user');
      // 実際のアプリケーションでは、ここで作成ダイアログを表示するなどの処理を行います
    };

    return (
      <div className="w-[800px]">
        <DataTable
          columns={columns}
          data={users}
          create={{
            content: (
              <Button
                variant="outline"
                size="sm"
                className="h-8"
                onClick={handleCreate}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                新規ユーザー
              </Button>
            ),
          }}
        />
      </div>
    );
  },
};

/**
 * 全機能を持つDataTableの例です。
 * 検索、フィルター、編集・削除、新規作成の全ての機能を備えています。
 */
export const FullFeatured: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '全機能を持つDataTableの例です。検索、フィルター、編集・削除、新規作成の全ての機能を備えています。',
      },
    },
  },
  render: () => {
    const [tableData, setTableData] = useState(users);

    const handleEdit = async (user: User) => {
      console.log('Edit user:', user);
      return Promise.resolve();
    };

    const handleDelete = async (user: User) => {
      console.log('Delete user:', user);
      setTableData(tableData.filter((item) => item.id !== user.id));
      return Promise.resolve();
    };

    const handleCreate = () => {
      console.log('Create new user');
    };

    return (
      <div className="w-[800px]">
        <DataTable
          columns={columns}
          data={tableData}
          searchableColumns={[
            {
              id: 'name',
              title: '名前',
            },
            {
              id: 'email',
              title: 'メールアドレス',
            },
          ]}
          filterableColumns={[
            {
              id: 'status',
              title: 'ステータス',
              options: [
                { label: '有効', value: 'active' },
                { label: '無効', value: 'inactive' },
              ],
            },
            {
              id: 'role',
              title: '役割',
              options: [
                { label: '管理者', value: 'admin' },
                { label: 'ユーザー', value: 'user' },
                { label: 'ゲスト', value: 'guest' },
              ],
            },
          ]}
          editRow={handleEdit}
          deleteRow={handleDelete}
          create={{
            content: (
              <Button
                variant="outline"
                size="sm"
                className="h-8"
                onClick={handleCreate}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                新規ユーザー
              </Button>
            ),
          }}
        />
      </div>
    );
  },
};

/**
 * カスタムスタイルを適用したDataTableの例です。
 * テーブルのスタイルをカスタマイズしています。
 */
export const CustomStyling: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'カスタムスタイルを適用したDataTableの例です。テーブルのスタイルをカスタマイズしています。',
      },
    },
  },
  render: () => (
    <div className="w-[800px] rounded-lg border border-primary/20 p-4 shadow-md">
      <h2 className="mb-4 text-xl font-bold text-primary">ユーザー管理</h2>
      <DataTable
        columns={columns}
        data={users.slice(0, 5)}
        searchableColumns={[
          {
            id: 'name',
            title: '名前',
          },
        ]}
      />
    </div>
  ),
};
