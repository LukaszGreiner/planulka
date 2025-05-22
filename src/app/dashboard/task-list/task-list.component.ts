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
import { TaskFilterPipe } from '../../pipes/task-filter.pipe';

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
    TaskFilterPipe,
  ],
  template: `
    <div class="task-list-container">
      <div class="filters">
        <mat-form-field appearance="fill">
          <mat-label>Sort by</mat-label>
          <mat-select [formControl]="sortBy">
            <mat-option value="">None</mat-option>
            <mat-option value="priority">Priority</mat-option>
            <mat-option value="createdAt">Creation Date</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Sort Order</mat-label>
          <mat-select [formControl]="sortOrder">
            <mat-option value="asc">Ascending</mat-option>
            <mat-option value="desc">Descending</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <div class="columns-container">
        <div class="task-column">
          <h2 class="column-title">To Do</h2>
          <div class="task-list">
            <mat-card
              *ngFor="let task of tasks | taskFilter : 'todo'"
              class="task-card"
            >
              <mat-card-header>
                <mat-card-title>{{ task.title }}</mat-card-title>
                <mat-card-subtitle>
                  Priority: {{ task.priority | titlecase }} | Due:
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
                  [color]="getStatusColor(task)"
                  (click)="toggleComplete(task)"
                  [disabled]="!isOwnerOrAdmin(task)"
                  aria-label="Toggle task status"
                >
                  <mat-icon>{{ getStatusIcon(task) }}</mat-icon>
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
            <p
              *ngIf="(tasks | taskFilter : 'todo').length === 0"
              class="no-tasks-message"
            >
              No tasks to do
            </p>
          </div>
        </div>

        <div class="task-column">
          <h2 class="column-title">In Progress</h2>
          <div class="task-list">
            <mat-card
              *ngFor="let task of tasks | taskFilter : 'in_progress'"
              class="task-card"
            >
              <mat-card-header>
                <mat-card-title>{{ task.title }}</mat-card-title>
                <mat-card-subtitle>
                  Priority: {{ task.priority | titlecase }} | Due:
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
                  [color]="getStatusColor(task)"
                  (click)="toggleComplete(task)"
                  [disabled]="!isOwnerOrAdmin(task)"
                  aria-label="Toggle task status"
                >
                  <mat-icon>{{ getStatusIcon(task) }}</mat-icon>
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
            <p
              *ngIf="(tasks | taskFilter : 'in_progress').length === 0"
              class="no-tasks-message"
            >
              No tasks in progress
            </p>
          </div>
        </div>

        <div class="task-column">
          <h2 class="column-title">Done</h2>
          <div class="task-list">
            <mat-card
              *ngFor="let task of tasks | taskFilter : 'done'"
              class="task-card"
            >
              <mat-card-header>
                <mat-card-title>{{ task.title }}</mat-card-title>
                <mat-card-subtitle>
                  Priority: {{ task.priority | titlecase }} | Due:
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
                  [color]="getStatusColor(task)"
                  (click)="toggleComplete(task)"
                  [disabled]="!isOwnerOrAdmin(task)"
                  aria-label="Toggle task status"
                >
                  <mat-icon>{{ getStatusIcon(task) }}</mat-icon>
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
            <p
              *ngIf="(tasks | taskFilter : 'done').length === 0"
              class="no-tasks-message"
            >
              No completed tasks
            </p>
          </div>
        </div>
      </div>
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

      .columns-container {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
        min-height: calc(100vh - 200px);
      }

      .task-column {
        background-color: #f5f5f5;
        border-radius: 8px;
        padding: 1rem;
        overflow-y: auto; /* Enable vertical scrolling */
        max-height: calc(
          100vh - 250px
        ); /* Prevent overflow beyond screen height */
      }

      .column-title {
        margin: 0 0 1rem 0;
        padding: 0.5rem;
        text-align: center;
        font-size: 1.25rem;
        font-weight: 500;
        border-bottom: 2px solid #e0e0e0;
      }

      .task-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        min-height: 100px;
      }

      .task-card {
        margin-bottom: 1rem;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        transition: box-shadow 0.3s ease-in-out;
        background-color: white;
      }

      .task-card:hover {
        box-shadow: none; /* Removed hover effect from task card */
      }

      mat-card-actions button {
        transition: transform 0.2s ease-in-out;
      }

      mat-card-actions button:hover {
        transform: scale(1.1); /* Added hover effect for task buttons */
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

      @media (max-width: 1024px) {
        .columns-container {
          grid-template-columns: 1fr;
        }
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
  sortOrder = new FormControl('asc');

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
          this.sortOrder.value as 'asc' | 'desc',
          isAdmin
        )
        .subscribe((tasks) => {
          console.log('Tasks fetched:', tasks);
          this.tasks = tasks;
        });
    }
  }

  subscribeToFilters(): void {
    this.statusFilter.valueChanges.subscribe(() => this.loadTasks());
    this.sortBy.valueChanges.subscribe(() => this.loadTasks());
    this.sortOrder.valueChanges.subscribe(() => this.loadTasks());
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
    const newStatus: TaskStatus =
      task.status === 'done'
        ? 'todo'
        : task.status === 'todo'
        ? 'in_progress'
        : task.status === 'in_progress'
        ? 'done'
        : 'todo';
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

  getStatusColor(task: Task): string {
    if (task.status === 'done') {
      return 'accent';
    } else if (task.status === 'in_progress') {
      return 'primary';
    } else {
      return 'warn';
    }
  }
  getStatusIcon(task: Task): string {
    if (task.status === 'done') {
      return 'task_alt';
    } else if (task.status === 'in_progress') {
      return 'pending_actions';
    } else {
      return 'radio_button_unchecked';
    }
  }
}
