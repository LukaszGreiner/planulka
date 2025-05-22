import { Pipe, PipeTransform } from '@angular/core';
import { Task, TaskStatus } from '../models/task.model';

@Pipe({
  name: 'taskFilter',
  standalone: true,
})
export class TaskFilterPipe implements PipeTransform {
  transform(tasks: Task[], status: TaskStatus): Task[] {
    if (!tasks || !status) {
      return tasks;
    }
    return tasks.filter((task) => task.status === status);
  }
}
