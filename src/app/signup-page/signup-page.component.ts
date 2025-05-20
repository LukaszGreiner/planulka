import { Component, inject } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
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
  selector: 'app-signup-page',
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
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.css'],
})
export class SignupPageComponent {
  private auth = inject(Auth);
  private router = inject(Router);

  email = '';
  password = '';
  repeatPassword = '';
  error: string | null = null;

  async signupWithEmail() {
    this.error = null;
    if (this.password !== this.repeatPassword) {
      this.error = 'Hasła nie są takie same';
      return;
    }
    try {
      await createUserWithEmailAndPassword(
        this.auth,
        this.email,
        this.password
      );
      this.router.navigate(['/app']);
    } catch (err: any) {
      this.error = err.message || 'Błąd rejestracji';
    }
  }

  async signupWithGoogle() {
    this.error = null;
    try {
      await signInWithPopup(this.auth, new GoogleAuthProvider());
      this.router.navigate(['/app']);
    } catch (err: any) {
      this.error = err.message || 'Błąd rejestracji przez Google';
    }
  }
}
