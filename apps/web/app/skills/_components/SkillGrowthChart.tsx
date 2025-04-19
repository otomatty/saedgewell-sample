'use client';

import type React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { Skill } from '~/types/skill';
import { calculateScoreTimeline, SCORE_WEIGHTS } from '~/utils/scoreUtils';

interface SkillGrowthChartProps {
  skill: Skill; // 単一のスキルデータを受け取る
}

/**
 * 単一スキルの経験値スコアの時系列変化を折れ線グラフで表示するコンポーネント。
 */
const SkillGrowthChart: React.FC<SkillGrowthChartProps> = ({ skill }) => {
  // useMemo は不要 (props が変わったら再計算されるため)
  const chartData = calculateScoreTimeline(skill, SCORE_WEIGHTS, 36, 1); // 過去36ヶ月、1ヶ月間隔

  // グラフに表示する意味のあるデータ点があるかチェック
  const hasMeaningfulData = chartData.some(
    (point: { score: number }) => point.score > 0
  );

  if (!hasMeaningfulData) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
        (成長グラフを表示するデータがありません)
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart
        data={chartData}
        margin={{
          top: 5,
          right: 20, // 右マージン調整
          left: -10, // 左マージン調整
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 9 }} // フォントサイズ微調整
          // angle={-30}
          // textAnchor="end"
          // height={40}
          tickLine={false} // X軸の目盛り線は非表示に
          axisLine={{ strokeOpacity: 0.5 }} // X軸自体の線は薄く
          interval="preserveStartEnd" // 最初と最後のラベルは表示
          // ラベルの間引き (必要なら調整)
          // tickCount={6} // 表示するラベル数で調整
          // interval={5} // 何個おきに表示するかで調整
        />
        <YAxis
          tick={{ fontSize: 9 }}
          axisLine={false} // Y軸の線は非表示に
          tickLine={false} // Y軸の目盛り線も非表示に
          width={30} // Y軸のラベル表示に必要な幅
        />
        <Tooltip
          contentStyle={{ fontSize: 11, padding: '3px 6px' }}
          labelStyle={{ marginBottom: '2px' }}
          itemStyle={{ padding: '1px 0' }}
          formatter={(value: number) => [`${value} pts`, 'Score']} // Tooltipの表示内容調整
        />
        {/* Legend は不要なので削除 */}
        {/* <Legend /> */}
        <Line
          key={skill.id}
          type="monotone"
          dataKey="score" // データキーを score に変更
          name={skill.name} // Tooltip用に名前を設定
          stroke="#8884d8" // 単一の色を使用
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SkillGrowthChart;
