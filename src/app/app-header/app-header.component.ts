import { Component, ViewEncapsulation, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth, authState, signOut } from '@angular/fire/auth';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-header',
  template: `
    <div class="flex flex-1 items-center gap-2 px-4">
      <img
        src="icons/android-chrome-192x192.png"
        alt="logo"
        class="h-16 w-16 py-1"
      />
      <span class="text-4xl font-bold">Planulka</span>
      <div class="ml-auto flex gap-2">
        <button
          *ngIf="(user$ | async) && userRole === 'admin'"
          (click)="toggleView()"
          class="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer"
          [ngClass]="{ 'bg-blue-700': isAdminPanelRoute }"
        >
          {{ isAdminPanelRoute ? 'Dashboard' : 'Panel Admina' }}
        </button>
        <button
          *ngIf="user$ | async"
          (click)="logout()"
          class="px-4 py-2 bg-red-600 text-white rounded cursor-pointer"
        >
          Logout
        </button>
      </div>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class AppHeaderComponent {
  private auth = inject(Auth);
  private router = inject(Router);
  private authService = inject(AuthService);
  user$ = authState(this.auth);
  userRole: string | null = null;
  isAdminPanelRoute: boolean = false;

  constructor() {
    this.authService.getUserRole().subscribe((role) => {
      this.userRole = role;
    });

    // Subscribe to router events to detect the current route
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.isAdminPanelRoute = event.url === '/admin';
      });
  }

  logout() {
    signOut(this.auth).then(() => {
      this.router.navigate(['/']);
    });
  }

  toggleView() {
    if (this.isAdminPanelRoute) {
      this.router.navigate(['/app']);
    } else {
      this.router.navigate(['/admin']);
    }
  }
}
