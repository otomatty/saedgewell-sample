# Docs アプリケーション用 Dockerfile
FROM oven/bun:1 AS base

# ベースイメージの設定
WORKDIR /app

# 依存関係のファイルをコピー
COPY package.json bun.lock tsconfig.json ./

# アプリケーションディレクトリの作成とpackage.jsonのコピー
RUN mkdir -p apps/docs apps/web apps/admin
COPY apps/docs/package.json ./apps/docs/
COPY apps/web/package.json ./apps/web/
COPY apps/admin/package.json ./apps/admin/

# 共有パッケージのコピー
COPY packages ./packages/
COPY tooling ./tooling/

# 依存関係をインストールする前にpreinstallスクリプトをスキップ
ENV BUN_INSTALL_SKIP_PREINSTALL=true

# 依存関係をインストール
RUN bun install

# 全てのソースコードをコピー
COPY . .

# 開発モードでの起動
ENV PORT=7511
EXPOSE 7511

CMD ["bun", "run", "dev:docs"] 