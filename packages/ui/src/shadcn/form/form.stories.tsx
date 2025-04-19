import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '../button';
import { Checkbox } from '../checkbox';
import { Input } from '../input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../select';
import { Textarea } from '../textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './index';

/**
 * `Form`コンポーネントは、react-hook-formと統合されたフォームコンポーネントを提供します。
 *
 * ## 特徴
 * - react-hook-formとの統合
 * - バリデーション（zodなどと連携可能）
 * - アクセシビリティ対応
 * - エラーメッセージの表示
 *
 * ## 使用例
 * ```tsx
 * const formSchema = z.object({
 *   username: z.string().min(2).max(50),
 * });
 *
 * function ProfileForm() {
 *   const form = useForm<z.infer<typeof formSchema>>({
 *     resolver: zodResolver(formSchema),
 *     defaultValues: {
 *       username: "",
 *     },
 *   });
 *
 *   function onSubmit(values: z.infer<typeof formSchema>) {
 *     console.log(values);
 *   }
 *
 *   return (
 *     <Form {...form}>
 *       <form onSubmit={form.handleSubmit(onSubmit)}>
 *         <FormField
 *           control={form.control}
 *           name="username"
 *           render={({ field }) => (
 *             <FormItem>
 *               <FormLabel>ユーザー名</FormLabel>
 *               <FormControl>
 *                 <Input placeholder="ユーザー名" {...field} />
 *               </FormControl>
 *               <FormDescription>
 *                 これはあなたの公開ユーザー名です。
 *               </FormDescription>
 *               <FormMessage />
 *             </FormItem>
 *           )}
 *         />
 *         <Button type="submit">送信</Button>
 *       </form>
 *     </Form>
 *   );
 * }
 * ```
 *
 * ## アクセシビリティ
 * - WAI-ARIA準拠
 * - キーボードナビゲーション対応
 * - スクリーンリーダー対応
 */
const meta = {
  title: 'Shadcn/Form',
  component: Form,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Formコンポーネントは、react-hook-formと統合されたフォームコンポーネントを提供します。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      description: 'Formの子要素',
      control: false,
    },
  },
} as Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 基本的なフォームの例です。
 */
export const Basic: Story = {
  render: () => {
    // フォームのスキーマを定義
    const formSchema = z.object({
      username: z.string().min(2, {
        message: 'ユーザー名は2文字以上である必要があります。',
      }),
    });

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        username: '',
      },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
      // eslint-disable-next-line no-console
      console.log(values);
    }

    return (
      <div className="w-full max-w-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ユーザー名</FormLabel>
                  <FormControl>
                    <Input placeholder="ユーザー名" {...field} />
                  </FormControl>
                  <FormDescription>
                    これはあなたの公開ユーザー名です。
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">送信</Button>
          </form>
        </Form>
      </div>
    );
  },
};

/**
 * バリデーションを含むフォームの例です。
 */
export const WithValidation: Story = {
  render: () => {
    // フォームのスキーマを定義
    const formSchema = z
      .object({
        email: z.string().email({
          message: '有効なメールアドレスを入力してください。',
        }),
        password: z.string().min(8, {
          message: 'パスワードは8文字以上である必要があります。',
        }),
        confirmPassword: z.string(),
      })
      .refine((data) => data.password === data.confirmPassword, {
        message: 'パスワードが一致しません。',
        path: ['confirmPassword'],
      });

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        email: '',
        password: '',
        confirmPassword: '',
      },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
      // eslint-disable-next-line no-console
      console.log(values);
    }

    return (
      <div className="w-full max-w-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>メールアドレス</FormLabel>
                  <FormControl>
                    <Input placeholder="example@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>パスワード</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormDescription>
                    8文字以上の強力なパスワードを設定してください。
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>パスワード（確認）</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">アカウント作成</Button>
          </form>
        </Form>
      </div>
    );
  },
};

/**
 * 複数のフィールドタイプを含む複雑なフォームの例です。
 */
export const ComplexForm: Story = {
  render: () => {
    // フォームのスキーマを定義
    const formSchema = z.object({
      name: z.string().min(2, {
        message: '名前は2文字以上である必要があります。',
      }),
      email: z.string().email({
        message: '有効なメールアドレスを入力してください。',
      }),
      bio: z
        .string()
        .max(160, {
          message: '自己紹介は160文字以内である必要があります。',
        })
        .optional(),
      role: z.string({
        required_error: '役割を選択してください。',
      }),
      terms: z.boolean().refine((value) => value === true, {
        message: '利用規約に同意する必要があります。',
      }),
    });

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        name: '',
        email: '',
        bio: '',
        role: '',
        terms: false,
      },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
      // eslint-disable-next-line no-console
      console.log(values);
    }

    return (
      <div className="w-full max-w-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>名前</FormLabel>
                  <FormControl>
                    <Input placeholder="山田太郎" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>メールアドレス</FormLabel>
                  <FormControl>
                    <Input placeholder="example@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>自己紹介</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="あなた自身について教えてください..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    160文字以内で記入してください。
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>役割</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="役割を選択" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="admin">管理者</SelectItem>
                      <SelectItem value="user">一般ユーザー</SelectItem>
                      <SelectItem value="guest">ゲスト</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="terms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>利用規約</FormLabel>
                    <FormDescription>
                      当サービスの利用規約に同意します。
                    </FormDescription>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">登録</Button>
          </form>
        </Form>
      </div>
    );
  },
};

/**
 * カスタムスタイルを適用したフォームの例です。
 */
export const CustomStyling: Story = {
  render: () => {
    // フォームのスキーマを定義
    const formSchema = z.object({
      name: z.string().min(2, {
        message: '名前は2文字以上である必要があります。',
      }),
      email: z.string().email({
        message: '有効なメールアドレスを入力してください。',
      }),
    });

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        name: '',
        email: '',
      },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
      // eslint-disable-next-line no-console
      console.log(values);
    }

    return (
      <div className="w-full max-w-md p-6 rounded-lg bg-slate-900 text-white">
        <h2 className="text-xl font-bold mb-4 text-white">
          カスタムスタイルフォーム
        </h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">名前</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="山田太郎"
                      {...field}
                      className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">
                    メールアドレス
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="example@example.com"
                      {...field}
                      className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                    />
                  </FormControl>
                  <FormDescription className="text-slate-400">
                    業務連絡に使用するメールアドレスを入力してください。
                  </FormDescription>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 w-full"
            >
              送信
            </Button>
          </form>
        </Form>
      </div>
    );
  },
};

/**
 * フォームの状態を表示する例です。
 */
export const FormState: Story = {
  render: () => {
    // フォームのスキーマを定義
    const formSchema = z.object({
      name: z.string().min(2, {
        message: '名前は2文字以上である必要があります。',
      }),
    });

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        name: '',
      },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
      // eslint-disable-next-line no-console
      console.log(values);
    }

    return (
      <div className="w-full max-w-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>名前</FormLabel>
                  <FormControl>
                    <Input placeholder="山田太郎" {...field} />
                  </FormControl>
                  <FormDescription>
                    あなたの公開プロフィールに表示される名前です。
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">送信</Button>
          </form>
        </Form>

        <div className="mt-8 p-4 border rounded-md">
          <h3 className="font-medium mb-2">フォームの状態:</h3>
          <pre className="text-xs bg-slate-100 p-2 rounded overflow-auto">
            {JSON.stringify(
              {
                values: form.getValues(),
                errors: form.formState.errors,
                isDirty: form.formState.isDirty,
                isSubmitting: form.formState.isSubmitting,
                isValid: form.formState.isValid,
              },
              null,
              2
            )}
          </pre>
        </div>
      </div>
    );
  },
};
