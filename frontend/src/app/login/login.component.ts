import { Component, OnInit, inject, AfterViewInit, ElementRef, ViewChild, PLATFORM_ID, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, config: any) => void;
          prompt: () => void;
        }
      }
    }
  }
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit {
  @ViewChild('googleButton') googleButtonRef!: ElementRef;

  hidePassword = true;
  isLoading = false;
  private isBrowser: boolean;

  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  loginForm = new FormGroup({
    login: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  ngOnInit(): void {
    // Initialize Google Identity Services only in browser
    if (this.isBrowser) {
      this.initGoogleSignIn();
    }
  }

  ngAfterViewInit(): void {
    // The button will be rendered when the Google SDK is loaded
  }

  private initGoogleSignIn(): void {
    this.authService.initGoogleAuth().then(config => {
      // Override the callback to handle the credential
      const fullConfig = {
        ...config,
        callback: ({ credential }: { credential: string }) => {
          this.handleGoogleCredential(credential);
        }
      };

      // Initialize and render the button
      if (window.google?.accounts.id) {
        window.google.accounts.id.initialize(fullConfig);

        // Render after view is initialized
        setTimeout(() => {
          if (this.googleButtonRef && this.googleButtonRef.nativeElement) {
            window.google?.accounts.id.renderButton(this.googleButtonRef.nativeElement, {
              type: 'standard',
              theme: 'outline',
              size: 'large',
              text: 'signin_with',
              shape: 'rectangular',
              logo_alignment: 'left',
              width: 320
            });
          }
        }, 0);
      }
    }).catch(error => {
      console.error('Error initializing Google Sign-In', error);
      this.snackBar.open('Failed to load Google Sign-In', 'Close', { duration: 5000 });
    });
  }

  private handleGoogleCredential(idToken: string): void {
    this.isLoading = true;

    this.authService.loginWithGoogle(idToken).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.snackBar.open('Successfully logged in with Google', 'Close', { duration: 3000 });
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Google login error', error);
        this.snackBar.open('Google login failed. Please try again.', 'Close', { duration: 5000 });
      }
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const { login, password } = this.loginForm.value;

      this.authService.loginWithCredentials(login!, password!).subscribe({
        next: () => {
          this.isLoading = false;
          this.snackBar.open('Successfully logged in', 'Close', { duration: 3000 });
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Login error', error);
          this.snackBar.open('Login failed. Please check your credentials.', 'Close', { duration: 5000 });
        }
      });
    }
  }

  logout(): void {
    this.authService.logout();
    this.snackBar.open('You have been logged out', 'Close', { duration: 3000 });
  }
}
