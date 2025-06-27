import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LandingComponent } from './pages/landing/landing.component';
import { SigninComponent } from './pages/signin/signin.component';
import { CatalogoComponent } from './pages/catalogo/catalogo.component';
import { ReservacionComponent } from './pages/reservacion/reservacion.component';
import { PerfilComponent } from './pages/perfil/perfil.component';

export const routes: Routes = [
    { path: '', redirectTo: 'landing', pathMatch: 'full' }, 
    { path: 'home', redirectTo: 'landing', pathMatch: 'full' },
    { path: 'landing', component: LandingComponent }, 
    { path: 'login', component: LoginComponent }, 
    { path: 'signup',component: SigninComponent},
    { path: 'services',component: CatalogoComponent},
    { path: 'reservacion', component: ReservacionComponent},
    { path: 'profile', component: PerfilComponent}
];