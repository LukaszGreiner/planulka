import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { Auth, signOut } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AppHeaderComponent } from './app-header/app-header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    AppHeaderComponent,
    RouterOutlet,
    MatSlideToggleModule,
    MatToolbarModule,
    MatIconModule,
    CommonModule,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'planulka';
  firestore: Firestore = inject(Firestore);
  auth: Auth = inject(Auth);
  router = inject(Router);
  items$: Observable<any[]>;

  constructor() {
    const aCollection = collection(this.firestore, 'tasks');
    this.items$ = collectionData(aCollection);
  }

  get user() {
    return this.auth.currentUser;
  }

  async logout() {
    await signOut(this.auth);
    window.location.reload();
  }

  goToLogin() {
    this.router.navigate(['/auth/login']);
  }
}
