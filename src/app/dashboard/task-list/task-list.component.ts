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
        background-color: var(
          --surface-ground
        ); /* Ensure container bg is themed */
        color: var(--color-text-primary); /* Ensure text color is themed */
      }

      .filters {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
        justify-content: center; /* Center the filters */
      }

      /* Styling for mat-form-field in filters */
      .filters mat-form-field .mat-mdc-text-field-wrapper {
        background-color: var(--surface-input) !important;
      }
      .filters mat-form-field .mat-mdc-floating-label {
        color: var(--color-text-secondary) !important;
      }
      .filters mat-form-field.mat-focused .mat-mdc-floating-label {
        color: var(--color-text-primary) !important;
      }
      .filters mat-form-field .mat-mdc-select-value-text {
        color: var(--color-text-primary) !important;
      }
      .filters mat-form-field .mat-mdc-select-arrow svg {
        fill: var(--color-text-secondary) !important;
      }
      .filters mat-form-field .mat-mdc-form-field-focus-overlay {
        background-color: transparent !important; /* Remove default focus overlay if not desired */
      }
      .filters mat-form-field .mdc-line-ripple::after {
        border-bottom-color: var(--color-accent) !important;
      }

      .columns-container {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
        min-height: calc(100vh - 200px);
      }

      .task-column {
        background-color: var(--surface-card);
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
        border-bottom: 2px solid var(--surface-border);
        color: var(--color-text-primary);
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
        background-color: var(--surface-dialog); /* Changed from white */
        color: var(--color-text-primary);
      }

      .task-card:hover {
        box-shadow: none; /* Removed hover effect from task card */
      }

      mat-card-actions button mat-icon {
        transition: color 0.2s ease-in-out; /* Smooth color transition for icons */
      }

      /* Edit button icon */
      mat-card-actions button[aria-label='Edit task'] mat-icon {
        color: var(--color-accent) !important;
      }

      /* Delete button icon */
      mat-card-actions button[aria-label='Delete task'] mat-icon {
        color: var(--color-error) !important;
      }

      /* Status toggle icons based on Angular Material theme palette on the button */
      /* For 'To Do' status (button has color='warn') */
      mat-card-actions button.mat-warn .mat-icon {
        color: var(--color-text-secondary) !important;
      }

      /* For 'In Progress' status (button has color='primary') */
      mat-card-actions button.mat-primary .mat-icon {
        color: var(--color-info) !important;
      }

      /* For 'Done' status (button has color='accent') */
      mat-card-actions button.mat-accent .mat-icon {
        color: var(--color-accent) !important;
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
        color: var(--color-text-primary);
      }

      mat-card-subtitle {
        font-size: 0.875rem;
        color: var(--color-text-secondary); /* Changed from #666 */
      }

      mat-card-content p {
        margin-bottom: 1rem;
        white-space: pre-wrap;
      }

      mat-card-actions {
        padding-top: 0.5rem;
        border-top: 1px solid var(--surface-border); /* Changed from #eee */
      }

      .no-tasks-message {
        text-align: center;
        padding: 2rem;
        font-style: italic;
        color: var(--color-text-secondary); /* Changed from #888 */
      }

      /* Specific styles for mat-select dropdown panel and options */
      ::ng-deep .mat-mdc-select-panel {
        background-color: var(--surface-dialog) !important;
      }
      ::ng-deep .mat-mdc-option {
        background-color: transparent !important;
        color: var(--color-text-primary) !important;
      }
      ::ng-deep .mat-mdc-option .mdc-list-item__primary-text {
        color: var(--color-text-primary) !important;
      }
      ::ng-deep .mat-mdc-option.mat-mdc-option-active,
      ::ng-deep .mat-mdc-option:focus:not(.mat-mdc-option-selected),
      ::ng-deep .mat-mdc-option:hover:not(.mat-mdc-option-selected) {
        background-color: var(--surface-hover) !important;
      }
      ::ng-deep
        .mat-mdc-option.mat-mdc-option-active
        .mdc-list-item__primary-text,
      ::ng-deep
        .mat-mdc-option:focus:not(.mat-mdc-option-selected)
        .mdc-list-item__primary-text,
      ::ng-deep
        .mat-mdc-option:hover:not(.mat-mdc-option-selected)
        .mdc-list-item__primary-text {
        color: var(--color-text-primary) !important;
      }
      /* Style for the checkmark of a selected mat-option to be orange */
      ::ng-deep
        .mat-mdc-option.mat-mdc-option-selected:not(.mat-mdc-option-multiple)
        .mat-pseudo-checkbox {
        background: transparent !important; /* Ensure no background on the box itself */
        border-color: transparent !important; /* Ensure no border on the box itself */
      }
      ::ng-deep
        .mat-mdc-option.mat-mdc-option-selected:not(.mat-mdc-option-multiple)
        .mat-pseudo-checkbox::after {
        /* This pseudo-element is the checkmark path */
        color: var(
          --color-accent
        ) !important; /* Make the checkmark icon orange */
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
