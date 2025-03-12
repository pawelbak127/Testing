import { Injectable, inject } from '@angular/core';
import { Auth, signInWithPopup, GoogleAuthProvider, signOut, authState } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);

  // Logowanie przez Google
  async loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(this.auth, provider);
      console.log('Zalogowany użytkownik:', result.user);
      return result.user;
    } catch (error) {
      console.error('Błąd logowania przez Google:', error);
      throw error;
    }
  }

  // Wylogowanie
  async logout() {
    await signOut(this.auth);
    console.log('Wylogowano');
  }

  // Pobranie aktualnego użytkownika
  getCurrentUser() {
    return authState(this.auth);
  }
}
