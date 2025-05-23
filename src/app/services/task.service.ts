import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  query,
  where,
  orderBy,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  collectionData,
  Timestamp,
} from '@angular/fire/firestore';
import { Task } from '../models/task.model';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private firestore = inject(Firestore);
  private tasksCollection = collection(this.firestore, 'tasks');

  getTasksByUserId(userId: string): Observable<Task[]> {
    const q = query(
      this.tasksCollection,
      where('assignedUsers', 'array-contains', userId)
    );
    return collectionData(q, { idField: 'id' }).pipe(
      map(
        (tasks: any[]) =>
          tasks.map((task: any) => ({
            ...task,
            dueDate:
              task.dueDate instanceof Timestamp
                ? task.dueDate.toDate()
                : task.dueDate,
            createdAt:
              task.createdAt instanceof Timestamp
                ? task.createdAt.toDate()
                : task.createdAt,
            updatedAt:
              task.updatedAt instanceof Timestamp
                ? task.updatedAt.toDate()
                : task.updatedAt,
            completedAt:
              task.completedAt instanceof Timestamp
                ? task.completedAt.toDate()
                : task.completedAt,
          })) as Task[]
      )
    );
  }

  getAllTasks(): Observable<Task[]> {
    return collectionData(this.tasksCollection, { idField: 'id' }).pipe(
      map(
        (tasks: any[]) =>
          tasks.map((task: any) => ({
            ...task,
            dueDate:
              task.dueDate instanceof Timestamp
                ? task.dueDate.toDate()
                : task.dueDate,
            createdAt:
              task.createdAt instanceof Timestamp
                ? task.createdAt.toDate()
                : task.createdAt,
            updatedAt:
              task.updatedAt instanceof Timestamp
                ? task.updatedAt.toDate()
                : task.updatedAt,
            completedAt:
              task.completedAt instanceof Timestamp
                ? task.completedAt.toDate()
                : task.completedAt,
          })) as Task[]
      )
    );
  }

  getFilteredAndSortedTasks(
    userId: string | null,
    statusFilter: 'todo' | 'in_progress' | 'done' | null,
    sortBy: 'priority' | 'createdAt' | null,
    sortOrder: 'asc' | 'desc',
    isAdmin: boolean
  ): Observable<Task[]> {
    let q = query(this.tasksCollection);

    // Always apply user filter if provided (for admin panel filtering or user-specific view)
    if (userId) {
      q = query(q, where('assignedUsers', 'array-contains', userId));
    }

    if (statusFilter) {
      q = query(q, where('status', '==', statusFilter));
    }

    // If sorting by priority, defer to client-side sort (Firestore orders strings lexicographically)
    const priorityWeights: Record<string, number> = {
      low: 1,
      medium: 2,
      high: 3,
    };
    const clientSortPriority = sortBy === 'priority';
    if (!clientSortPriority && sortBy) {
      q = query(q, orderBy(sortBy, sortOrder));
    }

    console.log('Querying tasks with:', {
      userId,
      statusFilter,
      sortBy,
      sortOrder,
      isAdmin,
    });

    return collectionData(q, { idField: 'id' }).pipe(
      map((tasks: any[]) => {
        console.log('Fetched tasks:', tasks);
        const converted = tasks.map((task: any) => ({
          ...task,
          dueDate:
            task.dueDate instanceof Timestamp
              ? task.dueDate.toDate()
              : task.dueDate,
          createdAt:
            task.createdAt instanceof Timestamp
              ? task.createdAt.toDate()
              : task.createdAt,
          updatedAt:
            task.updatedAt instanceof Timestamp
              ? task.updatedAt.toDate()
              : task.updatedAt,
        }));
        if (clientSortPriority) {
          converted.sort((a, b) =>
            sortOrder === 'asc'
              ? priorityWeights[a.priority] - priorityWeights[b.priority]
              : priorityWeights[b.priority] - priorityWeights[a.priority]
          );
        }
        return converted;
      })
    );
  }

  addTask(task: Task): Observable<string> {
    return from(addDoc(this.tasksCollection, task)).pipe(
      map((docRef) => docRef.id)
    );
  }

  updateTask(taskId: string, task: Partial<Task>): Observable<void> {
    const taskDoc = doc(this.firestore, `tasks/${taskId}`);
    return from(updateDoc(taskDoc, task));
  }

  deleteTask(taskId: string): Observable<void> {
    const taskDoc = doc(this.firestore, `tasks/${taskId}`);
    return from(deleteDoc(taskDoc));
  }
}
