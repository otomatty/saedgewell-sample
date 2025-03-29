import type { Metadata } from "next";
import SessionList from "../_components/session/session-list";

export const metadata: Metadata = {
	title: "Focus History | Admin",
	description: "View your focus session history",
};

export default function FocusHistoryPage() {
	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-8">Focus History</h1>

			<div className="space-y-6">
				{/* Summary Section */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div className="bg-card rounded-lg p-6 shadow-xs">
						<h3 className="text-lg font-semibold mb-2">Total Sessions</h3>
						<p className="text-3xl font-bold">0</p>
					</div>
					<div className="bg-card rounded-lg p-6 shadow-xs">
						<h3 className="text-lg font-semibold mb-2">Total Focus Time</h3>
						<p className="text-3xl font-bold">0h</p>
					</div>
					<div className="bg-card rounded-lg p-6 shadow-xs">
						<h3 className="text-lg font-semibold mb-2">Average Score</h3>
						<p className="text-3xl font-bold">-</p>
					</div>
				</div>

				{/* Session List */}
				<div className="bg-card rounded-lg p-6 shadow-xs">
					<h2 className="text-xl font-semibold mb-6">Sessions</h2>
					<SessionList />
				</div>
			</div>
		</div>
	);
}
