import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../core/api.service';
import { BlogPost, Category, Section } from '../models/content.models';

@Component({
  standalone: true,
  selector: 'app-section',
  imports: [CommonModule, RouterLink],
  template: `
    <main class="container">
      <section class="section-title">
        <h1>{{ sectionLabel }}</h1>
        <p>Bu bölümdeki yayınlanmış blog içerikleri listelenir.</p>
      </section>

      <div class="category-list" *ngIf="categories.length">
        <button class="chip" [class.active]="selectedCategory === null" (click)="filterByCategory(null)">Tümü</button>
        <button class="chip" *ngFor="let category of categories" [class.active]="selectedCategory === category.id" (click)="filterByCategory(category.id || null)">
          {{ category.name }}
        </button>
      </div>

      <section class="post-grid">
        <article class="post-card" *ngFor="let post of posts">
          <img *ngIf="post.image_url" [src]="post.image_url" [alt]="post.title">
          <div>
            <span class="badge">{{ post.category_name || post.section_label }}</span>
            <h3>{{ post.title }}</h3>
            <p>{{ post.summary }}</p>
            <a [routerLink]="['/post', post.id]">Devamını oku</a>
          </div>
        </article>
      </section>

      <p class="muted" *ngIf="!posts.length">Bu bölümde henüz yayınlanmış içerik yok.</p>
    </main>
  `
})
export class SectionComponent implements OnInit {
  section = '';
  sectionLabel = '';
  selectedCategory: number | null = null;
  posts: BlogPost[] = [];
  categories: Category[] = [];
  sections: Section[] = [];

  constructor(private route: ActivatedRoute, private api: ApiService) {}

  ngOnInit(): void {
    this.api.getSections().subscribe(sections => {
      this.sections = sections;
      this.route.paramMap.subscribe(params => {
        this.section = params.get('section') || 'TECHNICAL';
        this.sectionLabel = this.sections.find(s => s.value === this.section)?.label || this.section;
        this.selectedCategory = null;
        this.loadCategories();
        this.loadPosts();
      });
    });
  }

  filterByCategory(categoryId: number | null): void {
    this.selectedCategory = categoryId;
    this.loadPosts();
  }

  private loadCategories(): void {
    this.api.getCategories(this.section).subscribe(data => this.categories = data);
  }

  private loadPosts(): void {
    this.api.getPosts({ section: this.section, category: this.selectedCategory, published: true }).subscribe(data => this.posts = data);
  }
}
