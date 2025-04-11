import { Button } from '@kit/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@kit/ui/dialog';
import { Input } from '@kit/ui/input';
import { Textarea } from '@kit/ui/textarea';
import { Heart } from 'lucide-react';
import { Switch } from '@kit/ui/switch';
import { Label } from '@kit/ui/label';
import { Edit } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import type { Issue } from '~/mock-data/issues';
import { priorities } from '~/mock-data/priorities';
import { status } from '~/mock-data/status';
import { useAtomValue, useSetAtom } from 'jotai';
import { issuesAtom, addIssueAtom } from '~/store/issues-store';
import {
  isCreateIssueModalOpenAtom,
  defaultCreateIssueStatusAtom,
  openCreateIssueModalAtom,
  closeCreateIssueModalAtom,
} from '~/store/create-issue-store';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { StatusSelector } from './status-selector';
import { PrioritySelector } from '../priority-selector';
import { AssigneeSelector } from './assignee-selector';
import { ProjectSelector } from './project-selector';
import { LabelSelector } from './label-selector';
import { ranks } from '~/mock-data/issues';

export function CreateNewIssue() {
  const [createMore, setCreateMore] = useState<boolean>(false);

  const isOpen = useAtomValue(isCreateIssueModalOpenAtom);
  const defaultStatus = useAtomValue(defaultCreateIssueStatusAtom);
  const openModal = useSetAtom(openCreateIssueModalAtom);
  const closeModal = useSetAtom(closeCreateIssueModalAtom);
  const addIssue = useSetAtom(addIssueAtom);
  const allIssues = useAtomValue(issuesAtom);

  const generateUniqueIdentifier = useCallback(() => {
    const identifiers = allIssues.map((issue: Issue) => issue.identifier);
    let identifier = Math.floor(Math.random() * 999)
      .toString()
      .padStart(3, '0');
    while (identifiers.includes(`LNUI-${identifier}`)) {
      identifier = Math.floor(Math.random() * 999)
        .toString()
        .padStart(3, '0');
    }
    return identifier;
  }, [allIssues]);

  const createDefaultData = useCallback((): Issue => {
    const identifier = generateUniqueIdentifier();
    const initialStatus = defaultStatus || status.find((s) => s.id === 'to-do');
    const initialPriority = priorities.find((p) => p.id === 'no-priority');
    const initialRank = ranks[ranks.length - 1];

    if (!initialStatus) {
      console.error('Default status "to-do" not found!');
      throw new Error('Default status configuration error.');
    }
    if (!initialPriority) {
      console.error('Default priority "no-priority" not found!');
      throw new Error('Default priority configuration error.');
    }
    if (initialRank === undefined) {
      console.error('Default rank not found!');
      throw new Error('Default rank configuration error.');
    }

    return {
      id: uuidv4(),
      identifier: `LNUI-${identifier}`,
      title: '',
      description: '',
      status: initialStatus,
      assignees: null,
      priority: initialPriority,
      labels: [],
      createdAt: new Date().toISOString(),
      cycleId: '',
      project: undefined,
      subissues: [],
      rank: initialRank,
    };
  }, [defaultStatus, generateUniqueIdentifier]);

  const [addIssueForm, setAddIssueForm] = useState<Issue>(createDefaultData);

  useEffect(() => {
    if (isOpen) {
      setAddIssueForm(createDefaultData());
    }
  }, [isOpen, createDefaultData]);

  const createIssue = () => {
    if (!addIssueForm.title) {
      toast.error('Title is required');
      return;
    }
    toast.success('Issue created');
    addIssue(addIssueForm);
    if (!createMore) {
      closeModal();
    }
    setAddIssueForm(createDefaultData());
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(value) => (value ? openModal() : closeModal())}
    >
      <DialogTrigger asChild>
        <Button className="size-8 shrink-0" variant="secondary" size="icon">
          <Edit className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full sm:max-w-[750px] p-0 shadow-xl top-[30%]">
        <DialogHeader className="px-4 pt-4">
          <DialogTitle>Create New Issue</DialogTitle>
        </DialogHeader>
        <div className="flex items-center px-4 pt-4 gap-2">
          <Button size="sm" variant="outline" className="gap-1.5">
            <Heart className="size-4 text-orange-500 fill-orange-500" />
            <span className="font-medium">CORE</span>
          </Button>
        </div>

        <div className="px-4 pb-0 space-y-3 w-full">
          <Input
            className="border-none w-full shadow-none outline-none text-2xl font-medium px-0 h-auto focus-visible:ring-0 overflow-hidden text-ellipsis whitespace-normal break-words"
            placeholder="Issue title"
            value={addIssueForm.title}
            onChange={(e) =>
              setAddIssueForm((prev) => ({ ...prev, title: e.target.value }))
            }
          />

          <Textarea
            className="border-none w-full shadow-none outline-none resize-none px-0 min-h-16 focus-visible:ring-0 break-words whitespace-normal overflow-wrap"
            placeholder="Add description..."
            value={addIssueForm.description}
            onChange={(e) =>
              setAddIssueForm((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
          />

          <div className="w-full flex items-center justify-start gap-1.5 flex-wrap">
            <StatusSelector
              status={addIssueForm.status}
              onChange={(newStatus) =>
                setAddIssueForm((prev) => ({ ...prev, status: newStatus }))
              }
            />
            <PrioritySelector
              priority={addIssueForm.priority}
              onChange={(newPriority) =>
                setAddIssueForm((prev) => ({ ...prev, priority: newPriority }))
              }
            />
            <AssigneeSelector
              assignee={addIssueForm.assignees}
              onChange={(newAssignee) =>
                setAddIssueForm((prev) => ({ ...prev, assignees: newAssignee }))
              }
            />
            <ProjectSelector
              project={addIssueForm.project}
              onChange={(newProject) =>
                setAddIssueForm((prev) => ({ ...prev, project: newProject }))
              }
            />
            <LabelSelector
              selectedLabels={addIssueForm.labels}
              onChange={(newLabels) =>
                setAddIssueForm((prev) => ({ ...prev, labels: newLabels }))
              }
            />
          </div>
        </div>
        <div className="flex items-center justify-between py-2.5 px-4 w-full border-t">
          <div className="flex items-center gap-2">
            <div className="flex items-center space-x-2">
              <Switch
                id="create-more"
                checked={createMore}
                onCheckedChange={setCreateMore}
              />
              <Label htmlFor="create-more">Create more</Label>
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => {
              createIssue();
            }}
          >
            Create issue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
