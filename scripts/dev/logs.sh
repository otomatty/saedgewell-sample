#!/bin/bash
set -e

# 利用可能なサービスのリスト
SERVICES=("web" "docs" "admin" "nginx")

# ヘルプメッセージを表示
show_help() {
  echo "使用方法: $0 [options] [service_name]"
  echo ""
  echo "オプション:"
  echo "  -h, --help      このヘルプメッセージを表示"
  echo "  -f, --follow    ログをリアルタイムで追跡（デフォルト）"
  echo "  -n, --lines N   表示する行数を指定（デフォルト: 100）"
  echo "  -a, --all       すべてのサービスのログを表示"
  echo ""
  echo "利用可能なサービス:"
  for service in "${SERVICES[@]}"; do
    echo "  - $service"
  done
  echo ""
  echo "例:"
  echo "  $0 web          webサービスの最新100行のログを表示し、追跡する"
  echo "  $0 -n 50 docs   docsサービスの最新50行のログを表示し、追跡する"
  echo "  $0 -a           すべてのサービスのログを表示し、追跡する"
  echo "  $0 --no-follow admin  adminサービスのログを追跡せずに表示"
  exit 0
}

# 引数の解析
FOLLOW=true
LINES=100
ALL=false
SERVICE=""

while [[ $# -gt 0 ]]; do
  case $1 in
    -h|--help)
      show_help
      ;;
    -f|--follow)
      FOLLOW=true
      shift
      ;;
    --no-follow)
      FOLLOW=false
      shift
      ;;
    -n|--lines)
      LINES="$2"
      shift 2
      ;;
    -a|--all)
      ALL=true
      shift
      ;;
    *)
      SERVICE="$1"
      shift
      ;;
  esac
done

# サービスが実行中かどうかを確認
check_service_running() {
  local service=$1
  if ! docker compose ps | grep -q "$service"; then
    echo "❌ エラー: $service サービスが実行されていません"
    echo "最初に起動してください: ./scripts/dev/start-all.sh または ./scripts/dev/start-for-arch.sh"
    exit 1
  fi
}

# コマンドの構築
build_log_command() {
  local cmd="docker compose logs"
  
  # 行数オプションを追加
  cmd="$cmd --tail=$LINES"
  
  # フォローオプションを追加
  if [ "$FOLLOW" = true ]; then
    cmd="$cmd -f"
  fi
  
  # サービス名を追加
  if [ -n "$SERVICE" ]; then
    cmd="$cmd $SERVICE"
  fi
  
  echo "$cmd"
}

# メイン処理
main() {
  # すべてのサービスを表示する場合
  if [ "$ALL" = true ]; then
    echo "すべてのサービスのログを表示します..."
    cmd=$(build_log_command)
    eval "$cmd"
    exit 0
  fi

  # 特定のサービスのログを表示する場合
  if [ -n "$SERVICE" ]; then
    # サービスがリスト内にあるか確認
    if [[ ! " ${SERVICES[@]} " =~ " ${SERVICE} " ]]; then
      echo "❌ エラー: '$SERVICE' は有効なサービス名ではありません"
      echo "利用可能なサービス: ${SERVICES[*]}"
      exit 1
    fi
    
    # サービスが実行中か確認
    check_service_running "$SERVICE"
    
    echo "$SERVICE サービスのログを表示します..."
    cmd=$(build_log_command)
    eval "$cmd"
  else
    # サービスが指定されていない場合
    echo "表示するサービスを指定してください"
    show_help
  fi
}

# スクリプトの実行
main 