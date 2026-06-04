import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './core/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="site-header">
      <nav class="nav container">
        <a routerLink="/" class="brand">Kişisel Blog</a>
        <div class="nav-links">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Ana Sayfa</a>
          <a routerLink="/section/TECHNICAL" routerLinkActive="active">Çektiğim Fotoğraflar</a>
          <a routerLink="/section/NON_TECHNICAL" routerLinkActive="active">Gereksiz bilgiler</a>
          <a routerLink="/section/RESEARCH" routerLinkActive="active">Araştırmalarım</a>
          <a routerLink="/section/HOBBIES" routerLinkActive="active">Hobilerim</a>
          <a routerLink="/section/BOOKS" routerLinkActive="active">Kitaplar</a>
          <a *ngIf="auth.isLoggedIn()" routerLink="/admin" routerLinkActive="active">Yönetim</a>
          <a *ngIf="!auth.isLoggedIn()" routerLink="/login" routerLinkActive="active">Yetkili Giriş</a>
          <button *ngIf="auth.isLoggedIn()" class="link-button" (click)="logout()">Çıkış</button>
        </div>
      </nav>
    </header>
    <router-outlet></router-outlet>
    <footer class="footer">
      <div class="container">© 2026 Kişisel Blog Web Sitesi</div>
    </footer>
  `
})
export class AppComponent {
  constructor(public auth: AuthService) {}
  logout(): void { this.auth.logout(); location.href = '/'; }
}
