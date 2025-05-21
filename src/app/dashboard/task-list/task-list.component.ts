import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Task, TaskStatus } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { Auth } from '@angular/fire/auth';
import { AuthService } from '../../services/auth.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSelectModule,
    MatFormFieldModule,
    ReactiveFormsModule,
  ],
  template: `
    <div class="task-list-container">
      <div class="filters">
        <mat-form-field appearance="fill">
          <mat-label>Filter by Status</mat-label>
          <mat-select [formControl]="statusFilter">
            <mat-option value="">All</mat-option>
            <mat-option value="todo">To Do</mat-option>
            <mat-option value="in_progress">In Progress</mat-option>
            <mat-option value="done">Done</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Sort by</mat-label>
          <mat-select [formControl]="sortBy">
            <mat-option value="">None</mat-option>
            <mat-option value="priority">Priority</mat-option>
            <mat-option value="createdAt">Creation Date</mat-option>
          </mat-select>
        </mat-form-field>
      </div>
      <div *ngIf="tasks.length > 0; else noTasks" class="task-list">
        <mat-card *ngFor="let task of tasks" class="task-card">
          <mat-card-header>
            <mat-card-title>{{ task.title }}</mat-card-title>
            <mat-card-subtitle>
              Priority: {{ task.priority | titlecase }} | Status:
              {{ task.status | titlecase }} | Due:
              {{ task.dueDate | date : 'shortDate' }}
            </mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>{{ task.description }}</p>
          </mat-card-content>
          <mat-card-actions align="end">
            <button
              mat-icon-button
              color="primary"
              (click)="editTask(task)"
              aria-label="Edit task"
              *ngIf="isOwnerOrAdmin(task)"
            >
              <mat-icon>edit</mat-icon>
            </button>
            <button
              mat-icon-button
              color="accent"
              (click)="toggleComplete(task)"
              [disabled]="task.status === 'done' || !isOwnerOrAdmin(task)"
              aria-label="Mark as completed"
            >
              <mat-icon>check_circle</mat-icon>
            </button>
            <button
              mat-icon-button
              color="warn"
              (click)="deleteTask(task)"
              aria-label="Delete task"
              *ngIf="isOwnerOrAdmin(task)"
            >
              <mat-icon>delete</mat-icon>
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
      <ng-template #noTasks>
        <p class="no-tasks-message">
          No tasks found for the current user. Add one!
        </p>
      </ng-template>
    </div>
  `,
  styles: [
    `
      .task-list-container {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 1rem;
      }
      .filters {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
      }
      .task-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      .task-card {
        margin-bottom: 1rem;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        transition: box-shadow 0.3s ease-in-out;
      }
      .task-card:hover {
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
      }
      mat-card-header {
        padding-bottom: 0.5rem;
      }
      mat-card-title {
        font-size: 1.25rem;
        font-weight: 500;
      }
      mat-card-subtitle {
        font-size: 0.875rem;
        color: #666;
      }
      mat-card-content p {
        margin-bottom: 1rem;
        white-space: pre-wrap;
      }
      mat-card-actions {
        padding-top: 0.5rem;
        border-top: 1px solid #eee;
      }
      .no-tasks-message {
        text-align: center;
        padding: 2rem;
        font-style: italic;
        color: #888;
      }
    `,
  ],
})
export class TaskListComponent implements OnInit {
  private taskService = inject(TaskService);
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);
  private auth = inject(Auth);
  tasks: Task[] = [];
  userRole: 'admin' | 'user' | null = null;
  private roleLoaded = false;
  statusFilter = new FormControl('');
  sortBy = new FormControl('');

  ngOnInit(): void {
    this.loadUserRole().then(() => {
      this.loadTasks();
      this.subscribeToFilters();
    });
  }

  async loadUserRole(): Promise<void> {
    return new Promise((resolve) => {
      this.authService.getUserRole().subscribe((role) => {
        if (role === 'admin' || role === 'user' || role === null) {
          this.userRole = role;
          this.roleLoaded = true;
          console.log('User role loaded:', this.userRole);
          resolve();
        } else {
          console.error(`Invalid user role: ${role}`);
          this.roleLoaded = true;
          resolve();
        }
      });
    });
  }

  loadTasks(): void {
    if (!this.roleLoaded) {
      console.log('Waiting for role to load...');
      return;
    }
    const currentUser = this.auth.currentUser;
    if (currentUser) {
      console.log('Loading tasks for role:', this.userRole);
      const isAdmin = this.userRole === 'admin';
      this.taskService
        .getFilteredAndSortedTasks(
          isAdmin ? null : currentUser.uid,
          this.statusFilter.value as 'todo' | 'in_progress' | 'done' | null,
          this.sortBy.value as 'priority' | 'createdAt' | null,
          isAdmin
        )
        .subscribe((tasks) => {
          console.log('Tasks fetched:', tasks);
          this.tasks = tasks.sort(
            (a, b) =>
              new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
          );
        });
    }
  }

  subscribeToFilters(): void {
    this.statusFilter.valueChanges.subscribe(() => this.loadTasks());
    this.sortBy.valueChanges.subscribe(() => this.loadTasks());
  }

  isOwnerOrAdmin(task: Task): boolean {
    const currentUser = this.auth.currentUser;
    return !!(
      currentUser &&
      (this.userRole === 'admin' ||
        (task.assignedUsers && task.assignedUsers.includes(currentUser.uid)))
    );
  }

  async editTask(task: Task): Promise<void> {
    const { TaskFormComponent } = await import(
      '../task-form/task-form.component'
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

  toggleComplete(task: Task): void {
    if (!task.id || !this.isOwnerOrAdmin(task)) return;
    const newStatus: TaskStatus = task.status === 'done' ? 'todo' : 'done';
    const updatedTask: Partial<Task> = {
      status: newStatus,
      updatedAt: new Date(),
      completedAt: newStatus === 'done' ? new Date() : null,
    };
    this.taskService.updateTask(task.id, updatedTask).subscribe(() => {
      this.loadTasks();
    });
  }

  deleteTask(task: Task): void {
    if (!task.id || !this.isOwnerOrAdmin(task)) return;
    this.taskService.deleteTask(task.id).subscribe(() => {
      this.tasks = this.tasks.filter((t) => t.id !== task.id);
    });
  }
}
