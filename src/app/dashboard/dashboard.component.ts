import { Component, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TaskFormComponent } from './task-form/task-form.component';
import { TaskListComponent } from './task-list/task-list.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, TaskListComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
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
