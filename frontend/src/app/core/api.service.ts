import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AboutProfile, BlogPost, Category, PaginatedResponse, Section } from '../models/content.models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getSections(): Observable<Section[]> {
    return this.http.get<Section[]>(`${this.api}/sections/`);
  }

  getAboutCurrent(): Observable<AboutProfile | null> {
    return this.http.get<AboutProfile | null>(`${this.api}/about/current/`);
  }

  saveAbout(about: AboutProfile, photoFile?: File | null): Observable<AboutProfile> {
    const formData = new FormData();
    formData.append('full_name', about.full_name || '');
    formData.append('age', String(about.age || 0));
    formData.append('city', about.city || '');
    formData.append('profession', about.profession || '');
    formData.append('linkedin_url', about.linkedin_url || '');
    formData.append('github_url', about.github_url || '');
    formData.append('description', about.description || '');
    if (photoFile) formData.append('photo', photoFile);

    if (about.id) {
      return this.http.patch<AboutProfile>(`${this.api}/about/${about.id}/`, formData);
    }
    return this.http.post<AboutProfile>(`${this.api}/about/`, formData);
  }

  getCategories(section?: string): Observable<Category[]> {
    let params = new HttpParams();
    if (section) params = params.set('section', section);
    return this.http.get<PaginatedResponse<Category> | Category[]>(`${this.api}/categories/`, { params }).pipe(
      map(response => Array.isArray(response) ? response : response.results)
    );
  }

  createCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(`${this.api}/categories/`, category);
  }

  updateCategory(category: Category): Observable<Category> {
    return this.http.patch<Category>(`${this.api}/categories/${category.id}/`, category);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/categories/${id}/`);
  }

  getPosts(options: { section?: string; category?: number | null; published?: boolean; search?: string } = {}): Observable<BlogPost[]> {
    let params = new HttpParams();
    if (options.section) params = params.set('section', options.section);
    if (options.category) params = params.set('category', String(options.category));
    if (options.published !== undefined) params = params.set('published', String(options.published));
    if (options.search) params = params.set('search', options.search);
    return this.http.get<PaginatedResponse<BlogPost> | BlogPost[]>(`${this.api}/posts/`, { params }).pipe(
      map(response => Array.isArray(response) ? response : response.results)
    );
  }

  getPost(id: number): Observable<BlogPost> {
    return this.http.get<BlogPost>(`${this.api}/posts/${id}/`);
  }

  savePost(post: BlogPost, imageFile?: File | null): Observable<BlogPost> {
    const formData = new FormData();
    formData.append('section', post.section);
    if (post.category) formData.append('category', String(post.category));
    formData.append('title', post.title || '');
    formData.append('summary', post.summary || '');
    formData.append('content', post.content || '');
    formData.append('is_published', String(post.is_published));
    if (imageFile) formData.append('image', imageFile);

    if (post.id) {
      return this.http.patch<BlogPost>(`${this.api}/posts/${post.id}/`, formData);
    }
    return this.http.post<BlogPost>(`${this.api}/posts/`, formData);
  }

  deletePost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/posts/${id}/`);
  }
}
