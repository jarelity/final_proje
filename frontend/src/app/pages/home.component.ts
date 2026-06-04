import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../core/api.service';
import { AboutProfile, BlogPost, Section } from '../models/content.models';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  template: `
    <main class="container">
      <section class="hero card">
        <div>
          <p class="eyebrow">Kişisel Blog Web Sitesi</p>
          <h1>{{ about?.full_name || 'Kişisel Blog' }}</h1>
          <p class="hero-text">{{ about?.description || 'Birçok bilgi, araştırmalar, hobiler ve kitap notları bu blogda paylaşılır.' }}</p>
          <div class="actions">
            <a class="button" routerLink="/section/TECHNICAL">Çektiğim Fotoğraflar</a>
            <a class="button secondary" routerLink="/login">Yetkili Giriş</a>
          </div>
        </div>
        <img *ngIf="about?.photo_url" [src]="about?.photo_url" alt="Profil fotoğrafı" class="profile-photo">
      </section>

      <section class="card" *ngIf="about">
        <h2>Hakkımda</h2>
        <div class="info-grid">
          <p><strong>Yaş:</strong> {{ about.age }}</p>
          <p><strong>Şehir:</strong> {{ about.city }}</p>
          <p><strong>Meslek:</strong> {{ about.profession }}</p>
          <p><strong>LinkedIn:</strong> <a [href]="about.linkedin_url" target="_blank">Profil</a></p>
          <p><strong>GitHub:</strong> <a [href]="about.github_url" target="_blank">Profil</a></p>
        </div>
      </section>

      <section class="section-title">
        <h2>Son İçerikler</h2>
        <p>Normal kullanıcı bu içerikleri okuyabilir; düzenleme işlemleri sadece yetkili kullanıcı panelinden yapılır.</p>
      </section>

      <section class="post-grid">
        <article class="post-card" *ngFor="let post of posts">
          <img *ngIf="post.image_url" [src]="post.image_url" [alt]="post.title">
          <div>
            <span class="badge">{{ post.section_label }}</span>
            <h3>{{ post.title }}</h3>
            <p>{{ post.summary }}</p>
            <a [routerLink]="['/post', post.id]">Devamını oku</a>
          </div>
        </article>
      </section>
    </main>
  `
})
export class HomeComponent implements OnInit {
  about: AboutProfile | null = null;
  sections: Section[] = [];
  posts: BlogPost[] = [];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getAboutCurrent().subscribe(data => this.about = data);
    this.api.getSections().subscribe(data => this.sections = data);
    this.api.getPosts({ published: true }).subscribe(data => this.posts = data);
  }
}
