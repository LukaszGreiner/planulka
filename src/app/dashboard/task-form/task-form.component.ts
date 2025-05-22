import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { TaskService } from '../../services/task.service';
import { Task, TaskPriority, TaskStatus } from '../../models/task.model';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatDialogModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ isEditMode ? 'Edit Task' : 'Add New Task' }}</h2>
    <form [formGroup]="taskForm" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <mat-form-field appearance="fill">
          <mat-label>Title</mat-label>
          <input matInput formControlName="title" />
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description"></textarea>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Priority</mat-label>
          <mat-select formControlName="priority">
            <mat-option *ngFor="let priority of priorities" [value]="priority">
              {{ priority | titlecase }}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Status</mat-label>
          <mat-select formControlName="status">
            <mat-option *ngFor="let status of statuses" [value]="status">
              {{ status | titlecase }}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Due Date</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="dueDate" />
          <mat-datepicker-toggle
            matSuffix
            [for]="picker"
          ></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>
      </mat-dialog-content>

      <div mat-dialog-actions>
        <button mat-button type="button" (click)="onCancel()">Cancel</button>
        <button
          mat-raised-button
          color="primary"
          type="submit"
          [disabled]="!taskForm.valid"
        >
          {{ isEditMode ? 'Save Changes' : 'Create Task' }}
        </button>
      </div>
    </form>
  `,
  styles: [
    `
      mat-form-field {
        width: 100%;
        margin-bottom: 1rem;
      }

      div[mat-dialog-actions] {
        justify-content: flex-end;
      }

      /* Hide scrollbar for Chrome, Safari and Opera */
      mat-dialog-content::-webkit-scrollbar {
        display: none;
      }

      /* Hide scrollbar for IE, Edge and Firefox */
      mat-dialog-content {
        -ms-overflow-style: none; /* IE and Edge */
        scrollbar-width: none; /* Firefox */
      }

      textarea::-webkit-scrollbar {
        display: none;
      }

      textarea {
        -ms-overflow-style: none; /* IE and Edge */
        scrollbar-width: none; /* Firefox */
      }
    `,
  ],
})
export class TaskFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private taskService = inject(TaskService);
  private auth = inject(Auth);
  dialogRef = inject(MatDialogRef<TaskFormComponent>);
  data: { taskToEdit?: Task } = inject(MAT_DIALOG_DATA, { optional: true });

  taskForm: FormGroup;
  priorities: TaskPriority[] = ['low', 'medium', 'high'];
  statuses: TaskStatus[] = ['todo', 'in_progress', 'done'];
  isEditMode = false;

  constructor() {
    this.isEditMode = !!this.data?.taskToEdit;
    const task = this.data?.taskToEdit;

    this.taskForm = this.fb.group({
      title: [task?.title || '', Validators.required],
      description: [task?.description || ''],
      priority: [task?.priority || 'low', Validators.required],
      status: [task?.status || 'todo', Validators.required],
      dueDate: [task?.dueDate ? new Date(task.dueDate) : null],
      tags: [task?.tags?.join(', ') || ''],
    });
  }

  ngOnInit(): void {
    // Initialization logic if needed
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      const currentUser = this.auth.currentUser;
      if (!currentUser) {
        console.error('User not logged in');
        return;
      }
      const formValue = this.taskForm.value;

      const tags = formValue.tags
        ? formValue.tags.split(',').map((tag: string) => tag.trim())
        : [];

      if (this.isEditMode && this.data?.taskToEdit?.id) {
        const updatedTask: Partial<Task> = {
          ...formValue,
          tags,
          updatedAt: new Date(),
        };
        this.taskService
          .updateTask(this.data.taskToEdit.id, updatedTask)
          .subscribe({
            next: () => {
              console.log('Task updated successfully');
              this.dialogRef.close(true);
            },
            error: (err: any) => console.error('Error updating task: ', err),
          });
      } else {
        const newTask: Task = {
          ...formValue,
          tags,
          createdAt: new Date(),
          updatedAt: new Date(),
          status: 'todo',
          assignedUsers: [currentUser.uid],
          completedAt: null,
        };
        this.taskService.addTask(newTask).subscribe({
          next: (taskId: string) => {
            console.log('Task added with ID: ', taskId);
            this.dialogRef.close(true);
          },
          error: (err: any) => console.error('Error adding task: ', err),
        });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
