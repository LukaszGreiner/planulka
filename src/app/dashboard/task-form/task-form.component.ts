import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
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
import { MatIconModule } from '@angular/material/icon';
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
    MatIconModule,
  ],
  template: `
    <h2 mat-dialog-title class="!text-[var(--color-text-primary)]">
      {{ isEditMode ? 'Edytuj zadanie' : 'Dodaj nowe zadanie' }}
    </h2>
    <form [formGroup]="taskForm" (ngSubmit)="onSubmit()">
      <mat-dialog-content
        class="!bg-[var(--surface-dialog)] !text-[var(--color-text-primary)] overflow-scroll"
      >
        <mat-form-field appearance="fill" class="w-full mb-4">
          <mat-label class="!text-[var(--color-text-secondary)]"
            >Nazwa zadania</mat-label
          >
          <input
            matInput
            formControlName="title"
            class="!text-[var(--color-text-primary)]"
          />
        </mat-form-field>

        <mat-form-field appearance="fill" class="w-full mb-4">
          <mat-label class="!text-[var(--color-text-secondary)]"
            >Opis</mat-label
          >
          <textarea
            matInput
            formControlName="description"
            class="!text-[var(--color-text-primary)]"
          ></textarea>
        </mat-form-field>

        <mat-form-field appearance="fill" class="w-full mb-4">
          <mat-label class="!text-[var(--color-text-secondary)]"
            >Priorytet</mat-label
          >
          <mat-select
            formControlName="priority"
            class="!text-[var(--color-text-primary)]"
          >
            <mat-option *ngFor="let p of priorities" [value]="p">
              {{ priorityLabels[p] }}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="fill" class="w-full mb-4">
          <mat-label class="!text-[var(--color-text-secondary)]"
            >Status</mat-label
          >
          <mat-select
            formControlName="status"
            class="!text-[var(--color-text-primary)]"
          >
            <mat-option *ngFor="let s of statuses" [value]="s">
              {{ statusLabels[s] }}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="fill" class="w-full mb-4">
          <mat-label class="!text-[var(--color-text-secondary)]"
            >Data wykonania</mat-label
          >
          <input
            matInput
            [matDatepicker]="picker"
            formControlName="dueDate"
            class="!text-[var(--color-text-primary)]"
          />
          <mat-datepicker-toggle
            matSuffix
            [for]="picker"
            class="!text-[var(--color-accent)]"
          ></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>

        <div formArrayName="attachments" class="mb-4">
          <h3 class="mb-2 text-[var(--color-text-secondary)]">Załączniki</h3>
          <div
            *ngFor="
              let attachment of attachmentsFormArray.controls;
              let i = index
            "
            class="flex gap-2 mb-2"
          >
            <mat-form-field appearance="fill" class="flex-grow">
              <mat-label class="!text-[var(--color-text-secondary)]"
                >Link do załącznika</mat-label
              >
              <input
                matInput
                [formControlName]="i"
                placeholder="https://example.com"
              />
              <mat-error *ngIf="attachment.errors?.['pattern']">
                Nieprawidłowy format URL. Link musi zaczynać się od http:// lub
                https://
              </mat-error>
            </mat-form-field>
            <button
              type="button"
              mat-icon-button
              color="warn"
              (click)="removeAttachment(i)"
            >
              <mat-icon>delete</mat-icon>
            </button>
          </div>
          <button
            type="button"
            mat-stroked-button
            color="primary"
            (click)="addAttachment()"
          >
            <mat-icon>add</mat-icon> Dodaj załącznik
          </button>
        </div>
      </mat-dialog-content>

      <div mat-dialog-actions class="!bg-[var(--surface-dialog)]">
        <button
          mat-button
          type="button"
          (click)="onCancel()"
          class="!text-[var(--color-text-secondary)] hover:!bg-[var(--surface-hover)]"
        >
          Anuluj
        </button>
        <button
          mat-raised-button
          type="submit"
          [disabled]="!taskForm.valid"
          class="!bg-[var(--color-accent)] !text-[var(--color-accent-contrast)] hover:!bg-opacity-90 disabled:!bg-[var(--color-accent-disabled)]"
        >
          {{ isEditMode ? 'Zapisz zmiany' : 'Dodaj zadanie' }}
        </button>
      </div>
    </form>
  `,
  styles: [
    `
      /* Ensure dialog takes theme variables */
      :host {
        display: block;
        /* background-color: var(--surface-dialog); Dialog itself is styled via ::ng-deep */
        color: var(--color-text-primary);
      }

      /* Dialog container and surface */
      ::ng-deep .mat-mdc-dialog-container .mdc-dialog__surface {
        background-color: var(--surface-dialog) !important;
        color: var(--color-text-primary) !important;
      }

      /* Input Background & Text Color */
      .mat-mdc-form-field
        .mdc-text-field--filled:not(.mdc-text-field--disabled) {
        background-color: var(--surface-input) !important;
      }
      .mat-mdc-input-element {
        color: var(--color-text-primary) !important;
      }
      /* Text color for the selected value in a mat-select */
      .mat-mdc-select-value-text {
        color: var(--color-text-primary) !important;
      }

      /* Label Colors */
      .mat-mdc-form-field .mdc-floating-label {
        color: var(--color-text-secondary) !important;
      }
      .mat-mdc-form-field.mat-focused .mdc-floating-label {
        color: var(
          --color-text-primary
        ) !important; /* Changed from accent to primary for contrast */
      }
      .mat-mdc-form-field .mdc-text-field--filled .mdc-line-ripple::after {
        border-bottom-color: var(
          --color-accent
        ) !important; /* Ripple remains accent */
      }

      /* MatSelect Dropdown Panel and Options */
      ::ng-deep .mat-mdc-select-panel {
        background-color: var(--surface-dialog) !important;
      }
      .mat-mdc-option {
        background-color: transparent !important;
        color: var(--color-text-primary) !important;
      }
      .mat-mdc-option .mdc-list-item__primary-text {
        color: var(--color-text-primary) !important;
      }
      /* Hover/Active state for options */
      .mat-mdc-option.mat-mdc-option-active,
      .mat-mdc-option:focus:not(.mat-mdc-option-selected),
      .mat-mdc-option:hover:not(.mat-mdc-option-selected) {
        background-color: var(--surface-hover) !important;
      }
      .mat-mdc-option.mat-mdc-option-active .mdc-list-item__primary-text,
      .mat-mdc-option:focus:not(.mat-mdc-option-selected)
        .mdc-list-item__primary-text,
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

      /* Select arrow color */
      .mat-mdc-select-arrow svg {
        fill: var(--color-text-secondary) !important;
      }

      /* Datepicker toggle icon color */
      .mat-datepicker-toggle .mat-icon {
        color: var(--color-accent) !important;
      }
      ::ng-deep .mat-datepicker-content {
        background-color: var(--surface-dialog) !important;
        color: var(
          --color-text-primary
        ) !important; /* Ensure default text color for content */
        border: 1px solid var(--surface-border) !important; /* Add border to datepicker popup */
      }
      ::ng-deep .mat-calendar-header {
        background-color: var(
          --surface-dialog
        ) !important; /* Match dialog background */
        padding: 0.5rem 0; /* Adjust padding as needed */
      }
      ::ng-deep
        .mat-calendar-controls
        .mat-calendar-period-button
        .mdc-button__label,
      ::ng-deep .mat-calendar-controls .mat-calendar-arrow {
        color: var(--color-text-primary) !important;
        fill: var(--color-text-primary) !important;
      }
      ::ng-deep .mat-calendar-table-header th {
        /* Day of the week labels */
        color: var(--color-text-secondary) !important;
      }
      ::ng-deep .mat-calendar-body-label,
      ::ng-deep .mat-calendar-table-header,
      ::ng-deep .mat-calendar-date,
      ::ng-deep .mat-calendar-body-cell-content,
      ::ng-deep .mat-date-range-input-separator {
        color: var(--color-text-primary) !important;
      }
      ::ng-deep
        .mat-calendar-body-cell:not(.mat-calendar-body-disabled)
        .mat-calendar-body-cell-content:hover {
        background-color: var(--surface-hover) !important;
      }
      ::ng-deep
        .mat-calendar-body-today:not(.mat-calendar-body-selected)
        .mat-calendar-body-cell-content {
        border-color: var(
          --color-text-secondary
        ) !important; /* Subtle border for today */
      }
      ::ng-deep .mat-calendar-arrow {
        fill: var(--color-text-primary) !important;
      }
      ::ng-deep .mat-calendar-body-selected {
        background-color: var(--color-accent) !important;
        color: var(--color-accent-contrast) !important;
      }
      ::ng-deep
        .mat-calendar-body-active
        > .mat-calendar-body-cell-content:not(.mat-calendar-body-selected) {
        background-color: var(--surface-hover) !important;
      }

      /* Dialog Actions */
      div[mat-dialog-actions] {
        justify-content: flex-end;
        padding: 8px 24px 24px 24px;
        border-top: 1px solid var(--surface-border); /* Optional: add a separator */
      }

      /* Scrollbar styling */
      mat-dialog-content {
        overflow: hidden !important; /* Force hide overflow */
        -ms-overflow-style: none !important; /* IE and Edge */
        scrollbar-width: none !important; /* Firefox */
      }
      mat-dialog-content::-webkit-scrollbar {
        display: none !important; /* Hide webkit scrollbar */
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

  priorityLabels: Record<TaskPriority, string> = {
    low: 'Niski',
    medium: 'Średni',
    high: 'Wysoki',
  };
  statusLabels: Record<TaskStatus, string> = {
    todo: 'Do zrobienia',
    in_progress: 'W trakcie',
    done: 'Zrobione',
  };

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
      attachments: this.fb.array([]),
    });

    // Initialize attachments with URL validation
    if (task?.attachments?.length) {
      task.attachments.forEach((url) => {
        this.attachmentsFormArray.push(
          this.fb.control(url, [Validators.pattern('https?://.*')])
        );
      });
    }
  }

  ngOnInit(): void {
    // Initialization logic if needed
  }

  get attachmentsFormArray(): FormArray {
    return this.taskForm.get('attachments') as FormArray;
  }

  addAttachment(): void {
    this.attachmentsFormArray.push(
      this.fb.control('', [Validators.pattern('https?://.*')])
    );
  }

  removeAttachment(index: number): void {
    this.attachmentsFormArray.removeAt(index);
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
      const attachments = formValue.attachments
        ? formValue.attachments
            .filter((link: string) => link.trim())
            .map((link: string) => link.trim())
        : [];

      if (this.isEditMode && this.data?.taskToEdit?.id) {
        const updatedTask: Partial<Task> = {
          ...formValue,
          tags,
          attachments,
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
          attachments,
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
