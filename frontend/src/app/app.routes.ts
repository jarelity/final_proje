import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';
import { HomeComponent } from './pages/home.component';
import { SectionComponent } from './pages/section.component';
import { PostDetailComponent } from './pages/post-detail.component';
import { LoginComponent } from './pages/login.component';
import { AdminDashboardComponent } from './pages/admin-dashboard.component';
import { NotFoundComponent } from './pages/not-found.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'section/:section', component: SectionComponent },
  { path: 'post/:id', component: PostDetailComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminDashboardComponent, canActivate: [authGuard] },
  { path: '**', component: NotFoundComponent }
];
