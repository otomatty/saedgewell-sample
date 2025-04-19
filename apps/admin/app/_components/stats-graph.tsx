'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { UserStatsDataPoint, ActivityStatsDataPoint } from '~/types/admin';

interface StatsGraphProps {
  title: string;
  data: UserStatsDataPoint[] | ActivityStatsDataPoint[];
  type: 'users' | 'activity';
}

const COLORS = {
  totalUsers: '#2563eb', // blue-600
  activeUsers: '#16a34a', // green-600
  newUsers: '#9333ea', // purple-600
  logins: '#2563eb', // blue-600
  registrations: '#9333ea', // purple-600
  contacts: '#dc2626', // red-600
};

/**
 * 統計情報のグラフを表示するコンポーネント
 */
export function StatsGraph({ title, data, type }: StatsGraphProps) {
  const lines =
    type === 'users'
      ? [
          { key: 'totalUsers', name: '総ユーザー数' },
          { key: 'activeUsers', name: 'アクティブユーザー' },
          { key: 'newUsers', name: '新規ユーザー' },
        ]
      : [
          { key: 'logins', name: 'ログイン' },
          { key: 'registrations', name: '登録' },
          { key: 'contacts', name: 'お問い合わせ' },
        ];

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString('ja-JP')
                }
              />
              <YAxis />
              <Tooltip
                labelFormatter={(value) =>
                  new Date(value).toLocaleDateString('ja-JP')
                }
              />
              <Legend />
              {lines.map(({ key, name }) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  name={name}
                  stroke={COLORS[key as keyof typeof COLORS]}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
