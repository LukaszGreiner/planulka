import { Component, inject } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from '@angular/fire/auth';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
  ],
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent {
  private auth = inject(Auth);
  private router = inject(Router);

  email = '';
  password = '';
  error: string | null = null;

  async loginWithEmail() {
    this.error = null;
    try {
      await signInWithEmailAndPassword(this.auth, this.email, this.password);
      this.router.navigate(['/app']);
    } catch (err: any) {
      this.error = err.message || 'Błąd logowania';
    }
  }

  async loginWithGoogle() {
    this.error = null;
    try {
      await signInWithPopup(this.auth, new GoogleAuthProvider());
      this.router.navigate(['/app']);
    } catch (err: any) {
      this.error = err.message || 'Błąd logowania przez Google';
    }
  }
}
