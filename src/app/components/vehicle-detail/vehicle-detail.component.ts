import { Component, OnInit, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { VehicleService, Vehicle } from '../../services/vehicle.service';
import { PriceFormatPipe } from '../../pipes/price-format.pipe';
import { VehicleConditionPipe } from '../../pipes/vehicle-condition.pipe';

@Component({
  selector: 'app-vehicle-detail',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    PriceFormatPipe,
    VehicleConditionPipe
  ],
  templateUrl: './vehicle-detail.component.html',
  styleUrl: './vehicle-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VehicleDetailComponent implements OnInit {
  vehicle = signal<Vehicle | undefined>(undefined);
  selectedImageIndex = signal(0);

  // Computed for current image
  currentImage = computed(() => {
    const vehicle = this.vehicle();
    const index = this.selectedImageIndex();
    if (vehicle?.images && vehicle.images.length > 0) {
      return vehicle.images[index];
    }
    return undefined;
  });

  // Computed for has images
  hasImages = computed(() => {
    const vehicle = this.vehicle();
    return vehicle?.images && vehicle.images.length > 0;
  });

  // Computed for has multiple images
  hasMultipleImages = computed(() => {
    const vehicle = this.vehicle();
    return vehicle?.images && vehicle.images.length > 1;
  });

  // Computed for features
  features = computed(() => {
    const vehicle = this.vehicle();
    return vehicle?.features || [];
  });

  // Computed for has features
  hasFeatures = computed(() => {
    return this.features().length > 0;
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vehicleService: VehicleService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const vehicleId = +params['id'];
      const vehicle = this.vehicleService.getVehicleById(vehicleId);
      
      if (!vehicle) {
        this.router.navigate(['/']);
        return;
      }
      
      this.vehicle.set(vehicle);
      this.selectedImageIndex.set(0);
    });
  }

  selectImage(index: number) {
    this.selectedImageIndex.set(index);
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
