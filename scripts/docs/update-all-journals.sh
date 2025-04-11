#!/bin/bash

# 日記情報の更新スクリプト
# 使用方法: ./scripts/docs/update-all-journals.sh [--user <GitHubユーザー名>]

# 色の定義
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

print_header() {
  echo -e "${GREEN}=== $1 ===${NC}"
}

print_info() {
  echo -e "${YELLOW}$1${NC}"
}

print_error() {
  echo -e "${RED}$1${NC}"
}

print_debug() {
  if [ "$DEBUG" = "true" ]; then
    echo -e "${BLUE}[DEBUG] $1${NC}"
  fi
}

# バナー表示
echo -e "${BLUE}===================================================${NC}"
echo -e "${GREEN}     日記情報の更新ツール${NC}"
echo -e "${BLUE}===================================================${NC}"
echo ""

# 現在の日付を取得
current_date=$(date +%Y-%m-%d)

# コマンドライン引数のパース
github_user=""
target_date=""
DEBUG="false"

while [[ $# -gt 0 ]]; do
  case $1 in
    --user)
      github_user="$2"
      shift 2
      ;;
    --date)
      target_date="$2"
      shift 2
      ;;
    --debug)
      DEBUG="true"
      shift
      ;;
    *)
      print_error "不明なオプション: $1"
      echo "使用方法: ./scripts/docs/update-all-journals.sh [--user <GitHubユーザー名>] [--date <YYYY-MM-DD>] [--debug]"
      exit 1
      ;;
  esac
done

# 現在のディレクトリを表示
print_debug "現在のディレクトリ: $(pwd)"
print_debug "apps/docsディレクトリの存在確認: $(ls -la ./apps/docs 2>/dev/null || echo 'ディレクトリが見つかりません')"

# プロジェクトルートでスクリプトが実行されているか確認
if [ ! -d "./apps/docs" ]; then
  print_error "エラー: このスクリプトはプロジェクトルートディレクトリから実行する必要があります"
  exit 1
fi

# プロジェクトルートパスを保存
export PROJECT_ROOT="$(pwd)"
print_debug "PROJECT_ROOT環境変数を設定: ${PROJECT_ROOT}"

# プロジェクトルートの.docs/journalsディレクトリの確認
print_debug ".docs/journalsディレクトリの確認: $(ls -la ${PROJECT_ROOT}/.docs/journals 2>/dev/null || echo 'ディレクトリが見つかりません')"

# scriptsディレクトリのパスを設定
SCRIPTS_DIR="${PROJECT_ROOT}/apps/docs/scripts"
print_debug "スクリプトディレクトリを設定: ${SCRIPTS_DIR}"
print_debug "スクリプトファイルの確認: $(ls -la ${SCRIPTS_DIR}/*.ts 2>/dev/null || echo 'スクリプトが見つかりません')"

# CIでの実行時はGitHubリポジトリ情報を環境変数から取得
if [ -n "$GITHUB_REPOSITORY" ]; then
  github_repo_info=(${GITHUB_REPOSITORY/\// })
  REPO_OWNER=${github_repo_info[0]}
  REPO_NAME=${github_repo_info[1]}
  print_info "CI環境での実行を検出しました。リポジトリ情報: $REPO_OWNER/$REPO_NAME"
fi

print_header "日記情報の更新を開始します"

# 処理対象の日付を決定
if [ -n "$target_date" ]; then
  # 特定の日付が指定された場合
  process_date="$target_date"
  process_end_date="$target_date"
  print_info "処理対象日付: ${process_date}"
else
  # デフォルトでは2日前から今日までを対象とする
  TWO_DAYS_AGO=$(date -v-2d +%Y-%m-%d 2>/dev/null || date -d "2 days ago" +%Y-%m-%d)
  process_date="$TWO_DAYS_AGO"
  process_end_date="$current_date"
  print_info "処理対象期間: ${process_date} から ${process_end_date} まで"
fi

# 先に日付ディレクトリを作成しておく
print_header "0. 対象日付ディレクトリの作成確認"
print_info "対象日付ディレクトリを作成確認します: ${process_date}～${process_end_date}"
PROJECT_ROOT="${PROJECT_ROOT}" npx tsx "${SCRIPTS_DIR}/create-journal-dirs.ts" --start-date "${process_date}" --end-date "${process_end_date}"

if [ $? -ne 0 ]; then
  print_error "日付ディレクトリの作成確認に失敗しました"
else
  print_info "日付ディレクトリの作成確認が完了しました"
fi

# 1. MDXファイルのフロントマター情報からindex.jsonのentriesを更新
print_header "1. MDXファイルのフロントマター情報からindex.jsonのentriesを更新"

if [ -n "$target_date" ]; then
  print_info "対象日付: $target_date"
  
  if [ "$DEBUG" = "true" ]; then
    print_debug "コマンド実行: PROJECT_ROOT=${PROJECT_ROOT} npx tsx --trace-warnings ${SCRIPTS_DIR}/update-journal-entries.ts --dir \"$target_date\""
    PROJECT_ROOT="${PROJECT_ROOT}" npx tsx --trace-warnings "${SCRIPTS_DIR}/update-journal-entries.ts" --dir "$target_date"
  else
    PROJECT_ROOT="${PROJECT_ROOT}" npx tsx "${SCRIPTS_DIR}/update-journal-entries.ts" --dir "$target_date"
  fi
else
  print_info "対象期間: $process_date から $process_end_date まで"
  
  if [ "$DEBUG" = "true" ]; then
    print_debug "コマンド実行: PROJECT_ROOT=${PROJECT_ROOT} npx tsx --trace-warnings ${SCRIPTS_DIR}/update-journal-entries.ts --from-date \"$process_date\" --to-date \"$process_end_date\""
    PROJECT_ROOT="${PROJECT_ROOT}" npx tsx --trace-warnings "${SCRIPTS_DIR}/update-journal-entries.ts" --from-date "$process_date" --to-date "$process_end_date"
  else
    PROJECT_ROOT="${PROJECT_ROOT}" npx tsx "${SCRIPTS_DIR}/update-journal-entries.ts" --from-date "$process_date" --to-date "$process_end_date"
  fi
fi

if [ $? -ne 0 ]; then
  print_error "MDXフロントマターの更新に失敗しました"
  exit 1
fi

# 2. GitHubコミット情報を更新
print_header "2. GitHubコミット情報を更新"

# 環境変数のデバッグ情報
print_debug "環境変数の状態:"
print_debug "GITHUB_TOKEN: ${GITHUB_TOKEN:-未設定}"
print_debug "PAT_FOR_PRIVATE_REPOS: ${PAT_FOR_PRIVATE_REPOS:-未設定}"

# PAT_FOR_PRIVATE_REPOSが設定されていれば、GITHUB_TOKENとしてエクスポート
if [ -n "${PAT_FOR_PRIVATE_REPOS}" ] && [ -z "${GITHUB_TOKEN}" ]; then
  print_info "PAT_FOR_PRIVATE_REPOSを検出しました。これをGITHUB_TOKENとして使用します。"
  export GITHUB_TOKEN="${PAT_FOR_PRIVATE_REPOS}"
  # マスク表示（デバッグモードの場合）
  if [ "$DEBUG" = "true" ] && [ ${#GITHUB_TOKEN} -gt 8 ]; then
    MASKED_TOKEN="${GITHUB_TOKEN:0:4}...${GITHUB_TOKEN: -4}"
    print_debug "設定されたGITHUB_TOKEN: ${MASKED_TOKEN}"
  fi
fi

# GitHubコミット情報の更新コマンドを構築
COMMITS_CMD=""
if [ -n "$github_user" ]; then
  COMMITS_CMD="--user $github_user"
  print_info "指定ユーザーのコミット情報を取得: $github_user"
elif [ -n "$REPO_OWNER" ] && [ -n "$REPO_NAME" ]; then
  COMMITS_CMD="--owner $REPO_OWNER --repo $REPO_NAME"
  print_info "リポジトリのコミット情報を取得: $REPO_OWNER/$REPO_NAME"
else
  COMMITS_CMD="--user otomatty"
  print_info "デフォルトユーザーのコミット情報を取得: otomatty"
fi

# 日付指定を追加
if [ -n "$target_date" ]; then
  COMMITS_CMD="$COMMITS_CMD --date $target_date"
  print_info "対象日付: $target_date"
else
  COMMITS_CMD="$COMMITS_CMD --from-date $process_date --to-date $process_end_date"
  print_info "対象期間: $process_date から $process_end_date まで"
fi

print_info "コマンド: $COMMITS_CMD"
PROJECT_ROOT="${PROJECT_ROOT}" npx tsx "${SCRIPTS_DIR}/update-journal-commits.ts" $COMMITS_CMD

if [ $? -ne 0 ]; then
  print_error "GitHubコミット情報の更新に失敗しました"
  exit 1
fi

print_header "日記情報の更新が完了しました"
echo -e "${BLUE}===================================================${NC}"
echo -e "${GREEN}処理が完了しました${NC}"
echo -e "${BLUE}===================================================${NC}" 