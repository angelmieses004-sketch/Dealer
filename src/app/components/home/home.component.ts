import { Component, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { VehicleService, Vehicle } from '../../services/vehicle.service';
import { PriceFormatPipe } from '../../pipes/price-format.pipe';
import { VehicleConditionPipe } from '../../pipes/vehicle-condition.pipe';
import { FavoritesService } from '../../services/favorites.service';
import { AuthService } from '../../services/auth.service';

interface SearchForm {
  state: string;
  brand: string;
  model: string;
  yearFrom: string;
  yearTo: string;
  priceTo: string;
  location: string;
  type: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterModule,
    PriceFormatPipe,
    VehicleConditionPipe
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  // Search form signals
  searchForm = signal<SearchForm>({
    state: '',
    brand: '',
    model: '',
    yearFrom: '',
    yearTo: '',
    priceTo: '',
    location: '',
    type: ''
  });

  isSearching = signal(false);

  // Vehicle types
  readonly vehicleTypes = [
    { name: 'Jeepeta', icon: '🚙', color: '#ec4899' },
    { name: 'Carros', icon: '🚗', color: '#dc2626' },
    { name: 'Jeep', icon: '🚙', color: '#b91c1c' },
    { name: 'Camioneta', icon: '🚚', color: '#f59e0b' },
    { name: 'Hatchback', icon: '🚗', color: '#ef4444' },
    { name: 'Minivan', icon: '🚐', color: '#8b5cf6' },
    { name: 'Camion', icon: '🚛', color: '#059669' },
    { name: 'Furgoneta', icon: '🚐', color: '#0ea5e9' },
    { name: 'Coupe', icon: '🏎️', color: '#f97316' },
    { name: 'Autobus', icon: '🚌', color: '#6366f1' },
    { name: 'Crossover', icon: '🚙', color: '#ec4899' },
    { name: 'Motores', icon: '🏍️', color: '#14b8a6' }
  ] as const;

  // Vehicles signal
  private vehiclesSignal = signal<Vehicle[]>([]);
  
  // Computed filtered vehicles
  filteredVehicles = computed(() => {
    const vehicles = this.vehiclesSignal();
    const form = this.searchForm();
    const isSearching = this.isSearching();

    if (!isSearching) {
      return vehicles;
    }

    const filters: {
      brand?: string;
      model?: string;
      yearFrom?: number;
      yearTo?: number;
      priceTo?: number;
      location?: string;
      condition?: string;
      type?: string;
    } = {};

    if (form.brand) filters.brand = form.brand;
    if (form.model) filters.model = form.model;
    if (form.yearFrom) filters.yearFrom = parseInt(form.yearFrom);
    if (form.yearTo) filters.yearTo = parseInt(form.yearTo);
    if (form.priceTo) filters.priceTo = parseInt(form.priceTo);
    if (form.location) filters.location = form.location;
    if (form.state) filters.condition = form.state;
    if (form.type) filters.type = form.type;

    return this.vehicleService.searchVehicles(filters);
  });

  // Computed for search results count
  searchResultsCount = computed(() => this.filteredVehicles().length);

  showAuthModal = signal(false);
  isLoggedIn = computed(() => this.authService.isLoggedIn()());

  constructor(
    private vehicleService: VehicleService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private favoritesService: FavoritesService,
    private authService: AuthService
  ) {
    const vehicles = this.vehicleService.getVehicles()();
    this.vehiclesSignal.set(vehicles);
  }

  onSearch() {
    const form = this.searchForm();
    const hasFilters = form.brand || form.model || form.yearFrom || form.yearTo || 
                      form.priceTo || form.location || form.state || form.type;

    if (hasFilters) {
      // Redirigir a página de resultados con los parámetros de búsqueda
      const queryParams: any = {};
      if (form.brand) queryParams.brand = form.brand;
      if (form.model) queryParams.model = form.model;
      if (form.yearFrom) queryParams.yearFrom = form.yearFrom;
      if (form.yearTo) queryParams.yearTo = form.yearTo;
      if (form.priceTo) queryParams.priceTo = form.priceTo;
      if (form.location) queryParams.location = form.location;
      if (form.state) queryParams.condition = form.state;
      if (form.type) queryParams.type = form.type;

      this.router.navigate(['/search'], { queryParams });
    } else {
      this.isSearching.set(true);
    }
  }

  clearSearch() {
    this.searchForm.set({
      state: '',
      brand: '',
      model: '',
      yearFrom: '',
      yearTo: '',
      priceTo: '',
      location: '',
      type: ''
    });
    this.isSearching.set(false);
  }

  filterByType(type: string) {
    this.searchForm.update(form => ({ ...form, type }));
    this.onSearch();
  }

  viewVehicle(id: number) {
    this.router.navigate(['/vehicle', id]);
  }

  updateSearchField<K extends keyof SearchForm>(field: K, value: string) {
    this.searchForm.update(form => ({ ...form, [field]: value }));
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

  getVehicleIcon(typeName: string): SafeHtml {
    const icons: { [key: string]: string } = {
      'Jeepeta': `<svg viewBox="0 0 200 120" class="vehicle-svg">
        <g class="vehicle-body">
          <path d="M35 85 L45 50 L80 45 L130 45 L155 50 L165 85 L165 105 L35 105 Z" fill="#ffffff" stroke="#333" stroke-width="2"/>
          <rect x="50" y="50" width="110" height="35" fill="#333" opacity="0.2"/>
          <line x1="75" y1="50" x2="75" y2="85" stroke="#333" stroke-width="1.5"/>
          <line x1="135" y1="50" x2="135" y2="85" stroke="#333" stroke-width="1.5"/>
          <rect x="160" y="60" width="5" height="20" fill="#333"/>
        </g>
        <g class="vehicle-wheels">
          <circle cx="60" cy="105" r="14" fill="#333"/>
          <circle cx="60" cy="105" r="10" fill="#ffffff"/>
          <circle cx="60" cy="105" r="5" fill="#333"/>
          <circle cx="150" cy="105" r="14" fill="#333"/>
          <circle cx="150" cy="105" r="10" fill="#ffffff"/>
          <circle cx="150" cy="105" r="5" fill="#333"/>
        </g>
      </svg>`,
      'Carros': `<svg viewBox="0 0 200 120" class="vehicle-svg">
        <g class="vehicle-body">
          <path d="M40 80 L50 60 L90 50 L150 50 L160 60 L170 80 L170 100 L40 100 Z" fill="#ffffff" stroke="#333" stroke-width="2"/>
          <rect x="50" y="60" width="100" height="30" fill="#333" opacity="0.2"/>
          <line x1="70" y1="60" x2="70" y2="90" stroke="#333" stroke-width="1.5"/>
          <line x1="130" y1="60" x2="130" y2="90" stroke="#333" stroke-width="1.5"/>
        </g>
        <g class="vehicle-wheels">
          <circle cx="65" cy="100" r="12" fill="#333"/>
          <circle cx="65" cy="100" r="8" fill="#ffffff"/>
          <circle cx="65" cy="100" r="4" fill="#333"/>
          <circle cx="145" cy="100" r="12" fill="#333"/>
          <circle cx="145" cy="100" r="8" fill="#ffffff"/>
          <circle cx="145" cy="100" r="4" fill="#333"/>
        </g>
      </svg>`,
      'Jeep': `<svg viewBox="0 0 200 120" class="vehicle-svg">
        <g class="vehicle-body">
          <path d="M30 90 L40 45 L75 40 L125 40 L160 45 L170 90 L170 110 L30 110 Z" fill="#ffffff" stroke="#333" stroke-width="2"/>
          <rect x="45" y="45" width="120" height="45" fill="#333" opacity="0.2"/>
          <line x1="75" y1="45" x2="75" y2="90" stroke="#333" stroke-width="1.5"/>
          <line x1="135" y1="45" x2="135" y2="90" stroke="#333" stroke-width="1.5"/>
          <rect x="165" y="55" width="5" height="25" fill="#333"/>
          <rect x="30" y="50" width="10" height="5" fill="#333"/>
        </g>
        <g class="vehicle-wheels">
          <circle cx="55" cy="110" r="15" fill="#333"/>
          <circle cx="55" cy="110" r="11" fill="#ffffff"/>
          <circle cx="55" cy="110" r="6" fill="#333"/>
          <circle cx="155" cy="110" r="15" fill="#333"/>
          <circle cx="155" cy="110" r="11" fill="#ffffff"/>
          <circle cx="155" cy="110" r="6" fill="#333"/>
        </g>
      </svg>`,
      'Camioneta': `<svg viewBox="0 0 200 120" class="vehicle-svg">
        <g class="vehicle-body">
          <path d="M30 90 L40 50 L70 45 L120 45 L150 50 L160 90 L160 110 L30 110 Z" fill="#ffffff" stroke="#333" stroke-width="2"/>
          <rect x="45" y="50" width="115" height="40" fill="#333" opacity="0.2"/>
          <line x1="70" y1="50" x2="70" y2="90" stroke="#333" stroke-width="1.5"/>
          <line x1="130" y1="50" x2="130" y2="90" stroke="#333" stroke-width="1.5"/>
          <rect x="160" y="60" width="8" height="30" fill="#333"/>
        </g>
        <g class="vehicle-wheels">
          <circle cx="55" cy="110" r="15" fill="#333"/>
          <circle cx="55" cy="110" r="11" fill="#ffffff"/>
          <circle cx="55" cy="110" r="6" fill="#333"/>
          <circle cx="145" cy="110" r="15" fill="#333"/>
          <circle cx="145" cy="110" r="11" fill="#ffffff"/>
          <circle cx="145" cy="110" r="6" fill="#333"/>
        </g>
      </svg>`,
      'Hatchback': `<svg viewBox="0 0 200 120" class="vehicle-svg">
        <g class="vehicle-body">
          <path d="M45 75 L55 55 L85 50 L125 50 L135 55 L145 75 L145 95 L45 95 Z" fill="#ffffff" stroke="#333" stroke-width="2"/>
          <rect x="55" y="55" width="80" height="25" fill="#333" opacity="0.2"/>
          <line x1="75" y1="55" x2="75" y2="80" stroke="#333" stroke-width="1.5"/>
          <line x1="115" y1="55" x2="115" y2="80" stroke="#333" stroke-width="1.5"/>
        </g>
        <g class="vehicle-wheels">
          <circle cx="60" cy="95" r="10" fill="#333"/>
          <circle cx="60" cy="95" r="7" fill="#ffffff"/>
          <circle cx="60" cy="95" r="3" fill="#333"/>
          <circle cx="140" cy="95" r="10" fill="#333"/>
          <circle cx="140" cy="95" r="7" fill="#ffffff"/>
          <circle cx="140" cy="95" r="3" fill="#333"/>
        </g>
      </svg>`,
      'Minivan': `<svg viewBox="0 0 200 120" class="vehicle-svg">
        <g class="vehicle-body">
          <path d="M35 85 L45 55 L80 50 L120 50 L155 55 L165 85 L165 105 L35 105 Z" fill="#ffffff" stroke="#333" stroke-width="2"/>
          <rect x="50" y="55" width="115" height="30" fill="#333" opacity="0.2"/>
          <line x1="70" y1="55" x2="70" y2="85" stroke="#333" stroke-width="1.5"/>
          <line x1="100" y1="55" x2="100" y2="85" stroke="#333" stroke-width="1.5"/>
          <line x1="130" y1="55" x2="130" y2="85" stroke="#333" stroke-width="1.5"/>
        </g>
        <g class="vehicle-wheels">
          <circle cx="60" cy="105" r="14" fill="#333"/>
          <circle cx="60" cy="105" r="10" fill="#ffffff"/>
          <circle cx="60" cy="105" r="5" fill="#333"/>
          <circle cx="150" cy="105" r="14" fill="#333"/>
          <circle cx="150" cy="105" r="10" fill="#ffffff"/>
          <circle cx="150" cy="105" r="5" fill="#333"/>
        </g>
      </svg>`,
      'Camion': `<svg viewBox="0 0 200 120" class="vehicle-svg">
        <g class="vehicle-body">
          <path d="M20 95 L30 50 L60 45 L100 45 L110 50 L120 95 L120 115 L20 115 Z" fill="#ffffff" stroke="#333" stroke-width="2"/>
          <rect x="35" y="50" width="85" height="45" fill="#333" opacity="0.2"/>
          <line x1="60" y1="50" x2="60" y2="95" stroke="#333" stroke-width="1.5"/>
          <rect x="120" y="60" width="50" height="35" fill="#ffffff" stroke="#333" stroke-width="2"/>
        </g>
        <g class="vehicle-wheels">
          <circle cx="50" cy="115" r="16" fill="#333"/>
          <circle cx="50" cy="115" r="12" fill="#ffffff"/>
          <circle cx="50" cy="115" r="6" fill="#333"/>
          <circle cx="100" cy="115" r="16" fill="#333"/>
          <circle cx="100" cy="115" r="12" fill="#ffffff"/>
          <circle cx="100" cy="115" r="6" fill="#333"/>
          <circle cx="150" cy="115" r="16" fill="#333"/>
          <circle cx="150" cy="115" r="12" fill="#ffffff"/>
          <circle cx="150" cy="115" r="6" fill="#333"/>
        </g>
      </svg>`,
      'Furgoneta': `<svg viewBox="0 0 200 120" class="vehicle-svg">
        <g class="vehicle-body">
          <path d="M35 90 L45 50 L80 45 L120 45 L155 50 L165 90 L165 110 L35 110 Z" fill="#ffffff" stroke="#333" stroke-width="2"/>
          <rect x="50" y="50" width="115" height="40" fill="#333" opacity="0.2"/>
          <line x1="75" y1="50" x2="75" y2="90" stroke="#333" stroke-width="1.5"/>
          <line x1="125" y1="50" x2="125" y2="90" stroke="#333" stroke-width="1.5"/>
        </g>
        <g class="vehicle-wheels">
          <circle cx="60" cy="110" r="14" fill="#333"/>
          <circle cx="60" cy="110" r="10" fill="#ffffff"/>
          <circle cx="60" cy="110" r="5" fill="#333"/>
          <circle cx="150" cy="110" r="14" fill="#333"/>
          <circle cx="150" cy="110" r="10" fill="#ffffff"/>
          <circle cx="150" cy="110" r="5" fill="#333"/>
        </g>
      </svg>`,
      'Coupe': `<svg viewBox="0 0 200 120" class="vehicle-svg">
        <g class="vehicle-body">
          <path d="M50 75 L60 55 L100 50 L140 50 L150 55 L160 75 L160 95 L50 95 Z" fill="#ffffff" stroke="#333" stroke-width="2"/>
          <path d="M60 55 L100 50 L140 50 L150 55" fill="#333" opacity="0.2"/>
          <line x1="80" y1="55" x2="80" y2="85" stroke="#333" stroke-width="1.5"/>
          <line x1="120" y1="55" x2="120" y2="85" stroke="#333" stroke-width="1.5"/>
        </g>
        <g class="vehicle-wheels">
          <circle cx="70" cy="95" r="11" fill="#333"/>
          <circle cx="70" cy="95" r="8" fill="#ffffff"/>
          <circle cx="70" cy="95" r="4" fill="#333"/>
          <circle cx="150" cy="95" r="11" fill="#333"/>
          <circle cx="150" cy="95" r="8" fill="#ffffff"/>
          <circle cx="150" cy="95" r="4" fill="#333"/>
        </g>
      </svg>`,
      'Autobus': `<svg viewBox="0 0 200 120" class="vehicle-svg">
        <g class="vehicle-body">
          <path d="M25 85 L35 45 L80 40 L120 40 L165 45 L175 85 L175 105 L25 105 Z" fill="#ffffff" stroke="#333" stroke-width="2"/>
          <rect x="40" y="45" width="135" height="40" fill="#333" opacity="0.2"/>
          <line x1="60" y1="45" x2="60" y2="85" stroke="#333" stroke-width="1.5"/>
          <line x1="90" y1="45" x2="90" y2="85" stroke="#333" stroke-width="1.5"/>
          <line x1="120" y1="45" x2="120" y2="85" stroke="#333" stroke-width="1.5"/>
          <line x1="150" y1="45" x2="150" y2="85" stroke="#333" stroke-width="1.5"/>
        </g>
        <g class="vehicle-wheels">
          <circle cx="55" cy="105" r="16" fill="#333"/>
          <circle cx="55" cy="105" r="12" fill="#ffffff"/>
          <circle cx="55" cy="105" r="6" fill="#333"/>
          <circle cx="145" cy="105" r="16" fill="#333"/>
          <circle cx="145" cy="105" r="12" fill="#ffffff"/>
          <circle cx="145" cy="105" r="6" fill="#333"/>
        </g>
      </svg>`,
      'Crossover': `<svg viewBox="0 0 200 120" class="vehicle-svg">
        <g class="vehicle-body">
          <path d="M35 85 L45 50 L80 45 L130 45 L155 50 L165 85 L165 105 L35 105 Z" fill="#ffffff" stroke="#333" stroke-width="2"/>
          <rect x="50" y="50" width="110" height="35" fill="#333" opacity="0.2"/>
          <line x1="75" y1="50" x2="75" y2="85" stroke="#333" stroke-width="1.5"/>
          <line x1="135" y1="50" x2="135" y2="85" stroke="#333" stroke-width="1.5"/>
          <rect x="160" y="60" width="5" height="20" fill="#333"/>
        </g>
        <g class="vehicle-wheels">
          <circle cx="60" cy="105" r="14" fill="#333"/>
          <circle cx="60" cy="105" r="10" fill="#ffffff"/>
          <circle cx="60" cy="105" r="5" fill="#333"/>
          <circle cx="150" cy="105" r="14" fill="#333"/>
          <circle cx="150" cy="105" r="10" fill="#ffffff"/>
          <circle cx="150" cy="105" r="5" fill="#333"/>
        </g>
      </svg>`,
      'Motores': `<svg viewBox="0 0 200 120" class="vehicle-svg">
        <g class="vehicle-body">
          <path d="M60 70 L70 50 L90 45 L110 45 L130 50 L140 70 L140 85 L60 85 Z" fill="#ffffff" stroke="#333" stroke-width="2"/>
          <circle cx="100" cy="60" r="8" fill="#333" opacity="0.2"/>
          <line x1="100" y1="52" x2="100" y2="68" stroke="#333" stroke-width="1.5"/>
          <line x1="92" y1="60" x2="108" y2="60" stroke="#333" stroke-width="1.5"/>
        </g>
        <g class="vehicle-wheels">
          <circle cx="75" cy="85" r="18" fill="#333"/>
          <circle cx="75" cy="85" r="14" fill="#ffffff"/>
          <circle cx="75" cy="85" r="8" fill="#333"/>
          <circle cx="125" cy="85" r="18" fill="#333"/>
          <circle cx="125" cy="85" r="14" fill="#ffffff"/>
          <circle cx="125" cy="85" r="8" fill="#333"/>
        </g>
      </svg>`
    };
    return this.sanitizer.bypassSecurityTrustHtml(icons[typeName] || icons['Carros']);
  }
}
