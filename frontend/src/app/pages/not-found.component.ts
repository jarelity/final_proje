import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <main class="container narrow">
      <section class="card">
        <h1>Sayfa bulunamadı</h1>
        <p>Aradığın sayfa mevcut değil.</p>
        <a routerLink="/">Ana sayfaya dön</a>
      </section>
    </main>
  `
})
export class NotFoundComponent {}
