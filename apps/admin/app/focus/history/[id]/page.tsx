import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import { Label } from '@kit/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@kit/ui/select';

export const metadata: Metadata = {
  title: 'Focus Session Details | Admin',
  description: 'View focus session details',
};

interface FocusSessionPageProps {
  params: Promise<{ id: string }>;
}

export default async function FocusSessionPage({
  params,
}: FocusSessionPageProps) {
  const { id } = await params;

  // TODO: セッション情報を取得
  const session = null;

  if (!session) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-8">Session Not Found</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-8">Session Details</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Session Info */}
        <Card>
          <CardHeader>
            <CardTitle>Session Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <div className="text-lg">
                {/* {formatDate(session.startedAt)} */}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Duration</Label>
              <div className="text-lg">
                {/* {session.endedAt
									? formatTime(
											(session.endedAt.getTime() -
												session.startedAt.getTime()) /
												1000,
									  )
									: "-"} */}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <div className="text-lg capitalize">{/* {session.status} */}</div>
            </div>

            <div className="space-y-2">
              <Label>Focus Score</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a score" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((score) => (
                    <SelectItem key={score} value={String(score)}>
                      {score}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Related Items */}
        <Card>
          <CardHeader>
            <CardTitle>Related Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Project</Label>
              <div className="text-lg">
                {/* {session.projectId || "No Project"} */}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Task</Label>
              <div className="text-lg">
                {/* {session.taskId || "No Task"} */}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Knowledge Page</Label>
              <div className="text-lg">
                {/* {session.knowledgePageId || "No Page"} */}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
