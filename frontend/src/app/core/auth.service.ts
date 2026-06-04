import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginResponse, MeResponse } from '../models/content.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly accessKey = 'blog_access_token';
  private readonly refreshKey = 'blog_refresh_token';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl.replace('/api', '')}/api/token/`, { username, password }).pipe(
      tap(response => {
        localStorage.setItem(this.accessKey, response.access);
        localStorage.setItem(this.refreshKey, response.refresh);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.accessKey);
    localStorage.removeItem(this.refreshKey);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.accessKey);
  }

  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  me(): Observable<MeResponse> {
    return this.http.get<MeResponse>(`${environment.apiUrl}/auth/me/`);
  }
}
