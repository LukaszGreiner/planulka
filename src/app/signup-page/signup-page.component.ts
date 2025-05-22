import { Component, inject, OnInit } from '@angular/core';
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
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';

// Custom validator function to check if passwords match
export function passwordsMatchValidator(
  control: AbstractControl
): ValidationErrors | null {
  const password = control.get('password');
  const repeatPassword = control.get('repeatPassword');
  return password && repeatPassword && password.value !== repeatPassword.value
    ? { passwordsMismatch: true }
    : null;
}

@Component({
  selector: 'app-signup-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule, // Added ReactiveFormsModule
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
  ],
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.css'],
})
export class SignupPageComponent implements OnInit {
  hidePassword: boolean = true;
  hideRepeatPassword: boolean = true;
  private auth = inject(Auth);
  private router = inject(Router);
  private fb = inject(FormBuilder); // Injected FormBuilder

  signupForm!: FormGroup; // Defined signupForm
  error: string | null = null;

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
  toggleRepeatPasswordVisibility(): void {
    this.hideRepeatPassword = !this.hideRepeatPassword;
  }

  ngOnInit(): void {
    this.signupForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        repeatPassword: ['', [Validators.required]],
      },
      { validators: passwordsMatchValidator } // Added custom validator to the group
    );
  }

  async signupWithEmail() {
    this.error = null;
    if (this.signupForm.invalid) {
      // Mark all fields as touched to display errors
      this.signupForm.markAllAsTouched();
      // Check for specific password mismatch error
      if (
        this.signupForm.errors?.['passwordsMismatch'] &&
        (this.signupForm.get('password')?.touched ||
          this.signupForm.get('repeatPassword')?.touched)
      ) {
        this.error = 'Hasła nie są takie same.';
      } else {
        // Generic error if form is invalid for other reasons
        this.error = 'Proszę poprawnie wypełnić wszystkie pola.';
      }
      return;
    }

    const { email, password } = this.signupForm.value;
    try {
      await createUserWithEmailAndPassword(this.auth, email, password);
      this.router.navigate(['/app']);
    } catch (err: any) {
      this.error = err.message || 'Błąd rejestracji';
      if (err.code === 'auth/email-already-in-use') {
        this.error = 'Ten adres email jest już zajęty.';
        this.signupForm.get('email')?.setErrors({ emailInUse: true });
      }
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
