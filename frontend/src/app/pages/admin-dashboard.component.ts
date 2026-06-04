import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../core/api.service';
import { AuthService } from '../core/auth.service';
import { AboutProfile, BlogPost, Category, Section } from '../models/content.models';

@Component({
  standalone: true,
  selector: 'app-admin-dashboard',
  imports: [CommonModule, FormsModule],
  template: `
    <main class="container">
      <section class="section-title">
        <h1>Yetkili Kullanıcı Paneli</h1>
        <p>Normal kullanıcı sadece okuma yapar. Bu panelden yetkili kullanıcı içerikleri günceller.</p>
        <p class="success" *ngIf="message">{{ message }}</p>
        <p class="error" *ngIf="error">{{ error }}</p>
      </section>

      <div class="admin-tabs">
        <button [class.active]="activeTab === 'about'" (click)="activeTab = 'about'">Hakkımda</button>
        <button [class.active]="activeTab === 'categories'" (click)="activeTab = 'categories'">Kategoriler</button>
        <button [class.active]="activeTab === 'posts'" (click)="activeTab = 'posts'">Blog Yazıları</button>
      </div>

      <section class="card" *ngIf="activeTab === 'about'">
        <h2>Hakkımda Bilgisi</h2>
        <div class="grid">
          <div class="form-row"><label>İsim Soyisim</label><input [(ngModel)]="about.full_name"></div>
          <div class="form-row"><label>Yaş</label><input type="number" [(ngModel)]="about.age"></div>
          <div class="form-row"><label>Yaşadığım Şehir</label><input [(ngModel)]="about.city"></div>
          <div class="form-row"><label>Mesleğim</label><input [(ngModel)]="about.profession"></div>
          <div class="form-row"><label>LinkedIn URL</label><input [(ngModel)]="about.linkedin_url"></div>
          <div class="form-row"><label>GitHub URL</label><input [(ngModel)]="about.github_url"></div>
        </div>
        <div class="form-row"><label>Açıklama</label><textarea rows="6" [(ngModel)]="about.description"></textarea></div>
        <div class="form-row"><label>Güncel Fotoğraf</label><input type="file" accept="image/*" (change)="onAboutPhoto($event)"></div>
        <button (click)="saveAbout()">Hakkımda Kaydet</button>
      </section>

      <section class="card" *ngIf="activeTab === 'categories'">
        <h2>Kategori Ekle / Güncelle</h2>
        <div class="grid">
          <div class="form-row">
            <label>Bölüm</label>
            <select [(ngModel)]="categoryForm.section">
              <option *ngFor="let section of sections" [value]="section.value">{{ section.label }}</option>
            </select>
          </div>
          <div class="form-row"><label>Kategori Adı</label><input [(ngModel)]="categoryForm.name"></div>
        </div>
        <div class="form-row"><label>Açıklama</label><textarea [(ngModel)]="categoryForm.description"></textarea></div>
        <button (click)="saveCategory()">{{ categoryForm.id ? 'Kategori Güncelle' : 'Kategori Ekle' }}</button>
        <button class="secondary" *ngIf="categoryForm.id" (click)="resetCategoryForm()">Vazgeç</button>

        <h3>Kategori Listesi</h3>
        <table class="table">
          <thead><tr><th>Bölüm</th><th>Kategori</th><th>Yazı</th><th>İşlem</th></tr></thead>
          <tbody>
            <tr *ngFor="let category of categories">
              <td>{{ category.section_label }}</td>
              <td>{{ category.name }}</td>
              <td>{{ category.post_count || 0 }}</td>
              <td>
                <button class="small" (click)="editCategory(category)">Düzenle</button>
                <button class="small danger" (click)="deleteCategory(category)">Sil</button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section class="card" *ngIf="activeTab === 'posts'">
        <h2>Blog Yazısı Ekle / Güncelle</h2>
        <div class="grid">
          <div class="form-row">
            <label>Bölüm</label>
            <select [(ngModel)]="postForm.section" (change)="loadCategoriesForPost()">
              <option *ngFor="let section of sections" [value]="section.value">{{ section.label }}</option>
            </select>
          </div>
          <div class="form-row">
            <label>Kategori</label>
            <select [(ngModel)]="postForm.category">
              <option [ngValue]="null">Kategori seçilmedi</option>
              <option *ngFor="let category of postCategories" [ngValue]="category.id">{{ category.name }}</option>
            </select>
          </div>
          <div class="form-row"><label>Başlık</label><input [(ngModel)]="postForm.title"></div>
          <div class="form-row">
            <label>Yayın Durumu</label>
            <select [(ngModel)]="postForm.is_published">
              <option [ngValue]="true">Yayında</option>
              <option [ngValue]="false">Taslak</option>
            </select>
          </div>
        </div>
        <div class="form-row"><label>Özet</label><input [(ngModel)]="postForm.summary"></div>
        <div class="form-row"><label>İçerik</label><textarea rows="8" [(ngModel)]="postForm.content"></textarea></div>
        <div class="form-row"><label>Görsel</label><input type="file" accept="image/*" (change)="onPostImage($event)"></div>
        <button (click)="savePost()">{{ postForm.id ? 'Yazı Güncelle' : 'Yazı Ekle' }}</button>
        <button class="secondary" *ngIf="postForm.id" (click)="resetPostForm()">Vazgeç</button>

        <h3>Mevcut Blog Yazıları</h3>
        <div class="toolbar">
          <input placeholder="Başlık veya içerikte ara" [(ngModel)]="searchText">
          <button class="secondary" (click)="loadPosts()">Ara</button>
        </div>
        <table class="table">
          <thead><tr><th>Başlık</th><th>Bölüm</th><th>Kategori</th><th>Yayın</th><th>İşlem</th></tr></thead>
          <tbody>
            <tr *ngFor="let post of posts">
              <td>{{ post.title }}</td>
              <td>{{ post.section_label }}</td>
              <td>{{ post.category_name || '-' }}</td>
              <td>{{ post.is_published ? 'Yayında' : 'Taslak' }}</td>
              <td>
                <button class="small" (click)="editPost(post)">Düzenle</button>
                <button class="small danger" (click)="deletePost(post)">Sil</button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>
  `
})
export class AdminDashboardComponent implements OnInit {
  activeTab: 'about' | 'categories' | 'posts' = 'about';
  sections: Section[] = [];
  categories: Category[] = [];
  postCategories: Category[] = [];
  posts: BlogPost[] = [];
  message = '';
  error = '';
  searchText = '';
  aboutPhotoFile: File | null = null;
  postImageFile: File | null = null;

  about: AboutProfile = {
    full_name: '', age: 21, city: '', profession: '', linkedin_url: '', github_url: '', description: ''
  };

  categoryForm: Category = { section: 'TECHNICAL', name: '', description: '' };

  postForm: BlogPost = {
    section: 'TECHNICAL', category: null, title: '', summary: '', content: '', is_published: true
  };

  constructor(private api: ApiService, private auth: AuthService) {}

  ngOnInit(): void {
    this.auth.me().subscribe(me => {
      if (!me.is_staff) this.error = 'Bu panel için staff/superuser yetkisi gerekir.';
    });
    this.api.getSections().subscribe(data => {
      this.sections = data;
      this.loadCategories();
      this.loadCategoriesForPost();
    });
    this.api.getAboutCurrent().subscribe(data => { if (data) this.about = data; });
    this.loadPosts();
  }

  onAboutPhoto(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.aboutPhotoFile = input.files?.[0] || null;
  }

  onPostImage(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.postImageFile = input.files?.[0] || null;
  }

  saveAbout(): void {
    this.clearMessages();
    this.api.saveAbout(this.about, this.aboutPhotoFile).subscribe({
      next: data => { this.about = data; this.aboutPhotoFile = null; this.message = 'Hakkımda bilgisi kaydedildi.'; },
      error: () => this.error = 'Hakkımda kaydedilemedi. Yetkili giriş ve alanları kontrol et.'
    });
  }

  saveCategory(): void {
    this.clearMessages();
    const request = this.categoryForm.id ? this.api.updateCategory(this.categoryForm) : this.api.createCategory(this.categoryForm);
    request.subscribe({
      next: () => { this.message = this.categoryForm.id ? 'Kategori güncellendi.' : 'Kategori eklendi.'; this.resetCategoryForm(); this.loadCategories(); this.loadCategoriesForPost(); },
      error: () => this.error = 'Kategori kaydedilemedi. Aynı bölümde aynı kategori adı olabilir.'
    });
  }

  editCategory(category: Category): void {
    this.categoryForm = { ...category };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteCategory(category: Category): void {
    if (!category.id || !confirm('Bu kategoriyi silmek istediğine emin misin?')) return;
    this.api.deleteCategory(category.id).subscribe({
      next: () => { this.message = 'Kategori silindi.'; this.loadCategories(); this.loadCategoriesForPost(); },
      error: () => this.error = 'Kategori silinemedi.'
    });
  }

  resetCategoryForm(): void {
    this.categoryForm = { section: 'TECHNICAL', name: '', description: '' };
  }

  loadCategories(): void {
    this.api.getCategories().subscribe(data => this.categories = data);
  }

  loadCategoriesForPost(): void {
    this.api.getCategories(this.postForm.section).subscribe(data => this.postCategories = data);
  }

  savePost(): void {
    this.clearMessages();
    this.api.savePost(this.postForm, this.postImageFile).subscribe({
      next: () => { this.message = this.postForm.id ? 'Yazı güncellendi.' : 'Yazı eklendi.'; this.resetPostForm(); this.loadPosts(); },
      error: () => this.error = 'Yazı kaydedilemedi. Bölüm-kategori uyumunu ve zorunlu alanları kontrol et.'
    });
  }

  editPost(post: BlogPost): void {
    this.postForm = { ...post };
    this.loadCategoriesForPost();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deletePost(post: BlogPost): void {
    if (!post.id || !confirm('Bu yazıyı silmek istediğine emin misin?')) return;
    this.api.deletePost(post.id).subscribe({
      next: () => { this.message = 'Yazı silindi.'; this.loadPosts(); },
      error: () => this.error = 'Yazı silinemedi.'
    });
  }

  resetPostForm(): void {
    const currentSection = this.postForm.section || 'TECHNICAL';
    this.postForm = { section: currentSection, category: null, title: '', summary: '', content: '', is_published: true };
    this.postImageFile = null;
    this.loadCategoriesForPost();
  }

  loadPosts(): void {
    this.api.getPosts({ search: this.searchText }).subscribe(data => this.posts = data);
  }

  private clearMessages(): void {
    this.message = '';
    this.error = '';
  }
}
