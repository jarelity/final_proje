import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../core/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  template: `
    <main class="container narrow">
      <section class="card">
        <h1>Yetkili Kullanıcı Girişi</h1>
        <p class="muted">Bu giriş ekranı blog içeriklerini yönetmek için kullanılır.</p>
        <p class="error" *ngIf="error">{{ error }}</p>
        <form (ngSubmit)="login()">
          <div class="form-row">
            <label>Kullanıcı Adı</label>
            <input name="username" [(ngModel)]="username" required>
          </div>
          <div class="form-row">
            <label>Şifre</label>
            <input name="password" type="password" [(ngModel)]="password" required>
          </div>
          <button type="submit">Giriş Yap</button>
        </form>
      </section>
    </main>
  `
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  login(): void {
    this.error = '';
    this.auth.login(this.username, this.password).subscribe({
      next: () => this.router.navigate(['/admin']),
      error: () => this.error = 'Kullanıcı adı veya şifre hatalı. Yetkili kullanıcı olduğundan emin ol.'
    });
  }
}
