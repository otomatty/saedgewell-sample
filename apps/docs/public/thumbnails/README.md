# サムネイル画像について

このディレクトリには、ドキュメントやWikiのサムネイル画像を配置します。

## サムネイル画像の指定方法

サムネイル画像は以下の優先順位で表示されます：

1. **OGP画像**: WebサイトのURLを指定すると、そのサイトのOGP画像が自動的に取得されます
2. **Gyazo画像**: Gyazoの画像URLを指定すると、最適化された状態で表示されます
3. **ローカル画像**: このディレクトリに配置した画像を相対パスで指定できます
4. **外部画像**: 任意の画像URLを指定すると、プロキシを通して表示されます
5. **デフォルト画像**: 画像が指定されていない場合は、デフォルト画像が表示されます

## 使用例

`index.json` ファイルの `thumbnail` フィールドに以下のように指定します：

```json
{
  "title": "React",
  "description": "ユーザーインターフェースを構築するためのJavaScriptライブラリ",
  "thumbnail": "https://react.dev",
  "category": "document"
}
```

または、Gyazo画像を使用する場合：

```json
{
  "title": "Next.js",
  "description": "Reactフレームワーク",
  "thumbnail": "https://gyazo.com/xxxxxxxxxxxxxxxxxxxxx",
  "category": "document"
}
```

ローカル画像を使用する場合：

```json
{
  "title": "TypeScript",
  "description": "JavaScriptに型を追加した言語",
  "thumbnail": "/thumbnails/typescript.png",
  "category": "document"
}
```

外部画像を使用する場合：

```json
{
  "title": "GitHub",
  "description": "ソースコード管理プラットフォーム",
  "thumbnail": "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
  "category": "document"
}
```

## 画像サイズの最適化

サムネイル画像は自動的に最適化されます：

- **OGP画像**: WebサイトのURLを指定すると、OGP画像が自動的に取得されます
- **Gyazo画像**: 適切なサイズに最適化されます（`w=1200` パラメータが追加されます）
- **遅延読み込み**: 画面に表示される直前に読み込まれます
- **ぼかしプレースホルダー**: 画像の読み込み中にプレースホルダーが表示されます
- **推奨フォーマット**: WebP形式の画像を使用することをお勧めします（ファイルサイズが小さく、高品質）

## 注意事項

- 画像は16:9のアスペクト比で表示されます
- 画像は `object-fit: contain` で表示されるため、画像全体が表示されます
- 画像が指定されていない場合は、デフォルト画像が表示されます

## 画像表示方法

サムネイル画像は以下の方法で表示されます：

- `object-fit: contain`を使用して、画像の縦横比を維持したまま表示エリア内に収まるように表示
- 画像の周囲に余白（padding）を追加して、画像が表示エリアの端に接触しないようにしています
- 背景色は薄いグレーに設定されています

## 画像サイズの最適化

サムネイル画像は自動的に最適化されます：

- Gyazo画像は自動的にリサイズされます（幅1200pxに設定）
- 画像は遅延読み込み（lazy loading）されます
- 画像の読み込み中はぼかし効果のあるプレースホルダーが表示されます
- 画像品質は80%に設定されています（高品質でありながらファイルサイズを削減）

## 注意事項

- 画像ファイルは、PNG、JPG、JPEG、WebP形式を推奨します
- 画像サイズは適切に最適化してください（推奨: 幅1200px以下）
- アスペクト比は16:9を推奨します（DocTypeGridコンポーネントでは`aspect-video`を使用）
- 大きな画像ファイルはパフォーマンスに影響するため、事前に最適化することをお勧めします 