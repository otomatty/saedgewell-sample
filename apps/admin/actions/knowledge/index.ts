/**
 * ナレッジ関連のアクションをエクスポートするモジュール
 */
import * as knowledgeActions from "./knowledge";
import * as pagesActions from "./pages";
import * as syncActions from "./sync";

// 名前空間を使用してエクスポート
export { knowledgeActions, pagesActions, syncActions };

// 個別の関数をエクスポート（競合しない関数のみ）
export * from "./pages";
export * from "./sync";

// knowledge.tsからの関数は競合するため、選択的にエクスポート
export {
	getPageStats,
	getRecentPages,
	getSyncStatus,
	getProject,
	getProjectPages,
	getProjectSyncLogs,
	getProjectStats,
} from "./knowledge";
