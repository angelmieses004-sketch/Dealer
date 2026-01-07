import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Vehicle } from './vehicle.service';
import { AuthService } from './auth.service';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private favorites = signal<number[]>([]); // Array de IDs de vehículos favoritos
  private useDatabase = true; // Cambiar a false para usar localStorage

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) {
    // Cargar favoritos si el usuario está autenticado
    if (this.authService.getIsAuthenticated()) {
      if (this.useDatabase) {
        this.loadFromDatabase();
      } else {
        // Fallback a localStorage
        const savedFavorites = localStorage.getItem('favorites');
        if (savedFavorites) {
          try {
            const favoritesArray = JSON.parse(savedFavorites);
            this.favorites.set(favoritesArray);
          } catch (e) {
            console.error('Error loading favorites:', e);
          }
        }
      }
    }
  }

  getFavorites(): number[] {
    return this.favorites();
  }

  isFavorite(vehicleId: number): boolean {
    return this.favorites().includes(vehicleId);
  }

  toggleFavorite(vehicleId: number): boolean {
    // Verificar si el usuario está autenticado
    if (!this.authService.getIsAuthenticated()) {
      return false; // Retorna false si no está autenticado
    }

    if (this.useDatabase) {
      const token = this.authService.getAuthToken();
      if (!token) {
        console.error('No auth token available');
        return false;
      }

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });

      this.http.post<any>(
        `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.favorites.toggle(vehicleId)}`,
        {},
        { headers }
      ).subscribe({
        next: (response) => {
          // Actualizar la lista local
          const currentFavorites = this.favorites();
          if (response.isFavorite) {
            if (!currentFavorites.includes(vehicleId)) {
              this.favorites.set([...currentFavorites, vehicleId]);
            }
          } else {
            this.favorites.set(currentFavorites.filter(id => id !== vehicleId));
          }
        },
        error: (error) => {
          console.error('Error toggling favorite:', error);
        }
      });

      // Retornar el estado actual (será actualizado por la respuesta)
      return this.favorites().includes(vehicleId);
    } else {
      // Fallback a localStorage
      const currentFavorites = this.favorites();
      const index = currentFavorites.indexOf(vehicleId);

      if (index > -1) {
        // Remover de favoritos
        const newFavorites = currentFavorites.filter(id => id !== vehicleId);
        this.favorites.set(newFavorites);
        localStorage.setItem('favorites', JSON.stringify(newFavorites));
        return false; // Ya no es favorito
      } else {
        // Añadir a favoritos
        const newFavorites = [...currentFavorites, vehicleId];
        this.favorites.set(newFavorites);
        localStorage.setItem('favorites', JSON.stringify(newFavorites));
        return true; // Ahora es favorito
      }
    }
  }

  private loadFromDatabase(): void {
    const token = this.authService.getAuthToken();
    if (!token) {
      console.error('No auth token available');
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.get<{ favorites: number[] }>(
      `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.favorites.getAll}`,
      { headers }
    ).subscribe({
      next: (response) => {
        this.favorites.set(response.favorites || []);
      },
      error: (error) => {
        console.error('Error loading favorites from database:', error);
        // Fallback a localStorage si hay error
        const savedFavorites = localStorage.getItem('favorites');
        if (savedFavorites) {
          try {
            const favoritesArray = JSON.parse(savedFavorites);
            this.favorites.set(favoritesArray);
          } catch (e) {
            console.error('Error loading favorites from localStorage:', e);
          }
        }
      }
    });
  }
}

