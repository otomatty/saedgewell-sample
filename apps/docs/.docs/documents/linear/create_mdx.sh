エラーメッセージからすると、Bashスクリプトが正しく実行されていません。 特に以下の点に着目してください。

./create_mdx.sh: line 4: declare: -A: invalid option

これは、declare -A があなたの環境でサポートされていないことを示しています。 declare -A は連想配列を宣言するためのBashの機能ですが、古いバージョンのBashでは利用できない場合があります。

連想配列を使用せずに、スクリプトを修正することで、この問題を回避できます。 具体的には、連想配列の代わりに、複数のif文を使用してディレクトリとファイル名の対応を定義します。

以下に修正版のBashスクリプトを示します。

#!/bin/bash

# ディレクトリとファイル名の対応を定義 (連想配列の代わりにif文を使用)
get_pages() {
  local dir=$1
  case "$dir" in
    "getting-started")
      echo "start-guide conceptual-model get-the-app"
      ;;
    "account")
      echo "profile account-preferences notifications security-and-access"
      ;;
    "your-sidebar")
      echo "inbox my-issues default-team-pages pull-request-reviews"
      ;;
    "administration")
      echo "workspaces login-methods invite-members members-roles security saml scim api-and-webhooks third-party-app-approvals billing-and-plans audit-log import-issues exporting-data"
      ;;
    "teams")
        echo "teams private-teams sub-teams configuring-workflows"
        ;;
    "issues")
        echo "creating-issues editing-issues select-issues parent-and-sub-issues issue-templates comment-on-issues customer-requests editor delete-archive-issues"
        ;;
    "issue-properties")
        echo "due-dates estimates issue-relations labels priority slas"
        ;;
    "projects-and-initiatives")
        echo "projects project-milestones initiatives initiative-and-project-updates project-graph project-overview project-documents project-status project-notifications project-templates project-priority project-dependencies"
        ;;
    "cycles")
        echo "use-cycles update-cycles cycle-graph"
        ;;
    "views")
        echo "board-layout custom-views triage label-views user-views peek"
        ;;
    "find-and-filter")
        echo "search filters display-options favorites"
        ;;
    "integrations")
        echo "api-and-webhooks airbyte asks discord figma front github gitlab google-sheets intercom jira notion sentry slack zapier zendesk integration-directory"
        ;;
    "analytics")
        echo "insights project-graph cycle-graph exporting-data"
        ;;
    *)
      echo "Invalid directory: $dir"
      return 1
      ;;
  esac
}

# ディレクトリのリストを定義
directories=(
  "getting-started"
  "account"
  "your-sidebar"
  "administration"
  "teams"
  "issues"
  "issue-properties"
  "projects-and-initiatives"
  "cycles"
  "views"
  "find-and-filter"
  "integrations"
  "analytics"
)

# 各ディレクトリについて、対応するmdxファイルを作成
for dir in "${directories[@]}"; do
  echo "Creating files for directory: $dir"
  pages=$(get_pages "$dir")
  for page in $pages; do
    file_name="$dir/$page.mdx"
    if [ ! -f "$file_name" ]; then
      echo "Creating file: $file_name"
      mkdir -p "$dir"  # ディレクトリが存在しない場合に作成
      echo "---
title: $(echo $page | tr '-' ' ' | sed 's/\b\w/\u&/g')
---

# $page" > "$file_name"
    else
      echo "File already exists: $file_name"
    fi
  done
done

echo "Finished creating mdx files."


この修正版スクリプトの変更点:

declare -A の使用を避け、get_pages という関数を定義して、ディレクトリに対応するページリストを返すようにしました。case 文を使って、ディレクトリ名に基づいたページリストを返します。

作成前にディレクトリが存在するか確認し、存在しない場合は mkdir -p "$dir" でディレクトリを作成するようにしました。

directories 配列にディレクトリ名を列挙するようにしました。

使用方法:

修正版スクリプトを create_mdx.sh などの名前で保存します。

chmod +x create_mdx.sh で実行権限を与えます。

ターミナルでスクリプトを実行します: ./create_mdx.sh

この修正版スクリプトは、連想配列がサポートされていない環境でも動作するはずです。 もし、それでもエラーが発生する場合は、使用しているシェルのバージョンを確認してください。 古すぎる場合は、Bashをアップデートすることを検討してください。

もし、可能であれば、Pythonスクリプトを使用することをお勧めします。 Pythonスクリプトは、より柔軟で可読性が高く、エラー処理も容易です。 また、ファイル名の変換などの複雑な処理も簡単に行えます。