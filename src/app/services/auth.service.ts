import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = signal<boolean>(false);
  private readonly ADMIN_USERNAME = 'Pascual';
  private readonly ADMIN_PASSWORD = 'PascualParedes2025'; // Credenciales seguras almacenadas en el servicio

  constructor(private router: Router) {
    // Check if user is already logged in
    const savedAuth = localStorage.getItem('isAuthenticated');
    if (savedAuth === 'true') {
      this.isAuthenticated.set(true);
    }
  }

  login(username: string, password: string): boolean {
    if (username === this.ADMIN_USERNAME && password === this.ADMIN_PASSWORD) {
      this.isAuthenticated.set(true);
      localStorage.setItem('isAuthenticated', 'true');
      return true;
    }
    return false;
  }

  logout() {
    this.isAuthenticated.set(false);
    localStorage.removeItem('isAuthenticated');
    this.router.navigate(['/']);
  }

  isLoggedIn() {
    return this.isAuthenticated.asReadonly();
  }

  getIsAuthenticated() {
    return this.isAuthenticated();
  }
}
