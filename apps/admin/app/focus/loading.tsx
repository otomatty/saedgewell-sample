import { PageHeader } from "@/components/custom/page-header";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
	return (
		<div className="space-y-4">
			<PageHeader title="Focus Timer" />
			<div className="container">
				<div className="space-y-8">
					{/* タイマー部分のスケルトン */}
					<div className="flex flex-col items-center justify-center space-y-4">
						<Skeleton className="h-24 w-24 rounded-full" />
						<Skeleton className="h-8 w-32" />
					</div>
					{/* セッションリストのスケルトン */}
					<div className="space-y-2">
						<Skeleton className="h-12 w-full" />
						<Skeleton className="h-12 w-full" />
						<Skeleton className="h-12 w-full" />
					</div>
				</div>
			</div>
		</div>
	);
}
