'use server';

import { createMilestone, updateMilestone } from '@kit/next/actions';

export async function handleSubmitMilestone(
  projectId: string,
  milestoneId: string | undefined,
  data: {
    title: string;
    description: string;
    dueDate: Date | undefined;
    status?: 'not_started' | 'in_progress' | 'completed';
    progress?: number;
  }
) {
  if (milestoneId) {
    await updateMilestone(milestoneId, {
      project_id: projectId,
      title: data.title,
      description: data.description,
      due_date: data.dueDate ? data.dueDate.toISOString() : null,
      status: data.status || 'not_started',
      progress: data.progress || 0,
    });
  } else {
    await createMilestone({
      project_id: projectId,
      title: data.title,
      description: data.description,
      due_date: data.dueDate ? data.dueDate.toISOString() : null,
      status: 'not_started',
      progress: 0,
    });
  }
}
