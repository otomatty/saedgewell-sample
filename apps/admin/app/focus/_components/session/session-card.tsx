import { Label } from '@kit/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@kit/ui/select';

export default function SessionCard() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Project</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select a project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No Project</SelectItem>
            {/* TODO: プロジェクト一覧を表示 */}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Task</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select a task" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No Task</SelectItem>
            {/* TODO: タスク一覧を表示 */}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Knowledge Page</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select a page" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No Page</SelectItem>
            {/* TODO: ナレッジページ一覧を表示 */}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
