import { Component, OnInit, Output, EventEmitter, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  standalone: true,
  imports: [ReactiveFormsModule],
})
export class TaskFormComponent implements OnInit {
  @Output() taskCreated = new EventEmitter<any>();
  taskForm: FormGroup;
  private firestore = inject(Firestore);

  constructor(private fb: FormBuilder) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      priority: ['low', Validators.required],
      dueDate: ['', Validators.required],
      tags: [''],
      assignedUsers: [''],
    });
  }

  ngOnInit(): void {}

  async onSubmit(): Promise<void> {
    if (this.taskForm.valid) {
      const formValue = this.taskForm.value;
      const task = {
        title: formValue.title,
        description: formValue.description,
        priority: formValue.priority,
        status: 'todo',
        dueDate: new Date(formValue.dueDate),
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: formValue.tags
          ? formValue.tags.split(',').map((tag: string) => tag.trim())
          : [],
        assignedUsers: formValue.assignedUsers
          ? formValue.assignedUsers
              .split(',')
              .map((user: string) => user.trim())
          : [],
        attachments: [],
        completedAt: null,
      };
      await addDoc(collection(this.firestore, 'tasks'), task);
      this.taskCreated.emit(task);
      this.taskForm.reset({ priority: 'low' });
    }
  }

  onCancel(): void {
    this.taskForm.reset({
      priority: 'low',
    });
  }
}
