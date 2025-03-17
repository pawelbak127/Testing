import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const authService = inject(AuthService);
  
  // Skip interceptor for auth requests
  if (req.url.includes('/auth/') || req.url.includes('/refresh/')) {
    return next(req);
  }

  // Get token from storage
  const token = authService.getAccessToken();
  
  // Clone the request and add auth header if token exists
  if (token) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    
    // Handle the request with token
    return next(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        // If 401 Unauthorized, try to refresh token
        if (error.status === 401) {
          return authService.refreshToken().pipe(
            switchMap(() => {
              // Get new token and retry request
              const newToken = authService.getAccessToken();
              const newAuthReq = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${newToken}`)
              });
              return next(newAuthReq);
            }),
            catchError((refreshError) => {
              // If refresh fails, logout and redirect to login
              authService.logout();
              return throwError(() => refreshError);
            })
          );
        }
        
        return throwError(() => error);
      })
    );
  }
  
  return next(req);
};
