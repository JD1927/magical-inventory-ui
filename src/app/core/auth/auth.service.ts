import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { startAuthentication, startRegistration } from '@simplewebauthn/browser';
import { from, Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  // Manage auth state using Signals
  isAuthenticated = signal<boolean>(this.hasToken());
  user = signal<{ email: string; role: string; sub: string } | null>(this.getDecodedToken());
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  private getDecodedToken(): any {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join(''),
      );
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  }

  // ─── Registration ─────────────────────────────────────────────

  register(email: string): Observable<void> {
    return this.generateRegistrationOptions(email).pipe(
      switchMap((options) => from(startRegistration({ optionsJSON: options }))),
      switchMap((credential) => this.verifyRegistration(email, credential)),
      map((result) => {
        if (!result.verified) throw new Error('Registration verification failed');
      }),
    );
  }

  generateRegistrationOptions(email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/generate-registration-options`, {
      params: { email },
    });
  }

  verifyRegistration(email: string, credential: any): Observable<{ verified: boolean }> {
    return this.http.post<{ verified: boolean }>(`${this.apiUrl}/verify-registration`, {
      email,
      credential,
    });
  }

  // ─── Authentication ───────────────────────────────────────────

  login(email: string): Observable<void> {
    return this.generateAuthenticationOptions(email).pipe(
      switchMap((options) => from(startAuthentication({ optionsJSON: options }))),
      switchMap((credential) => this.verifyAuthentication(email, credential)),
      map((success) => {
        if (!success) throw new Error('Authentication failed');
      }),
    );
  }

  generateAuthenticationOptions(email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/generate-authentication-options`, {
      params: { email },
    });
  }

  verifyAuthentication(email: string, credential: any): Observable<boolean> {
    return this.http
      .post<{ accessToken: string }>(`${this.apiUrl}/verify-authentication`, {
        email,
        credential,
      })
      .pipe(
        tap((response) => {
          localStorage.setItem('token', response.accessToken);
          this.isAuthenticated.set(true);
          this.user.set(this.getDecodedToken());
        }),
        map(() => true),
        catchError(() => of(false)),
      );
  }

  // ─── Session ──────────────────────────────────────────────────

  logout(): void {
    localStorage.removeItem('token');
    this.isAuthenticated.set(false);
    this.user.set(null);
    this.router.navigate(['/login']);
  }

  get token(): string | null {
    return localStorage.getItem('token');
  }
}
