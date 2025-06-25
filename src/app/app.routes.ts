import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { ServicesComponent } from './pages/services/services.component';
import { AboutComponent } from './pages/about/about.component';
import { ReservationsComponent } from './pages/reservations/reservations.component';
import { authGuard } from './guards/auth.guard';
import { ProfileComponent } from './pages/profile/profile.component';
import { LoginComponent } from './pages/login/login.component';
import { SigninComponent } from './pages/signin/signin.component';

export const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
  },
  {
    path: 'services',
    component: ServicesComponent,
  },
  {
    path: 'about',
    component: AboutComponent,
  },
  {
    path: 'reservations',
    component: ReservationsComponent,
  },
  {
    path: 'profile',
    component: ProfileComponent, 
    canActivate: [authGuard],
  },
  { 
    path: 'login', 
    component: LoginComponent 
  }, 
  { 
    path: 'signup',
    component: SigninComponent
  }
];
