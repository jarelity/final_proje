import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../core/api.service';
import { BlogPost } from '../models/content.models';

@Component({
  standalone: true,
  selector: 'app-post-detail',
  imports: [CommonModule, RouterLink],
  template: `
    <main class="container narrow" *ngIf="post">
      <a routerLink="/" class="back-link">← Ana sayfaya dön</a>
      <article class="card article-detail">
        <img *ngIf="post.image_url" [src]="post.image_url" [alt]="post.title">
        <span class="badge">{{ post.section_label }} / {{ post.category_name || 'Genel' }}</span>
        <h1>{{ post.title }}</h1>
        <p class="muted">{{ post.created_at | date:'dd.MM.yyyy HH:mm' }}</p>
        <p class="lead">{{ post.summary }}</p>
        <div class="content">{{ post.content }}</div>
      </article>
    </main>
  `
})
export class PostDetailComponent implements OnInit {
  post: BlogPost | null = null;

  constructor(private route: ActivatedRoute, private api: ApiService) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.api.getPost(id).subscribe(data => this.post = data);
  }
}
