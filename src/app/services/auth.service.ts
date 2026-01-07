import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { API_CONFIG } from '../config/api.config';

export interface User {
  id: number;
  username: string;
  email: string;
  isAdmin: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = signal<boolean>(false);
  private currentUser = signal<User | null>(null);
  private readonly ADMIN_USERNAME = 'Pascual';
  private readonly ADMIN_PASSWORD = 'PascualParedes2025';

  private useDatabase = true; // Cambiar a false para usar localStorage

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    // Check if user is already logged in
    const savedAuth = localStorage.getItem('isAuthenticated');
    const savedUser = localStorage.getItem('currentUser');
    const savedToken = localStorage.getItem('authToken');
    
    if (savedAuth === 'true' && savedUser && savedToken) {
      try {
        const user = JSON.parse(savedUser);
        this.currentUser.set(user);
        this.isAuthenticated.set(true);
      } catch (e) {
        console.error('Error loading user:', e);
      }
    }
  }

  register(username: string, email: string, password: string): Promise<boolean> {
    if (this.useDatabase) {
      return new Promise((resolve, reject) => {
        this.http.post<any>(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.auth.register}`, {
          username,
          email,
          password
        }).subscribe({
          next: (response) => {
            const user: User = {
              id: response.user.id,
              username: response.user.username,
              email: response.user.email,
              isAdmin: response.user.isAdmin
            };

            this.currentUser.set(user);
            this.isAuthenticated.set(true);
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('currentUser', JSON.stringify(user));
            localStorage.setItem('authToken', response.token);
            
            resolve(true);
          },
          error: (error) => {
            console.error('Register error:', error);
            reject(error.error?.error || 'Error al registrar usuario');
          }
        });
      });
    } else {
      // Fallback a localStorage
      return new Promise((resolve) => {
        const users = this.getStoredUsers();
        
        if (users.find(u => u.username === username || u.email === email)) {
          resolve(false);
          return;
        }

        const newUser: User = {
          id: Date.now(),
          username,
          email,
          isAdmin: false
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('userPasswords', JSON.stringify({
          ...this.getStoredPasswords(),
          [username]: password
        }));

        this.currentUser.set(newUser);
        this.isAuthenticated.set(true);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('currentUser', JSON.stringify(newUser));

        resolve(true);
      });
    }
  }

  login(username: string, password: string): Promise<boolean> {
    if (this.useDatabase) {
      return new Promise((resolve) => {
        this.http.post<any>(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.auth.login}`, {
          username,
          password
        }).subscribe({
          next: (response) => {
            const user: User = {
              id: response.user.id,
              username: response.user.username,
              email: response.user.email,
              isAdmin: response.user.isAdmin
            };

            this.currentUser.set(user);
            this.isAuthenticated.set(true);
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('currentUser', JSON.stringify(user));
            localStorage.setItem('authToken', response.token);
            
            resolve(true);
          },
          error: (error) => {
            console.error('Login error:', error);
            resolve(false);
          }
        });
      });
    } else {
      // Fallback a localStorage
      if (username === this.ADMIN_USERNAME && password === this.ADMIN_PASSWORD) {
        const adminUser: User = {
          id: 0,
          username: this.ADMIN_USERNAME,
          email: 'admin@dealer.com',
          isAdmin: true
        };
        this.currentUser.set(adminUser);
        this.isAuthenticated.set(true);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('currentUser', JSON.stringify(adminUser));
        return Promise.resolve(true);
      }

      const passwords = this.getStoredPasswords();
      if (passwords[username] === password) {
        const users = this.getStoredUsers();
        const user = users.find(u => u.username === username);
        if (user) {
          this.currentUser.set(user);
          this.isAuthenticated.set(true);
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('currentUser', JSON.stringify(user));
          return Promise.resolve(true);
        }
      }

      return Promise.resolve(false);
    }
  }

  logout() {
    this.isAuthenticated.set(false);
    this.currentUser.set(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    this.router.navigate(['/']);
  }

  getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  isLoggedIn() {
    return this.isAuthenticated.asReadonly();
  }

  getIsAuthenticated() {
    return this.isAuthenticated();
  }

  getCurrentUser(): User | null {
    return this.currentUser();
  }

  isAdmin(): boolean {
    return this.currentUser()?.isAdmin || false;
  }

  private getStoredUsers(): User[] {
    const stored = localStorage.getItem('users');
    return stored ? JSON.parse(stored) : [];
  }

  private getStoredPasswords(): { [key: string]: string } {
    const stored = localStorage.getItem('userPasswords');
    return stored ? JSON.parse(stored) : {};
  }

}
