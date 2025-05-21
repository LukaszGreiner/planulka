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
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css'],
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
      description: [task?.description || '', Validators.required],
      priority: [task?.priority || 'medium', Validators.required],
      status: [task?.status || 'todo', Validators.required],
      dueDate: [
        task?.dueDate ? new Date(task.dueDate) : new Date(),
        Validators.required,
      ],
      tags: [task?.tags?.join(', ') || ''], // Optional: if tags exist in Task model
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.taskForm.valid) {
      const currentUser = this.auth.currentUser;
      if (!currentUser) {
        console.error('User not logged in');
        return;
      }
      const formValue = this.taskForm.value;

      // Handle tags as an array (if applicable)
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
          assignedUsers: [currentUser.uid],
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
