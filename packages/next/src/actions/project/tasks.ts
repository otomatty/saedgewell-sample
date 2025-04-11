'use server';

import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { revalidatePath } from 'next/cache';
import type { Database } from '@kit/supabase/database';

type Task = Database['public']['Tables']['tasks']['Row'] & {
  milestone_id?: string | null;
  priority: number;
};
type TaskInput = Omit<Task, 'id' | 'created_at' | 'updated_at'>;

export async function getTasks(projectId: string) {
  try {
    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        project_milestones (
          id,
          title
        )
      `)
      .eq('project_id', projectId)
      .order('priority', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return { data: null, error };
  }
}

export async function createTask(input: TaskInput) {
  try {
    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        project_id: input.project_id,
        title: input.title,
        description: input.description,
        status: input.status,
        priority: input.priority,
        due_date: input.due_date?.toString(),
        milestone_id: input.milestone_id,
      })
      .select()
      .single();

    if (error) throw error;
    revalidatePath(`/admin/projects/${input.project_id}`);
    return { data, error: null };
  } catch (error) {
    console.error('Error creating task:', error);
    return { data: null, error };
  }
}

export async function updateTask(id: string, input: Partial<TaskInput>) {
  try {
    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase
      .from('tasks')
      .update({
        title: input.title,
        description: input.description,
        status: input.status,
        priority: input.priority,
        due_date: input.due_date?.toString(),
        milestone_id: input.milestone_id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    revalidatePath(`/admin/projects/${input.project_id}`);
    return { data, error: null };
  } catch (error) {
    console.error('Error updating task:', error);
    return { data: null, error };
  }
}

export async function deleteTask(id: string, projectId: string) {
  try {
    const supabase = await getSupabaseServerClient();
    const { error } = await supabase.from('tasks').delete().eq('id', id);

    if (error) throw error;
    revalidatePath(`/admin/projects/${projectId}`);
    return { error: null };
  } catch (error) {
    console.error('Error deleting task:', error);
    return { error };
  }
}
