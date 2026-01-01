import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { VehicleService, Vehicle } from '../../services/vehicle.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  vehicles: Vehicle[] = [];
  isAuthenticated = false;
  showAddForm = false;

  newVehicle: Omit<Vehicle, 'id'> = {
    year: new Date().getFullYear(),
    brand: '',
    model: '',
    price: 0,
    currency: 'RD$',
    type: '',
    mileage: 0,
    condition: 'usado',
    location: '',
    description: '',
    images: [],
    features: []
  };

  editingVehicle: Vehicle | null = null;
  newFeature = '';
  selectedImages: File[] = [];
  imagePreviews: string[] = [];

  constructor(
    private vehicleService: VehicleService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.isAuthenticated = this.authService.getIsAuthenticated();
    if (!this.isAuthenticated) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadVehicles();
  }

  loadVehicles() {
    this.vehicles = this.vehicleService.getVehicles()();
  }

  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
    this.editingVehicle = null;
    this.resetForm();
  }

  resetForm() {
    this.newVehicle = {
      year: new Date().getFullYear(),
      brand: '',
      model: '',
      price: 0,
      currency: 'RD$',
      type: '',
      mileage: 0,
      condition: 'usado',
      location: '',
      description: '',
      images: [],
      features: []
    };
    this.newFeature = '';
    this.selectedImages = [];
    this.imagePreviews = [];
  }

  addFeature() {
    if (this.newFeature.trim()) {
      if (!this.newVehicle.features) {
        this.newVehicle.features = [];
      }
      this.newVehicle.features.push(this.newFeature.trim());
      this.newFeature = '';
    }
  }

  removeFeature(index: number) {
    if (this.newVehicle.features) {
      this.newVehicle.features.splice(index, 1);
    }
  }

  async saveVehicle() {
    if (!this.newVehicle.brand || !this.newVehicle.model || !this.newVehicle.type) {
      alert('Por favor completa los campos requeridos');
      return;
    }

    // Convertir imágenes a base64
    const images = await this.convertImagesToBase64();
    this.newVehicle.images = images;

    if (this.editingVehicle) {
      this.vehicleService.updateVehicle(this.editingVehicle.id, this.newVehicle);
    } else {
      this.vehicleService.addVehicle(this.newVehicle);
    }

    this.loadVehicles();
    this.toggleAddForm();
    this.resetForm();
  }

  editVehicle(vehicle: Vehicle) {
    this.editingVehicle = vehicle;
    this.newVehicle = { 
      ...vehicle,
      images: vehicle.images ? [...vehicle.images] : []
    };
    this.imagePreviews = vehicle.images ? [...vehicle.images] : [];
    this.selectedImages = [];
    this.showAddForm = true;
  }

  onImageSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const files = Array.from(input.files);
      
      // Limitar a 10 imágenes
      const remainingSlots = 10 - this.imagePreviews.length;
      const filesToAdd = files.slice(0, remainingSlots);
      
      filesToAdd.forEach(file => {
        if (file.type.startsWith('image/')) {
          this.selectedImages.push(file);
          const reader = new FileReader();
          reader.onload = (e) => {
            const result = e.target?.result as string;
            if (result) {
              this.imagePreviews.push(result);
            }
          };
          reader.readAsDataURL(file);
        }
      });
      
      if (files.length > remainingSlots) {
        alert(`Solo se pueden agregar hasta 10 imágenes. Se agregaron ${remainingSlots} imágenes.`);
      }
    }
  }

  removeImage(index: number) {
    this.imagePreviews.splice(index, 1);
    if (index < this.selectedImages.length) {
      this.selectedImages.splice(index, 1);
    }
  }

  convertImagesToBase64(): Promise<string[]> {
    return new Promise((resolve) => {
      if (this.selectedImages.length === 0) {
        resolve(this.imagePreviews.filter(img => img.startsWith('data:image')));
        return;
      }

      const base64Images: string[] = [];
      let processed = 0;

      this.selectedImages.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          if (result) {
            base64Images.push(result);
          }
          processed++;
          if (processed === this.selectedImages.length) {
            // Mantener las imágenes existentes que ya están en base64
            const existingImages = this.imagePreviews.filter(img => 
              img.startsWith('data:image') && !base64Images.includes(img)
            );
            resolve([...existingImages, ...base64Images]);
          }
        };
        reader.readAsDataURL(file);
      });

      if (this.selectedImages.length === 0) {
        resolve(this.imagePreviews.filter(img => img.startsWith('data:image')));
      }
    });
  }

  deleteVehicle(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este vehículo?')) {
      this.vehicleService.deleteVehicle(id);
      this.loadVehicles();
    }
  }

  logout() {
    this.authService.logout();
  }

  formatPrice(price: number, currency: string): string {
    return `${currency} ${price.toLocaleString()}`;
  }
}
