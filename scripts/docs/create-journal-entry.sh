#!/bin/bash
# ジャーナルエントリーを作成するためのシェルスクリプト
# AI支援によるタイトル生成機能を使用します
set -e

# 色の設定
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# バナー表示
echo -e "${BLUE}===================================================${NC}"
echo -e "${GREEN}     ジャーナルエントリー作成ツール${NC}"
echo -e "${BLUE}===================================================${NC}"
echo ""

# 引数の解析
ARGS=""
DATE_ARG=""
CONTENT_ARG=""
CONTENT_FILE_ARG=""
DEBUG_ARG=""

while [[ $# -gt 0 ]]; do
  case $1 in
    --date)
      DATE_ARG="--date $2"
      ARGS="${ARGS} --date $2"
      shift 2
      ;;
    --content)
      CONTENT_ARG="--content $2"
      ARGS="${ARGS} --content \"$2\""
      shift 2
      ;;
    --content-file)
      CONTENT_FILE_ARG="--content-file $2"
      ARGS="${ARGS} --content-file $2"
      shift 2
      ;;
    --debug)
      DEBUG_ARG="--debug"
      ARGS="${ARGS} --debug"
      shift
      ;;
    -h|--help)
      ARGS="--help"
      shift
      ;;
    *)
      echo -e "${RED}未知のオプション: $1${NC}"
      exit 1
      ;;
  esac
done

# Gemini APIキーの確認
if [ -z "${GEMINI_API_KEY}" ]; then
  if [ -f "${PWD}/apps/docs/.env.local" ]; then
    echo -e "${YELLOW}環境変数からGEMINI_API_KEYが見つかりません。.env.localファイルを使用します...${NC}"
    export $(grep -v '^#' "${PWD}/apps/docs/.env.local" | xargs)
  else
    echo -e "${YELLOW}警告: GEMINI_API_KEYが設定されていません。タイトル生成機能が動作しない可能性があります。${NC}"
    echo -e "次のいずれかの方法でAPIキーを設定してください:"
    echo -e "1. 環境変数を設定: export GEMINI_API_KEY=your-api-key"
    echo -e "2. apps/docs/.env.localファイルに追加: GEMINI_API_KEY=your-api-key"
    
    # 続行確認
    read -p "APIキーなしで続行しますか? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
      exit 1
    fi
  fi
fi

# プロジェクトルートでスクリプトが実行されているか確認
if [ ! -d "./apps/docs" ]; then
  echo -e "${RED}エラー: このスクリプトはプロジェクトルートディレクトリから実行する必要があります${NC}"
  exit 1
fi

echo -e "${GREEN}ジャーナルエントリー作成を開始します...${NC}"

# スクリプト実行
cd ./apps/docs
if [ -n "$ARGS" ]; then
  echo -e "${BLUE}実行コマンド: bun run create:journal:entry${NC} ${ARGS}"
  eval "bun run create:journal:entry ${ARGS}"
else
  echo -e "${BLUE}実行コマンド: bun run create:journal:entry${NC}"
  bun run create:journal:entry
fi

# 実行結果の確認
if [ $? -eq 0 ]; then
  echo -e "${GREEN}ジャーナルエントリーの作成が完了しました！${NC}"
else
  echo -e "${RED}ジャーナルエントリーの作成中にエラーが発生しました${NC}"
  exit 1
fi

echo -e "${BLUE}===================================================${NC}"
echo -e "${GREEN}処理が完了しました${NC}"
echo -e "${BLUE}===================================================${NC}" 