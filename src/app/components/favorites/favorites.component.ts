import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { VehicleService, Vehicle } from '../../services/vehicle.service';
import { FavoritesService } from '../../services/favorites.service';
import { AuthService } from '../../services/auth.service';
import { PriceFormatPipe } from '../../pipes/price-format.pipe';
import { VehicleConditionPipe } from '../../pipes/vehicle-condition.pipe';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    PriceFormatPipe,
    VehicleConditionPipe
  ],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css'
})
export class FavoritesComponent implements OnInit {
  favoriteVehicles = signal<Vehicle[]>([]);
  isLoggedIn = computed(() => this.authService.isLoggedIn()());

  constructor(
    private vehicleService: VehicleService,
    private favoritesService: FavoritesService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    if (!this.authService.getIsAuthenticated()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/favorites' } });
      return;
    }

    this.loadFavorites();
  }

  loadFavorites() {
    const favoriteIds = this.favoritesService.getFavorites();
    const allVehicles = this.vehicleService.getVehicles()();
    const favorites = allVehicles.filter(v => favoriteIds.includes(v.id));
    this.favoriteVehicles.set(favorites);
  }

  removeFavorite(event: Event, vehicleId: number) {
    event.stopPropagation();
    this.favoritesService.toggleFavorite(vehicleId);
    this.loadFavorites();
  }

  viewVehicle(id: number) {
    this.router.navigate(['/vehicle', id]);
  }
}

