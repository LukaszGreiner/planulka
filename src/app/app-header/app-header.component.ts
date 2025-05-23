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
    <header
      class="bg-[var(--surface-card)] border-b-[var(--surface-border)] border-b-1 flex items-center justify-between shadow-md h-16 px-4 lg:px-8 w-full z-1 absolute"
    >
      <div class="flex items-center gap-2">
        <span
          class="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)] cursor-default"
          >Planulka</span
        >
      </div>
      <nav class="flex gap-2 md:gap-4">
        <button
          *ngIf="(user$ | async) && userRole === 'admin'"
          (click)="toggleView()"
          class="app-header-button cursor-pointer"
          [class.active]="isAdminPanelRoute"
        >
          {{ isAdminPanelRoute ? 'Lista zadań' : 'Panel Admina' }}
        </button>
        <button
          *ngIf="user$ | async"
          (click)="logout()"
          class="app-header-button logout-button cursor-pointer"
        >
          Logout
        </button>
      </nav>
    </header>
  `,
  styles: [
    `
      .app-header-button {
        padding: 0.5rem 1rem;
        border-radius: 0.375rem; /* rounded-md */
        font-weight: 500; /* medium */
        color: var(--color-text-primary);
        background-color: var(--surface-ground);
        transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
        border: 1px solid var(--surface-border);
      }

      .app-header-button:hover {
        background-color: var(--surface-hover);
        color: var(--color-accent);
      }

      .app-header-button.active {
        background-color: var(--color-accent);
        color: var(--color-accent-contrast);
        border-color: var(--color-accent);
      }

      .app-header-button.logout-button {
        background-color: var(--color-error);
        color: var(--color-primary-contrast);
        border-color: var(--color-error);
      }

      .app-header-button.logout-button:hover {
        background-color: var(--surface-hover);
        color: var(--color-error);
        border-color: var(--color-error);
      }

      /* Responsive adjustments */
      @media (max-width: 640px) {
        /* sm breakpoint */
        .app-header-container {
          padding-left: 0.5rem;
          padding-right: 0.5rem;
        }
        .app-header-button {
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem; /* text-sm */
        }
        .flex.items-center.gap-2 > span {
          font-size: 1.25rem; /* text-xl for Planulka text */
        }
        .flex.items-center.gap-2 > img {
          height: 2rem; /* h-8 */
          width: 2rem; /* w-8 */
        }
      }
    `,
  ],
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
