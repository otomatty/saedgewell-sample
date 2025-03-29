import type { Metadata } from "next";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "../../../../../../../packages/components/src/components/core/card";
import WeeklyChart from "../_components/stats/weekly-chart";
import MonthlyChart from "../_components/stats/monthly-chart";

export const metadata: Metadata = {
	title: "Focus Statistics | Admin",
	description: "View your focus statistics",
};

export default function FocusStatsPage() {
	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-8">Focus Statistics</h1>

			<div className="space-y-8">
				{/* Weekly Stats */}
				<Card>
					<CardHeader>
						<CardTitle>Weekly Focus Time</CardTitle>
					</CardHeader>
					<CardContent>
						<WeeklyChart />
					</CardContent>
				</Card>

				{/* Monthly Stats */}
				<Card>
					<CardHeader>
						<CardTitle>Monthly Focus Time</CardTitle>
					</CardHeader>
					<CardContent>
						<MonthlyChart />
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
