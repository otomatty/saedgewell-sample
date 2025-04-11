// types/task.ts
export type TaskStatus = "todo" | "in_progress" | "done";
export type TaskPriority = 0 | 1 | 2 | 3; // 0: なし, 1: 低, 2: 中, 3: 高

export interface Task {
	id: string;
	projectId: string;
	title: string;
	description?: string;
	status: TaskStatus;
	priority: TaskPriority;
	dueDate?: Date;
	isArchived: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export type CreateTaskInput = {
	projectId: string;
	title: string;
	description?: string;
	status: TaskStatus;
	priority: TaskPriority;
	dueDate?: Date;
};

export type UpdateTaskInput = Partial<Omit<CreateTaskInput, "projectId">>;
