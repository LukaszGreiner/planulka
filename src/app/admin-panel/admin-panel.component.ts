import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Task, TaskStatus } from '../models/task.model';
import { TaskService } from '../services/task.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Timestamp, deleteDoc, doc, setDoc } from '@angular/fire/firestore';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

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
    MatSelectModule,
    MatFormFieldModule,
    ReactiveFormsModule,
  ],
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css'],
})
export class AdminPanelComponent implements OnInit {
  private taskService = inject(TaskService);
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);
  private firestore = inject(Firestore);
  private router = inject(Router);
  userRole: 'admin' | 'user' | null = null;
  tasks: Task[] = [];
  users$!: Observable<UserProfile[]>;
  userMap: Record<string, string> = {};
  taskColumns: string[] = [
    'user',
    'title',
    'priority',
    'status',
    'dueDate',
    'actions',
  ];
  userColumns: string[] = ['email', 'role', 'actions'];
  statusFilter = new FormControl('');
  sortBy = new FormControl('');
  sortOrder = new FormControl('asc');
  userFilter = new FormControl('');

  ngOnInit(): void {
    this.authService.getUserRole().subscribe((role) => {
      this.userRole = role as 'admin' | 'user';
      if (this.userRole !== 'admin') {
        this.router.navigate(['/app']);
      } else {
        this.loadTasks();
        this.loadUsers();
        this.subscribeToFilters();
      }
    });
  }

  loadTasks(): void {
    const selectedUserId = this.userFilter.value || null;
    const status = this.statusFilter.value as
      | 'todo'
      | 'in_progress'
      | 'done'
      | null;
    const sortByField = this.sortBy.value as 'priority' | 'createdAt' | null;
    const sortDir = this.sortOrder.value as 'asc' | 'desc';
    this.taskService.getAllTasks().subscribe((tasks) => {
      let filtered = tasks;
      if (selectedUserId) {
        filtered = filtered.filter((t) =>
          t.assignedUsers?.includes(selectedUserId)
        );
      }
      if (status) {
        filtered = filtered.filter((t) => t.status === status);
      }
      if (sortByField) {
        const priorityWeights: Record<string, number> = {
          low: 1,
          medium: 2,
          high: 3,
        };
        filtered.sort((a, b) => {
          let cmp = 0;
          if (sortByField === 'priority') {
            cmp = priorityWeights[a.priority] - priorityWeights[b.priority];
          } else if (sortByField === 'createdAt') {
            cmp = (a.createdAt.getTime() || 0) - (b.createdAt.getTime() || 0);
          }
          return sortDir === 'asc' ? cmp : -cmp;
        });
      }
      this.tasks = filtered;
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
    // Populate map of user IDs to emails
    this.users$.subscribe((users) => {
      this.userMap = {};
      users.forEach((u) => (this.userMap[u.id] = u.email));
    });
  }

  subscribeToFilters(): void {
    this.statusFilter.valueChanges.subscribe(() => this.loadTasks());
    this.sortBy.valueChanges.subscribe(() => this.loadTasks());
    this.sortOrder.valueChanges.subscribe(() => this.loadTasks());
    this.userFilter.valueChanges.subscribe(() => this.loadTasks());
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
    const userDoc = doc(this.firestore, `users/${user.id}`);
    deleteDoc(userDoc).then(() => {
      this.loadUsers();
    });
  }
}
