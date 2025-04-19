# ベースイメージ用の共有Dockerfile
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

# キャッシュディレクトリを作成
RUN mkdir -p /app/.turbo /app/.bun-cache

# 依存関係をインストール
RUN bun install

# ビルドキャッシュとして使用するためのレイヤー
FROM base AS deps

# ビルド用ステージ（本番環境用）
FROM base AS builder
COPY . .
# ビルドコマンドはアプリケーション固有のDockerfileで上書き

# システム依存パッケージのインストール
RUN apt-get update && apt-get install -y \
    git \
    curl \
    python3 \
    make \
    g++ \
    libc6-compat \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# 環境変数の設定
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1
ENV TURBO_TEAM=local
ENV TURBO_REMOTE_ONLY=false
  
# Bunの挙動検証
RUN echo 'console.log("Docker+Bun test")' > test.js && \
    bun build test.js --outdir ./dist && \
    cat ./dist/test.js

# 共通ボリュームのマウントポイント
VOLUME [ "/app/.turbo", "/app/.bun-cache" ] 