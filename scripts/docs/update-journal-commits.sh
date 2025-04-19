#!/bin/bash

# ジャーナルの更新スクリプト
# このスクリプトはGitHubからコミット情報を取得して、
# .docs/journals/ディレクトリの各日付フォルダのindex.jsonファイルを更新します。
# デフォルトでは今日の日付のコミット情報のみを取得します。

# 色付きの出力用の設定
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# プロジェクトルートディレクトリに移動
cd "$(dirname "$0")/../.." || exit 1

# スクリプトが存在するか確認
if [ ! -f "apps/docs/scripts/update-journal-commits.ts" ]; then
  echo -e "${RED}エラー: ジャーナル更新スクリプトが見つかりません${NC}"
  echo "expected: apps/docs/scripts/update-journal-commits.ts"
  exit 1
fi

# GitHub環境変数が設定されていることを確認
if [ -z "${GITHUB_TOKEN}" ]; then
  # PAT_FOR_PRIVATE_REPOSが設定されていれば、それをGITHUB_TOKENとして使用
  if [ -n "${PAT_FOR_PRIVATE_REPOS}" ]; then
    echo -e "${GREEN}PAT_FOR_PRIVATE_REPOSが設定されています。これをGITHUB_TOKENとして使用します${NC}"
    GITHUB_TOKEN="${PAT_FOR_PRIVATE_REPOS}"
    export GITHUB_TOKEN

    # デバッグ用にマスク表示
    if [ ${#GITHUB_TOKEN} -gt 8 ]; then
      MASKED_TOKEN="${GITHUB_TOKEN:0:4}...${GITHUB_TOKEN: -4}"
      echo -e "${GREEN}トークン: ${MASKED_TOKEN}${NC}"
    fi
  else
    # .env.localからPAT_FOR_PRIVATE_REPOSを読み込む
    if [ -f ".env.local" ]; then
      PAT_FOR_PRIVATE_REPOS=$(grep PAT_FOR_PRIVATE_REPOS .env.local | cut -d '=' -f 2 | head -n 1 | tr -d '"')
      if [ -n "${PAT_FOR_PRIVATE_REPOS}" ]; then
        echo -e "${GREEN}.env.localからPAT_FOR_PRIVATE_REPOSを読み込みました。これをGITHUB_TOKENとして使用します${NC}"
        GITHUB_TOKEN="${PAT_FOR_PRIVATE_REPOS}"
        export GITHUB_TOKEN
        # デバッグ用にマスク表示
        if [ ${#GITHUB_TOKEN} -gt 8 ]; then
          MASKED_TOKEN="${GITHUB_TOKEN:0:4}...${GITHUB_TOKEN: -4}"
          echo -e "${GREEN}トークン: ${MASKED_TOKEN}${NC}"
        fi
      fi
    fi
    
    # 引き続きGITHUB_TOKENも確認
    if [ -z "${GITHUB_TOKEN}" ]; then
      # .env.localからGITHUB_TOKENを読み込む
      if [ -f ".env.local" ]; then
        GITHUB_TOKEN=$(grep GITHUB_TOKEN .env.local | cut -d '=' -f 2 | head -n 1 | tr -d '"')
        export GITHUB_TOKEN
      fi
      
      # .envからGITHUB_TOKENを読み込む（.env.localになければ）
      if [ -z "${GITHUB_TOKEN}" ] && [ -f ".env" ]; then
        GITHUB_TOKEN=$(grep GITHUB_TOKEN .env | cut -d '=' -f 2 | head -n 1 | tr -d '"')
        export GITHUB_TOKEN
      fi
      
      # トークンが見つからない場合は警告
      if [ -z "${GITHUB_TOKEN}" ]; then
        echo -e "${YELLOW}警告: GITHUB_TOKENおよびPAT_FOR_PRIVATE_REPOSが設定されていません。API制限が厳しくなります。${NC}"
        echo "環境変数GITHUB_TOKENまたはPAT_FOR_PRIVATE_REPOSを設定するか、.env.localファイルに追加してください。"
      fi
    fi
  fi
fi

echo -e "${BLUE}===== ジャーナル更新スクリプト =====${NC}"

# コマンドライン引数を解析
USER_PARAM=""
OWNER_PARAM=""
REPO_PARAM=""
DATE_PARAM=""
FROM_DATE_PARAM=""
TO_DATE_PARAM=""
SKIP_EXISTING=""
VERBOSE=""

# 引数の解析
while [ "$#" -gt 0 ]; do
  case "$1" in
    --user)
      USER_PARAM="--user $2"
      echo -e "ユーザーモード: ${GREEN}$2${NC}のコミット情報を取得します"
      shift 2
      ;;
    --owner)
      OWNER_PARAM="--owner $2"
      shift 2
      ;;
    --repo)
      REPO_PARAM="--repo $2"
      shift 2
      ;;
    --date)
      DATE_PARAM="--date $2"
      echo -e "日付指定: ${GREEN}$2${NC}のコミット情報のみを取得します"
      shift 2
      ;;
    --from-date)
      FROM_DATE_PARAM="--from-date $2"
      shift 2
      ;;
    --to-date)
      TO_DATE_PARAM="--to-date $2"
      shift 2
      ;;
    --skip-existing)
      SKIP_EXISTING="--skip-existing"
      shift
      ;;
    --verbose)
      VERBOSE="--verbose"
      shift
      ;;
    --help|-h)
      echo "使用法:"
      echo "  ./scripts/docs/update-journal-commits.sh --user <GitHubユーザー名>"
      echo "  または"
      echo "  ./scripts/docs/update-journal-commits.sh --owner <オーナー名> --repo <リポジトリ名>"
      echo ""
      echo "オプション:"
      echo "  --date <YYYY-MM-DD>     指定日のコミット情報のみを取得"
      echo "  --from-date <YYYY-MM-DD> この日付から処理を開始"
      echo "  --to-date <YYYY-MM-DD>  この日付まで処理"
      echo "  --skip-existing         既存のコミット情報をスキップ"
      echo "  --verbose               詳細ログを表示"
      echo "  --help, -h              このヘルプを表示"
      exit 0
      ;;
    *)
      echo -e "${RED}不明なオプション: $1${NC}"
      echo "使用法:"
      echo "  ./scripts/docs/update-journal-commits.sh --user <GitHubユーザー名>"
      echo "  または"
      echo "  ./scripts/docs/update-journal-commits.sh --owner <オーナー名> --repo <リポジトリ名>"
      echo ""
      echo "詳細なヘルプを表示するには --help または -h オプションを使用してください。"
      exit 1
      ;;
  esac
done

# リポジトリモードの場合
if [ -n "$OWNER_PARAM" ] && [ -n "$REPO_PARAM" ]; then
  echo -e "リポジトリモード: ${GREEN}${OWNER_PARAM#--owner } / ${REPO_PARAM#--repo }${NC}のコミット情報を取得します"
fi

# パラメータが指定されていない場合
if [ -z "$USER_PARAM" ] && ( [ -z "$OWNER_PARAM" ] || [ -z "$REPO_PARAM" ] ); then
  # デフォルトのユーザーを設定
  USER_PARAM="--user otomatty"
  echo -e "デフォルトモード: ${GREEN}otomatty${NC}のコミット情報を取得します"
fi

# 日付範囲の表示
if [ -n "$DATE_PARAM" ]; then
  echo -e "日付指定: ${DATE_PARAM#--date }の情報のみを取得します"
elif [ -n "$FROM_DATE_PARAM" ] || [ -n "$TO_DATE_PARAM" ]; then
  [ -n "$FROM_DATE_PARAM" ] && echo -e "開始日: ${FROM_DATE_PARAM#--from-date }から"
  [ -n "$TO_DATE_PARAM" ] && echo -e "終了日: ${TO_DATE_PARAM#--to-date }まで"
else
  # デフォルトで2日前から今日までを対象とする
  TWO_DAYS_AGO=$(date -v-2d +%Y-%m-%d 2>/dev/null || date -d "2 days ago" +%Y-%m-%d)
  FROM_DATE_PARAM="--from-date $TWO_DAYS_AGO"
  echo -e "日付指定: デフォルト（${GREEN}$TWO_DAYS_AGO${NC}から今日までのコミット情報）"
fi

# スキップオプションの表示
if [ -n "$SKIP_EXISTING" ]; then
  echo -e "既存情報: ${GREEN}スキップします${NC}"
fi

# コマンドの構築
CMD="bun run apps/docs/scripts/update-journal-commits.ts"
[ -n "$USER_PARAM" ] && CMD="$CMD $USER_PARAM"
[ -n "$OWNER_PARAM" ] && CMD="$CMD $OWNER_PARAM"
[ -n "$REPO_PARAM" ] && CMD="$CMD $REPO_PARAM"
[ -n "$DATE_PARAM" ] && CMD="$CMD $DATE_PARAM"
[ -n "$FROM_DATE_PARAM" ] && CMD="$CMD $FROM_DATE_PARAM"
[ -n "$TO_DATE_PARAM" ] && CMD="$CMD $TO_DATE_PARAM"
[ -n "$SKIP_EXISTING" ] && CMD="$CMD $SKIP_EXISTING"
[ -n "$VERBOSE" ] && CMD="$CMD $VERBOSE"

# 実行コマンドの表示
echo -e "${BLUE}コマンド: ${NC}$CMD"

# コマンドの実行
eval "$CMD"

# 終了コードを確認
if [ $? -eq 0 ]; then
  echo -e "${GREEN}✅ ジャーナルの更新が完了しました${NC}"
else
  echo -e "${RED}❌ ジャーナルの更新に失敗しました${NC}"
  exit 1
fi 