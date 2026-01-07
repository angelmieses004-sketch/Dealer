import { Component, OnInit, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { VehicleService, Vehicle } from '../../services/vehicle.service';
import { PriceFormatPipe } from '../../pipes/price-format.pipe';
import { VehicleConditionPipe } from '../../pipes/vehicle-condition.pipe';
import { FavoritesService } from '../../services/favorites.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    PriceFormatPipe,
    VehicleConditionPipe
  ],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchResultsComponent implements OnInit {
  vehicles = signal<Vehicle[]>([]);
  searchQuery = signal<string>('');
  sortBy = signal<string>('year-desc');
  showAuthModal = signal(false);
  isLoggedIn = computed(() => this.authService.isLoggedIn()());

  get sortByValue(): string {
    return this.sortBy();
  }

  set sortByValue(value: string) {
    this.sortBy.set(value);
  }

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private vehicleService: VehicleService,
    private favoritesService: FavoritesService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const filters: any = {};
      
      if (params['brand']) filters.brand = params['brand'];
      if (params['model']) filters.model = params['model'];
      if (params['yearFrom']) filters.yearFrom = parseInt(params['yearFrom']);
      if (params['yearTo']) filters.yearTo = parseInt(params['yearTo']);
      if (params['priceTo']) filters.priceTo = parseInt(params['priceTo']);
      if (params['location']) filters.location = params['location'];
      if (params['condition']) filters.condition = params['condition'];
      if (params['type']) filters.type = params['type'];

      const query = params['query'] || '';
      this.searchQuery.set(query);

      // Si hay query pero no hay filtros específicos, buscar por marca o modelo
      if (query && !filters.brand && !filters.model) {
        // Buscar vehículos que coincidan con la query en marca o modelo
        const allVehicles = this.vehicleService.getVehicles()();
        const queryLower = query.toLowerCase();
        const results = allVehicles.filter(v => 
          v.brand.toLowerCase().includes(queryLower) || 
          v.model.toLowerCase().includes(queryLower)
        );
        this.vehicles.set(results);
      } else {
        const results = this.vehicleService.searchVehicles(filters);
        this.vehicles.set(results);
      }
    });
  }

  get sortedVehicles(): Vehicle[] {
    const vehicles = this.vehicles();
    const sort = this.sortBy();

    switch (sort) {
      case 'year-desc':
        return [...vehicles].sort((a, b) => b.year - a.year);
      case 'year-asc':
        return [...vehicles].sort((a, b) => a.year - b.year);
      case 'price-desc':
        return [...vehicles].sort((a, b) => {
          const priceA = a.currency === 'US$' ? a.price * 58 : a.price;
          const priceB = b.currency === 'US$' ? b.price * 58 : b.price;
          return priceB - priceA;
        });
      case 'price-asc':
        return [...vehicles].sort((a, b) => {
          const priceA = a.currency === 'US$' ? a.price * 58 : a.price;
          const priceB = b.currency === 'US$' ? b.price * 58 : b.price;
          return priceA - priceB;
        });
      default:
        return vehicles;
    }
  }

  isFavorite(vehicleId: number): boolean {
    return this.favoritesService.isFavorite(vehicleId);
  }

  toggleFavorite(event: Event, vehicleId: number) {
    event.stopPropagation();
    
    if (!this.authService.getIsAuthenticated()) {
      this.showAuthModal.set(true);
      return;
    }

    this.favoritesService.toggleFavorite(vehicleId);
  }

  closeAuthModal() {
    this.showAuthModal.set(false);
  }

  goToLogin() {
    this.closeAuthModal();
    this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
  }

  goToRegister() {
    this.closeAuthModal();
    this.router.navigate(['/register'], { queryParams: { returnUrl: this.router.url } });
  }

  viewVehicle(id: number) {
    this.router.navigate(['/vehicle', id]);
  }
}

