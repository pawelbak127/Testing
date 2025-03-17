import { Injectable, inject, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { TokenStorageService } from './token-storage.service';
import { environment } from '../../environments/environment';
import { isPlatformBrowser } from '@angular/common';

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface GoogleAuthRequest {
  idToken: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private tokenStorage = inject(TokenStorageService);
  private authStateSubject = new BehaviorSubject<boolean>(false);
  public authState$ = this.authStateSubject.asObservable();
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      this.checkInitialAuthState();
    }
  }

  private checkInitialAuthState(): void {
    const token = this.tokenStorage.getAccessToken();
    this.authStateSubject.next(!!token);
  }

  private updateAuthState(state: boolean): void {
    this.authStateSubject.next(state);
  }

  public isLoggedIn(): boolean {
    return this.isBrowser ? !!this.tokenStorage.getAccessToken() : false;
  }

  public getAccessToken(): string | null {
    return this.tokenStorage.getAccessToken();
  }

  public loginWithGoogle(googleIdToken: string): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(
      `${environment.apiUrl}/auth/google`,
      { idToken: googleIdToken } as GoogleAuthRequest
    ).pipe(
      tap(response => {
        this.tokenStorage.saveTokens(response.accessToken, response.refreshToken);
        this.updateAuthState(true);
      })
    );
  }

  public loginWithCredentials(login: string, password: string): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(
      `${environment.apiUrl}/auth`,
      { login, password }
    ).pipe(
      tap(response => {
        this.tokenStorage.saveTokens(response.accessToken, response.refreshToken);
        this.updateAuthState(true);
      })
    );
  }

  public refreshToken(): Observable<TokenResponse> {
    const refreshToken = this.tokenStorage.getRefreshToken();

    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<TokenResponse>(
      `${environment.apiUrl}/auth/refresh`,
      { refreshToken } as RefreshTokenRequest
    ).pipe(
      tap(response => {
        this.tokenStorage.saveTokens(response.accessToken, response.refreshToken);
      }),
      catchError(error => {
        this.logout();
        return throwError(() => error);
      })
    );
  }

  public logout(): void {
    this.tokenStorage.signOut();
    this.updateAuthState(false);
  }

  public initGoogleAuth(): Promise<google.accounts.id.IdConfiguration> {
    if (!this.isBrowser) {
      return Promise.reject('Google Auth cannot be initialized on server');
    }

    return new Promise<google.accounts.id.IdConfiguration>((resolve, reject) => {
      // Load the Google Identity Services script
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        // Initialize Google Identity Services
        const config: google.accounts.id.IdConfiguration = {
          client_id: environment.googleClientId,
          callback: (response: { credential: string }) => {
            // This callback will be triggered after Google authentication
            // We'll handle this in the component that uses this service
          },
          auto_select: false,
          cancel_on_tap_outside: true
        };
        resolve(config);
      };
      script.onerror = (error) => {
        reject(error);
      };
      document.body.appendChild(script);
    });
  }
}
