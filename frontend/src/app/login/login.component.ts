import {Component, inject} from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../services/auth.service';
import { NgModule } from '@angular/core';

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
    MatIconModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  hidePassword = true;
  private authService = inject(AuthService);

  loginForm = new FormGroup({
    login: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Login:', this.loginForm.value.login);
      console.log('Password:', this.loginForm.value.password);
    }
  }

  loginGoogle() {
    this.authService.loginWithGoogle().then(user => {
      console.log('Zalogowany:', user);
    }).catch(error => {
      console.error('Błąd logowania:', error);
    });
  }
  logout() {
    this.authService.logout();
  }
}
