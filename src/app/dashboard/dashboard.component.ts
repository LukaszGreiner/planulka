import { Component, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TaskFormComponent } from './task-form/task-form.component'; // Corrected path
import { TaskListComponent } from './task-list/task-list.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, TaskListComponent], // TaskListComponent is used in the template
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
    const dialogRef = this.dialog.open(TaskFormComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Potentially refresh task list or show a success message
        console.log('Task dialog closed, result:', result);
      }
    });
  }
}
