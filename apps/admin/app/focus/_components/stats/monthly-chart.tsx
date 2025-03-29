"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

export default function MonthlyChart() {
	// TODO: 実際のデータを取得
	const data = Array.from({ length: 4 }, (_, i) => ({
		name: `Week ${i + 1}`,
		hours: 0,
	}));

	return (
		<div className="h-[300px] w-full">
			<ResponsiveContainer width="100%" height="100%">
				<BarChart data={data}>
					<XAxis
						dataKey="name"
						stroke="#888888"
						fontSize={12}
						tickLine={false}
						axisLine={false}
					/>
					<YAxis
						stroke="#888888"
						fontSize={12}
						tickLine={false}
						axisLine={false}
						tickFormatter={(value) => `${value}h`}
					/>
					<Bar
						dataKey="hours"
						fill="currentColor"
						radius={[4, 4, 0, 0]}
						className="fill-primary"
					/>
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
}
