import { Component, ViewEncapsulation, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth, authState, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class AppHeaderComponent {
  private auth = inject(Auth);
  private router = inject(Router);
  user$ = authState(this.auth);

  logout() {
    signOut(this.auth).then(() => {
      this.router.navigate(['/']);
    });
  }
}
