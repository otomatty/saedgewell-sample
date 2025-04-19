'use server';

import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { revalidatePath } from 'next/cache';
import type { Database } from '@kit/supabase/database';

type ProjectMilestone =
  Database['public']['Tables']['project_milestones']['Row'];
type MilestoneInput = Omit<
  ProjectMilestone,
  'id' | 'created_at' | 'updated_at'
>;

export async function getMilestones(projectId: string) {
  try {
    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase
      .from('project_milestones')
      .select('*')
      .eq('project_id', projectId)
      .order('due_date', { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching milestones:', error);
    return { data: null, error };
  }
}

export async function createMilestone(input: MilestoneInput) {
  try {
    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase
      .from('project_milestones')
      .insert({
        project_id: input.project_id,
        title: input.title,
        description: input.description,
        due_date: input.due_date?.toString(),
        status: input.status,
        progress: input.progress || 0,
      })
      .select()
      .single();

    if (error) throw error;
    revalidatePath(`/admin/projects/${input.project_id}`);
    return { data, error: null };
  } catch (error) {
    console.error('Error creating milestone:', error);
    return { data: null, error };
  }
}

export async function updateMilestone(
  id: string,
  input: Partial<MilestoneInput>
) {
  try {
    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase
      .from('project_milestones')
      .update({
        title: input.title,
        description: input.description,
        due_date: input.due_date?.toString(),
        status: input.status,
        progress: input.progress,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    revalidatePath(`/admin/projects/${input.project_id}`);
    return { data, error: null };
  } catch (error) {
    console.error('Error updating milestone:', error);
    return { data: null, error };
  }
}

export async function deleteMilestone(id: string, projectId: string) {
  try {
    const supabase = await getSupabaseServerClient();
    const { error } = await supabase
      .from('project_milestones')
      .delete()
      .eq('id', id);

    if (error) throw error;
    revalidatePath(`/admin/projects/${projectId}`);
    return { error: null };
  } catch (error) {
    console.error('Error deleting milestone:', error);
    return { error };
  }
}
