'use server';

import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { revalidatePath } from 'next/cache';
import type { Database } from '@kit/supabase/database';

type ProgressLog = Database['public']['Tables']['project_progress_logs']['Row'];
type ProgressLogInput = Omit<ProgressLog, 'id' | 'created_at'>;

export async function getProgressLogs(projectId: string) {
  try {
    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase
      .from('project_progress_logs')
      .select(`
        *,
        project_milestones (
          id,
          title
        ),
        tasks (
          id,
          title
        )
      `)
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching progress logs:', error);
    return { data: null, error };
  }
}

export async function createProgressLog(input: ProgressLogInput) {
  try {
    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase
      .from('project_progress_logs')
      .insert({
        project_id: input.project_id,
        milestone_id: input.milestone_id,
        task_id: input.task_id,
        log_type: input.log_type,
        description: input.description,
        hours_spent: input.hours_spent,
      })
      .select()
      .single();

    if (error) throw error;
    revalidatePath(`/admin/projects/${input.project_id}`);
    return { data, error: null };
  } catch (error) {
    console.error('Error creating progress log:', error);
    return { data: null, error };
  }
}

export async function deleteProgressLog(id: string, projectId: string) {
  try {
    const supabase = await getSupabaseServerClient();
    const { error } = await supabase
      .from('project_progress_logs')
      .delete()
      .eq('id', id);

    if (error) throw error;
    revalidatePath(`/admin/projects/${projectId}`);
    return { error: null };
  } catch (error) {
    console.error('Error deleting progress log:', error);
    return { error };
  }
}
