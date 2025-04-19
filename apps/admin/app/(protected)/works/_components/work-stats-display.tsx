'use client';

/**
 * @file 実績統計表示コンポーネント。
 * @description 実績の総数、ステータス別、カテゴリ別などの統計情報を表示します。
 * shadcn/ui/card などを使用して視覚的に表示することを想定。
 */

import React from 'react';
// recharts から必要なコンポーネントをインポート
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Bar,
} from 'recharts';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@kit/ui/card';

/**
 * @interface CategoryStat
 * @description カテゴリ別の統計情報。
 * @property {string} category - カテゴリ名。
 * @property {number} count - 件数。
 */
export interface CategoryStat {
  category: string;
  count: number;
}

/**
 * @interface WorkStats
 * @description 実績の統計情報を示す型定義（カテゴリ別情報を含む）。
 * @property {number} totalWorks - 総実績数。
 * @property {CategoryStat[]} totalByCategory - カテゴリ別の総実績数内訳。
 * @property {number} publishedWorks - 公開中の実績数。
 * @property {CategoryStat[]} publishedByCategory - カテゴリ別の公開中実績数内訳。
 */
export interface WorkStats {
  totalWorks: number;
  totalByCategory: CategoryStat[];
  publishedWorks: number;
  publishedByCategory: CategoryStat[];
}

/**
 * @interface TopTechnologyStat
 * @description よく使われている技術の統計情報。
 * @property {string} name - 技術名。
 * @property {number} count - 使用された実績数。
 */
export interface TopTechnologyStat {
  name: string;
  count: number;
}

/**
 * @interface WorkStatsDisplayProps
 * @description WorkStatsDisplay コンポーネントの Props 型定義。
 * @property {WorkStats} [stats] - 表示するカテゴリ別統計データ (オプショナルだが、現状は必須想定)。
 * @property {TopTechnologyStat[]} [topTechnologies] - よく使われている技術データ (オプショナルだが、現状は必須想定)。
 */
interface WorkStatsDisplayProps {
  stats?: WorkStats; // オプショナルにしておくが、呼び出し元で渡す
  topTechnologies?: TopTechnologyStat[]; // オプショナルにしておくが、呼び出し元で渡す
}

// カテゴリごとの色定義 (recharts 用)
const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#8884D8',
  '#82ca9d',
];

// 棒グラフ用の色 (単色)
const BAR_COLOR = '#8884d8';

// カテゴリ名を日本語に変換するためのマッピング
const categoryNameMap: { [key: string]: string } = {
  company: '会社業務',
  freelance: 'フリーランス',
  personal: '個人開発',
  // 必要に応じて他のカテゴリを追加
};

// カテゴリ名を取得またはフォールバックする関数
const getCategoryDisplayName = (categoryKey: string): string => {
  return categoryNameMap[categoryKey] || categoryKey; // マップになければ元のキーを返す
};

/**
 * @function WorkStatsDisplay
 * @description 実績の統計情報をドーナツチャートと棒グラフで表示するコンポーネント。
 * @param {WorkStatsDisplayProps} props - コンポーネントの Props。
 * @returns {React.ReactElement | null} 統計情報を表示するカードのグリッド。データがない場合は null を返す。
 */
const WorkStatsDisplay = ({
  stats,
  topTechnologies,
}: WorkStatsDisplayProps) => {
  // モックデータの定義を削除

  // props が渡されない場合は何も表示しない (またはローディング表示)
  // 今回は props が必ず渡される前提で進めるため、早期リターンを追加
  if (!stats || !topTechnologies) {
    // 本来はここでローディングスケルトンを返すか、
    // Suspense を使う場合はこのコンポーネント自体が表示されない
    return null;
  }

  // props で渡されたデータを直接使用
  const displayStats = stats;
  const displayTopTech = topTechnologies;

  // ローディング状態のスケルトン表示部分を完全に削除
  // (削除済み)

  // recharts 用にデータを整形 (日本語カテゴリ名を使用)
  const totalChartData = displayStats.totalByCategory.map((item) => ({
    name: getCategoryDisplayName(item.category), // 日本語名に変換
    value: item.count,
    originalKey: item.category, // 元のキーも保持 (必要なら)
  }));
  const publishedChartData = displayStats.publishedByCategory.map((item) => ({
    name: getCategoryDisplayName(item.category), // 日本語名に変換
    value: item.count,
    originalKey: item.category, // 元のキーも保持 (必要なら)
  }));

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {' '}
      {/* 3カラムに変更 */}
      {/* 総実績数ドーナツチャート */}
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>総実績数: {displayStats.totalWorks}</CardTitle>
          <CardDescription>カテゴリ別の実績数内訳</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          {totalChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={totalChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  nameKey="name" // 表示名を nameKey に指定
                >
                  {totalChartData.map((entry, index) => (
                    <Cell
                      key={`cell-total-${entry.name}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-3xl font-bold"
                            >
                              {displayStats.totalWorks.toLocaleString()}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 20}
                              className="fill-muted-foreground text-sm"
                            >
                              Total
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
                <Tooltip />
                <Legend
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                  wrapperStyle={{ paddingLeft: '20px' }}
                  formatter={(value, entry) => {
                    // value (nameKeyで指定した日本語名) と件数を表示
                    const name = value || '不明'; // value がない場合のフォールバック
                    const count = entry.payload?.value ?? 0;
                    return `${name} (${count})`;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[250px] w-full items-center justify-center text-muted-foreground">
              データがありません
            </div>
          )}
        </CardContent>
      </Card>
      {/* 公開中実績数ドーナツチャート */}
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>公開中実績数: {displayStats.publishedWorks}</CardTitle>
          <CardDescription>カテゴリ別の公開中実績数内訳</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          {publishedChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={publishedChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  nameKey="name" // 表示名を nameKey に指定
                >
                  {publishedChartData.map((entry, index) => (
                    <Cell
                      key={`cell-published-${entry.name}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-3xl font-bold"
                            >
                              {displayStats.publishedWorks.toLocaleString()}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 20}
                              className="fill-muted-foreground text-sm"
                            >
                              Published
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
                <Tooltip />
                <Legend
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                  wrapperStyle={{ paddingLeft: '20px' }}
                  formatter={(value, entry) => {
                    // value (nameKeyで指定した日本語名) と件数を表示
                    const name = value || '不明'; // value がない場合のフォールバック
                    const count = entry.payload?.value ?? 0;
                    return `${name} (${count})`;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[250px] w-full items-center justify-center text-muted-foreground">
              データがありません
            </div>
          )}
        </CardContent>
      </Card>
      {/* よく使われている技術 Top 5 棒グラフ */}
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>よく使われている技術 Top 5</CardTitle>
          <CardDescription>実績で使用頻度の高い技術</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          {displayTopTech.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={displayTopTech}
                layout="vertical"
                margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <YAxis
                  dataKey="name"
                  type="category"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                />
                <XAxis type="number" dataKey="count" hide={true} />
                <Tooltip
                  cursor={false}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    borderColor: 'hsl(var(--border))',
                    borderRadius: 'var(--radius)',
                  }}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Bar dataKey="count" layout="vertical" radius={[0, 4, 4, 0]}>
                  {displayTopTech.map((entry, index) => (
                    <Cell
                      key={`cell-tech-${entry.name}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[250px] w-full items-center justify-center text-muted-foreground">
              技術データがありません
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkStatsDisplay;
