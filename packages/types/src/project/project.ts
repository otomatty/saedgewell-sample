// types/project.ts
export interface Project {
	id: string;
	userId: string;
	name: string;
	emoji?: string;
	description?: string;
	isArchived: boolean;
	createdAt: Date;
	updatedAt: Date;
	lastActivityAt: Date;
}

export type CreateProjectInput = Pick<
	Project,
	"name" | "emoji" | "description"
>;
export type UpdateProjectInput = Partial<CreateProjectInput>;

// ProjectInputはCreateProjectInputと同じ内容なので、エイリアスとして定義
export type ProjectInput = CreateProjectInput;

export interface MilestoneInput {
	projectId: string;
	title: string;
	description?: string;
	dueDate?: Date;
	status: "not_started" | "in_progress" | "completed";
	progress?: number;
}

export interface TaskInput {
	projectId: string;
	milestoneId?: string;
	title: string;
	description?: string;
	status: "todo" | "in_progress" | "done";
	priority?: number;
	dueDate?: Date;
}

export interface ProgressLogInput {
	projectId: string;
	milestoneId?: string;
	taskId?: string;
	logType: "milestone" | "task" | "general";
	description: string;
	hoursSpent?: number;
}
