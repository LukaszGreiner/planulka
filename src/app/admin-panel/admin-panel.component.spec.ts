import { Component, OnInit, inject, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { Task, TaskStatus } from '../models/task.model';
import { TaskService } from '../services/task.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import {
  Firestore,
  Timestamp,
  collection,
  collectionData,
  deleteDoc,
  doc,
  setDoc,
} from '@angular/fire/firestore';

interface UserProfile {
  id: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
}

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatTableModule,
  ],
  template: `
    <div
      class="admin-panel-container"
      *ngIf="userRole === 'admin'; else noAccess"
    >
      <h2>Admin Panel</h2>

      <!-- Tasks Section -->
      <h3>All Tasks</h3>
      <mat-table [dataSource]="tasks" class="mat-elevation-z8">
        <ng-container matColumnDef="title">
          <mat-header-cell *matHeaderCellDef>Title</mat-header-cell>
          <mat-cell *matCellDef="let task">{{ task.title }}</mat-cell>
        </ng-container>
        <ng-container matColumnDef="priority">
          <mat-header-cell *matHeaderCellDef>Priority</mat-header-cell>
          <mat-cell *matCellDef="let task">{{
            task.priority | titlecase
          }}</mat-cell>
        </ng-container>
        <ng-container matColumnDef="status">
          <mat-header-cell *matHeaderCellDef>Status</mat-header-cell>
          <mat-cell *matCellDef="let task">{{
            task.status | titlecase
          }}</mat-cell>
        </ng-container>
        <ng-container matColumnDef="dueDate">
          <mat-header-cell *matHeaderCellDef>Due Date</mat-header-cell>
          <mat-cell *matCellDef="let task">{{
            task.dueDate | date : 'shortDate'
          }}</mat-cell>
        </ng-container>
        <ng-container matColumnDef="actions">
          <mat-header-cell *matHeaderCellDef>Actions</mat-header-cell>
          <mat-cell *matCellDef="let task">
            <button
              mat-icon-button
              color="primary"
              (click)="editTask(task)"
              aria-label="Edit task"
            >
              <mat-icon>edit</mat-icon>
            </button>
            <button
              mat-icon-button
              color="warn"
              (click)="deleteTask(task)"
              aria-label="Delete task"
            >
              <mat-icon>delete</mat-icon>
            </button>
          </mat-cell>
        </ng-container>
        <mat-header-row *matHeaderRowDef="taskColumns"></mat-header-row>
        <mat-row *matRowDef="let row; columns: taskColumns"></mat-row>
      </mat-table>

      <!-- Users Section -->
      <h3>All Users</h3>
      <mat-table [dataSource]="(users$ | async) ?? []" class="mat-elevation-z8">
        <ng-container matColumnDef="email">
          <mat-header-cell *matHeaderCellDef>Email</mat-header-cell>
          <mat-cell *matCellDef="let user">{{ user.email }}</mat-cell>
        </ng-container>
        <ng-container matColumnDef="role">
          <mat-header-cell *matHeaderCellDef>Role</mat-header-cell>
          <mat-cell *matCellDef="let user">{{ user.role }}</mat-cell>
        </ng-container>
        <ng-container matColumnDef="actions">
          <mat-header-cell *matHeaderCellDef>Actions</mat-header-cell>
          <mat-cell *matCellDef="let user">
            <button
              mat-icon-button
              color="primary"
              (click)="editUserRole(user)"
              aria-label="Edit user role"
            >
              <mat-icon>edit</mat-icon>
            </button>
            <button
              mat-icon-button
              color="warn"
              (click)="deleteUser(user)"
              aria-label="Delete user"
            >
              <mat-icon>delete</mat-icon>
            </button>
          </mat-cell>
        </ng-container>
        <mat-header-row *matHeaderRowDef="userColumns"></mat-header-row>
        <mat-row *matRowDef="let row; columns: userColumns"></mat-row>
      </mat-table>
    </div>

    <ng-template #noAccess>
      <p class="no-access-message">
        You do not have permission to access this page.
      </p>
    </ng-template>
  `,
  styles: [
    `
      .admin-panel-container {
        padding: 2rem;
      }
      h2,
      h3 {
        margin-bottom: 1rem;
      }
      .mat-elevation-z8 {
        margin-bottom: 2rem;
        width: 100%;
      }
      mat-header-cell,
      mat-cell {
        padding: 0.5rem;
      }
      .no-access-message {
        text-align: center;
        padding: 2rem;
        font-style: italic;
        color: #888;
      }
    `,
  ],
})
export class AdminPanelComponent implements OnInit {
  private taskService = inject(TaskService);
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);
  private firestore = inject(Firestore);
  private router = inject(Router);
  userRole: string | null = null;
  tasks: Task[] = [];
  users$ = new Observable<UserProfile[]>();
  taskColumns: string[] = ['title', 'priority', 'status', 'dueDate', 'actions'];
  userColumns: string[] = ['email', 'role', 'actions'];

  ngOnInit(): void {
    this.authService.getUserRole().subscribe((role) => {
      this.userRole = role;
      if (this.userRole !== 'admin') {
        this.router.navigate(['/app']);
      } else {
        this.loadTasks();
        this.loadUsers();
      }
    });
  }

  loadTasks(): void {
    this.taskService.getAllTasks().subscribe((tasks) => {
      this.tasks = tasks;
    });
  }

  loadUsers(): void {
    const usersCollection = collection(this.firestore, 'users');
    this.users$ = collectionData(usersCollection, { idField: 'id' }).pipe(
      map(
        (users: any[]) =>
          users.map((user) => ({
            ...user,
            createdAt:
              user.createdAt instanceof Timestamp
                ? user.createdAt.toDate()
                : user.createdAt,
            updatedAt:
              user.updatedAt instanceof Timestamp
                ? user.updatedAt.toDate()
                : user.updatedAt,
          })) as UserProfile[]
      )
    );
  }

  async editTask(task: Task): Promise<void> {
    const { TaskFormComponent } = await import(
      '../dashboard/task-form/task-form.component'
    );

    const dialogRef = this.dialog.open(TaskFormComponent, {
      width: '450px',
      data: { taskToEdit: task },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadTasks();
      }
    });
  }

  deleteTask(task: Task): void {
    if (!task.id) return;
    this.taskService.deleteTask(task.id).subscribe(() => {
      this.tasks = this.tasks.filter((t) => t.id !== task.id);
    });
  }

  editUserRole(user: UserProfile): void {
    // Placeholder for role editing logic (e.g., open a dialog)
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    const userDoc = doc(this.firestore, `users/${user.id}`);
    setDoc(
      userDoc,
      { role: newRole, updatedAt: new Date() },
      { merge: true }
    ).then(() => {
      this.loadUsers();
    });
  }

  deleteUser(user: UserProfile): void {
    // Note: Deleting a user requires Firebase Admin SDK or manual Firestore deletion
    const userDoc = doc(this.firestore, `users/${user.id}`);
    deleteDoc(userDoc).then(() => {
      this.loadUsers();
    });
  }
}
