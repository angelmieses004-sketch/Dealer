import { Component, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { VehicleService, Vehicle } from '../../services/vehicle.service';
import { PriceFormatPipe } from '../../pipes/price-format.pipe';
import { VehicleConditionPipe } from '../../pipes/vehicle-condition.pipe';

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
    { name: 'Sedán', icon: '🚗', color: '#dc2626' },
    { name: 'Compacto', icon: '🚙', color: '#b91c1c' },
    { name: 'Jeepeta', icon: '🚙', color: '#ec4899' },
    { name: 'Camioneta', icon: '🚚', color: '#f59e0b' },
    { name: 'Coupé/Sport', icon: '🏎️', color: '#ef4444' }
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

  constructor(
    private vehicleService: VehicleService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {
    const vehicles = this.vehicleService.getVehicles()();
    this.vehiclesSignal.set(vehicles);
  }

  onSearch() {
    this.isSearching.set(true);
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

  getVehicleIcon(typeName: string): SafeHtml {
    const icons: { [key: string]: string } = {
      'Sedán': `<svg viewBox="0 0 200 120" class="vehicle-svg">
        <g class="vehicle-body">
          <path d="M40 80 L50 60 L90 50 L150 50 L160 60 L170 80 L170 100 L40 100 Z" fill="#ffffff" stroke="#dc2626" stroke-width="2"/>
          <rect x="50" y="60" width="100" height="30" fill="#dc2626" opacity="0.2"/>
          <line x1="70" y1="60" x2="70" y2="90" stroke="#dc2626" stroke-width="1.5"/>
          <line x1="130" y1="60" x2="130" y2="90" stroke="#dc2626" stroke-width="1.5"/>
        </g>
        <g class="vehicle-wheels">
          <circle cx="65" cy="100" r="12" fill="#dc2626"/>
          <circle cx="65" cy="100" r="8" fill="#ffffff"/>
          <circle cx="65" cy="100" r="4" fill="#dc2626"/>
          <circle cx="145" cy="100" r="12" fill="#dc2626"/>
          <circle cx="145" cy="100" r="8" fill="#ffffff"/>
          <circle cx="145" cy="100" r="4" fill="#dc2626"/>
        </g>
      </svg>`,
      'Compacto': `<svg viewBox="0 0 200 120" class="vehicle-svg">
        <g class="vehicle-body">
          <path d="M45 75 L55 55 L85 50 L125 50 L135 55 L145 75 L145 95 L45 95 Z" fill="#ffffff" stroke="#dc2626" stroke-width="2"/>
          <rect x="55" y="55" width="80" height="25" fill="#dc2626" opacity="0.2"/>
          <line x1="75" y1="55" x2="75" y2="80" stroke="#dc2626" stroke-width="1.5"/>
          <line x1="115" y1="55" x2="115" y2="80" stroke="#dc2626" stroke-width="1.5"/>
        </g>
        <g class="vehicle-wheels">
          <circle cx="60" cy="95" r="10" fill="#dc2626"/>
          <circle cx="60" cy="95" r="7" fill="#ffffff"/>
          <circle cx="60" cy="95" r="3" fill="#dc2626"/>
          <circle cx="140" cy="95" r="10" fill="#dc2626"/>
          <circle cx="140" cy="95" r="7" fill="#ffffff"/>
          <circle cx="140" cy="95" r="3" fill="#dc2626"/>
        </g>
      </svg>`,
      'Jeepeta': `<svg viewBox="0 0 200 120" class="vehicle-svg">
        <g class="vehicle-body">
          <path d="M35 85 L45 50 L80 45 L130 45 L155 50 L165 85 L165 105 L35 105 Z" fill="#ffffff" stroke="#dc2626" stroke-width="2"/>
          <rect x="50" y="50" width="110" height="35" fill="#dc2626" opacity="0.2"/>
          <line x1="75" y1="50" x2="75" y2="85" stroke="#dc2626" stroke-width="1.5"/>
          <line x1="135" y1="50" x2="135" y2="85" stroke="#dc2626" stroke-width="1.5"/>
          <rect x="160" y="60" width="5" height="20" fill="#dc2626"/>
        </g>
        <g class="vehicle-wheels">
          <circle cx="60" cy="105" r="14" fill="#dc2626"/>
          <circle cx="60" cy="105" r="10" fill="#ffffff"/>
          <circle cx="60" cy="105" r="5" fill="#dc2626"/>
          <circle cx="150" cy="105" r="14" fill="#dc2626"/>
          <circle cx="150" cy="105" r="10" fill="#ffffff"/>
          <circle cx="150" cy="105" r="5" fill="#dc2626"/>
        </g>
      </svg>`,
      'Camioneta': `<svg viewBox="0 0 200 120" class="vehicle-svg">
        <g class="vehicle-body">
          <path d="M30 90 L40 50 L70 45 L120 45 L150 50 L160 90 L160 110 L30 110 Z" fill="#ffffff" stroke="#dc2626" stroke-width="2"/>
          <rect x="45" y="50" width="115" height="40" fill="#dc2626" opacity="0.2"/>
          <line x1="70" y1="50" x2="70" y2="90" stroke="#dc2626" stroke-width="1.5"/>
          <line x1="130" y1="50" x2="130" y2="90" stroke="#dc2626" stroke-width="1.5"/>
          <rect x="160" y="60" width="8" height="30" fill="#dc2626"/>
        </g>
        <g class="vehicle-wheels">
          <circle cx="55" cy="110" r="15" fill="#dc2626"/>
          <circle cx="55" cy="110" r="11" fill="#ffffff"/>
          <circle cx="55" cy="110" r="6" fill="#dc2626"/>
          <circle cx="145" cy="110" r="15" fill="#dc2626"/>
          <circle cx="145" cy="110" r="11" fill="#ffffff"/>
          <circle cx="145" cy="110" r="6" fill="#dc2626"/>
        </g>
      </svg>`,
      'Coupé/Sport': `<svg viewBox="0 0 200 120" class="vehicle-svg">
        <g class="vehicle-body">
          <path d="M50 75 L60 55 L100 50 L140 50 L150 55 L160 75 L160 95 L50 95 Z" fill="#ffffff" stroke="#dc2626" stroke-width="2"/>
          <path d="M60 55 L100 50 L140 50 L150 55" fill="#dc2626" opacity="0.2"/>
          <line x1="80" y1="55" x2="80" y2="85" stroke="#dc2626" stroke-width="1.5"/>
          <line x1="120" y1="55" x2="120" y2="85" stroke="#dc2626" stroke-width="1.5"/>
        </g>
        <g class="vehicle-wheels">
          <circle cx="70" cy="95" r="11" fill="#dc2626"/>
          <circle cx="70" cy="95" r="8" fill="#ffffff"/>
          <circle cx="70" cy="95" r="4" fill="#dc2626"/>
          <circle cx="150" cy="95" r="11" fill="#dc2626"/>
          <circle cx="150" cy="95" r="8" fill="#ffffff"/>
          <circle cx="150" cy="95" r="4" fill="#dc2626"/>
        </g>
      </svg>`
    };
    return this.sanitizer.bypassSecurityTrustHtml(icons[typeName] || icons['Sedán']);
  }
}
