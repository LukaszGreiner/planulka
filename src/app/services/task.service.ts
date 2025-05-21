import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  query,
  where,
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
    console.log('Fetching all tasks...'); // Debug log
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
