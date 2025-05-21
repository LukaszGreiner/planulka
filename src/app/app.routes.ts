import { Routes } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { SignupPageComponent } from './signup-page/signup-page.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard'; // Import adminGuard
import { AdminPanelComponent } from './admin-panel/admin-panel.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'auth/login', component: LoginPageComponent },
  { path: 'auth/register', component: SignupPageComponent },
  { path: 'app', component: DashboardComponent, canActivate: [authGuard] },
  {
    path: 'admin',
    component: AdminPanelComponent,
    canActivate: [authGuard, adminGuard],
  },
  { path: '**', component: PageNotFoundComponent },
];
