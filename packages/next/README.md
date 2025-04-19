# Next.js ユーティリティ / @kit/next

このパッケージはNext.jsで使用するサーバーサイドのユーティリティ関数を提供します。

## サーバーアクション

`enhanceAction`関数を使用することで、Next.jsのサーバーアクションに追加機能を付与することができます。

```ts
import { enhanceAction } from '@kit/next/actions';

export const myServerAction = enhanceAction(async (data, user) => {
  // "data"はスキーマによって解析され、
  // スキーマの型として正しく型付けされます
  // 以下の例では、dataは{ id: number }型となります
  
  // "user"はセッションからのユーザーオブジェクトです
  
  // "captcha"がtrueの場合、アクションはキャプチャを必要とします
}, {
  captcha: true,
  schema: z.object({
    id: z.number()
  }),
});
```

`enhanceAction`関数は2つの引数を取ります：
1. アクション関数
2. オプションオブジェクト

オプションオブジェクトには以下のプロパティを含めることができます：
- `captcha` - trueの場合、アクションはbodyに`captchaToken`を必要とします
- `schema` - データの検証に使用されるzodスキーマ
- `captureException` - trueの場合、アクションは例外をキャプチャし、設定されたプロバイダーに報告します。デフォルトは`true`です

正常に呼び出された場合、アクションはアクション関数の結果を返します。

1. ユーザーは自動的に認証され、その結果がアクション関数の第2引数として渡されます
2. データはスキーマで解析/検証され、アクション関数の第1引数として渡されます
3. `captcha`オプションがtrueの場合、アクションはbodyに`captchaToken`が必要です

利用者は以下のようにアクションを呼び出すことができます：

```ts
import { myServerAction } from 'path/to/myServerAction';

const result = await myServerAction({ id: 1 });
```

または、オプションのキャプチャトークンを使用して：

```ts
import { myServerAction } from 'path/to/myServerAction';

const result = await myServerAction({ id: 1, captchaToken: 'captchaToken' });
```

## ルートハンドラー

`enhanceRouteHandler`関数を使用することで、Next.jsのAPIルートハンドラーに追加機能を付与することができます。

```ts
import { enhanceRouteHandler } from '@kit/next/routes';

export const POST = enhanceRouteHandler(({ request, body, user }) => {
  // "body"はスキーマによって解析され、
  // スキーマの型として正しく型付けされます
  // 以下の例では、dataは{ id: number }型となります

  // "user"はセッションからのユーザーオブジェクトです
  
  // "request"はPOSTによって渡される生のリクエストオブジェクトです
  // "captcha"がtrueの場合、アクションはキャプチャを必要とします
  // "captureException"がtrueの場合、アクションは例外をキャプチャし、設定されたプロバイダーに報告します
}, {
  captcha: true,
  captureException: true,
  schema: z.object({
    id: z.number()
  }),
});
```

キャプチャを使用する場合、利用者はヘッダー`x-captcha-token`にキャプチャトークンを渡します。