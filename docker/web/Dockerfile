# Web アプリケーション用 Dockerfile
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
# Supabaseのpostinstallをスキップするための環境変数を追加
ENV SUPABASE_INSTALL_SKIP_POSTINSTALL=true
ENV SKIP_SUPABASE_SETUP=true

# Chromium とその依存関係をインストール
RUN apt-get update && apt-get install -y --no-install-recommends \
    chromium \
    libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libasound2 \
    && rm -rf /var/lib/apt/lists/*

# 依存関係をインストール
RUN bun install --no-optional

# 全てのソースコードをコピー
COPY . .

# 開発モードでの起動
ENV PORT=7510
EXPOSE 7510

CMD ["bun", "run", "dev:web", "--no-turbo"] 