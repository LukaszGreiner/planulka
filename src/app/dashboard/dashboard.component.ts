import { Component, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TaskFormComponent } from './task-form/task-form.component';
import { TaskListComponent } from './task-list/task-list.component';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    TaskListComponent,
    MatNativeDateModule,
  ],
  template: `<div class="bg-[var(--surface-ground)] min-h-full relative">
    <button
      mat-fab
      (click)="openTaskDialog()"
      aria-label="Add new task"
      class="!bg-[var(--color-accent)] !text-white z-50 shadow-lg hover:!bg-opacity-90 !rounded-full"
      style="position: fixed; bottom: 32px; right: 32px;"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 0 24 24"
        width="24px"
        fill="currentColor"
      >
        <path d="M0 0h24v24H0V0z" fill="none" />
        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
      </svg>
    </button>

    <app-task-list></app-task-list>
  </div> `,
})
export class DashboardComponent {
  auth = inject(Auth);
  dialog = inject(MatDialog);

  get user() {
    return this.auth.currentUser;
  }

  openTaskDialog(): void {
    this.dialog.open(TaskFormComponent, {
      width: '400px',
    });
  }
}
