export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface Task {
  id?: string; // Firestore document ID
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: Date; // Timestamp in Firestore
  createdAt: Date; // Timestamp in Firestore
  updatedAt: Date; // Timestamp in Firestore
  tags?: string[];
  assignedUsers: string[]; // Array of user IDs
  attachments?: string[];
  completedAt?: Date | null; // Will be stored as Timestamp in Firestore
}
