import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { LoginPageComponent } from './login-page/login-page.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    AsyncPipe,
    MatSlideToggleModule,
    LoginPageComponent,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'planulka';
  firestore: Firestore = inject(Firestore);
  items$: Observable<any[]>;

  constructor() {
    const aCollection = collection(this.firestore, 'tasks');
    this.items$ = collectionData(aCollection);
  }
}
