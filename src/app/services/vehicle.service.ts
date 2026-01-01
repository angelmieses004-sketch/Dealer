import { Injectable, signal } from '@angular/core';

export interface Vehicle {
  id: number;
  year: number;
  brand: string;
  model: string;
  price: number;
  currency: 'US$' | 'RD$';
  type?: string;
  mileage?: number;
  condition?: 'nuevo' | 'usado';
  location?: string;
  description?: string;
  image?: string;
  images?: string[]; // Array de imágenes en base64
  features?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private vehicles = signal<Vehicle[]>([
    { 
      id: 1, 
      year: 2019, 
      brand: 'BMW', 
      model: 'X5', 
      price: 24900, 
      currency: 'US$',
      type: 'Jeepeta',
      mileage: 45000,
      condition: 'usado',
      location: 'Santo Domingo',
      description: 'BMW X5 en excelente estado, completamente equipado, un solo dueño.',
      features: ['Aire acondicionado', 'Sistema de sonido premium', 'Cámara de reversa', 'Asientos de cuero'],
      images: [
        'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1606664515525-4c1f588a51c0?w=800&auto=format&fit=crop'
      ]
    },
    { 
      id: 2, 
      year: 2017, 
      brand: 'Porsche', 
      model: 'Panamera', 
      price: 105000, 
      currency: 'US$',
      type: 'Sedán',
      mileage: 32000,
      condition: 'usado',
      location: 'Santo Domingo',
      description: 'Porsche Panamera de lujo, perfecto estado, todos los servicios al día.',
      features: ['Panoramic sunroof', 'Sistema de sonido BOSE', 'Asientos masajeadores', 'Pilotaje automático'],
      images: [
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1544636339-e6699e7d5f6c?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=800&auto=format&fit=crop'
      ]
    },
    { 
      id: 3, 
      year: 2017, 
      brand: 'Nissan', 
      model: 'Pathfinder', 
      price: 13000, 
      currency: 'US$',
      type: 'Camioneta',
      mileage: 68000,
      condition: 'usado',
      location: 'Santiago',
      description: 'Nissan Pathfinder espaciosa, ideal para familia, muy bien mantenida.',
      features: ['7 asientos', 'Control de tracción', 'Sistema de navegación', 'Bluetooth'],
      images: [
        'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1492144534655-ae79c2c03451?w=800&auto=format&fit=crop'
      ]
    },
    { 
      id: 4, 
      year: 2014, 
      brand: 'Nissan', 
      model: 'Pathfinder', 
      price: 790000, 
      currency: 'RD$',
      type: 'Camioneta',
      mileage: 95000,
      condition: 'usado',
      location: 'Santo Domingo',
      description: 'Nissan Pathfinder 2014, buen estado general, precio negociable.',
      features: ['Aire acondicionado', 'Sistema de audio', 'Cámara de reversa'],
      images: [
        'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1492144534655-ae79c2c03451?w=800&auto=format&fit=crop'
      ]
    },
    { 
      id: 5, 
      year: 2024, 
      brand: 'Toyota', 
      model: 'Corolla', 
      price: 30000, 
      currency: 'US$',
      type: 'Sedán',
      mileage: 0,
      condition: 'nuevo',
      location: 'Santo Domingo',
      description: 'Toyota Corolla 2024 completamente nuevo, garantía de fábrica.',
      features: ['Apple CarPlay', 'Android Auto', 'Cámara de reversa', 'Sensores de estacionamiento', 'Asistente de carril'],
      images: [
        'https://images.unsplash.com/photo-1606664515525-4c1f588a51c0?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1492144534655-ae79c2c03451?w=800&auto=format&fit=crop'
      ]
    },
    { 
      id: 6, 
      year: 2013, 
      brand: 'Honda', 
      model: 'Civic', 
      price: 698000, 
      currency: 'RD$',
      type: 'Compacto',
      mileage: 120000,
      condition: 'usado',
      location: 'Santiago',
      description: 'Honda Civic confiable, económico, perfecto para ciudad.',
      features: ['Aire acondicionado', 'Radio CD', 'Espejos eléctricos'],
      images: [
        'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1492144534655-ae79c2c03451?w=800&auto=format&fit=crop'
      ]
    },
    { 
      id: 7, 
      year: 2020, 
      brand: 'Mazda', 
      model: 'CX-5', 
      price: 25200, 
      currency: 'US$',
      type: 'Jeepeta',
      mileage: 35000,
      condition: 'usado',
      location: 'Santo Domingo',
      description: 'Mazda CX-5 2020, excelente diseño, muy bien cuidado.',
      features: ['Sistema de seguridad i-Activsense', 'Cámara 360°', 'Asientos de cuero', 'Sistema de sonido premium'],
      images: [
        'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1544636339-e6699e7d5f6c?w=800&auto=format&fit=crop'
      ]
    },
    { 
      id: 8, 
      year: 2023, 
      brand: 'Suzuki', 
      model: 'Swift', 
      price: 20000, 
      currency: 'US$',
      type: 'Compacto',
      mileage: 15000,
      condition: 'usado',
      location: 'Santo Domingo',
      description: 'Suzuki Swift 2023, casi nuevo, excelente consumo de combustible.',
      features: ['Apple CarPlay', 'Cámara de reversa', 'Sensores de estacionamiento', 'Control de estabilidad'],
      images: [
        'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&auto=format&fit=crop'
      ]
    }
  ]);

  getVehicles() {
    return this.vehicles.asReadonly();
  }

  getVehicleById(id: number): Vehicle | undefined {
    return this.vehicles().find(v => v.id === id);
  }

  searchVehicles(filters: {
    brand?: string;
    model?: string;
    yearFrom?: number;
    yearTo?: number;
    priceTo?: number;
    location?: string;
    condition?: string;
    type?: string;
  }): Vehicle[] {
    let results = [...this.vehicles()];

    if (filters.brand) {
      results = results.filter(v => 
        v.brand.toLowerCase().includes(filters.brand!.toLowerCase())
      );
    }

    if (filters.model) {
      results = results.filter(v => 
        v.model.toLowerCase().includes(filters.model!.toLowerCase())
      );
    }

    if (filters.yearFrom) {
      results = results.filter(v => v.year >= filters.yearFrom!);
    }

    if (filters.yearTo) {
      results = results.filter(v => v.year <= filters.yearTo!);
    }

    if (filters.priceTo) {
      results = results.filter(v => {
        // Convert to RD$ for comparison (approximate 1 US$ = 58 RD$)
        const priceInRD = v.currency === 'US$' ? v.price * 58 : v.price;
        return priceInRD <= filters.priceTo!;
      });
    }

    if (filters.location) {
      results = results.filter(v => 
        v.location?.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    if (filters.condition) {
      results = results.filter(v => v.condition === filters.condition);
    }

    if (filters.type) {
      results = results.filter(v => v.type?.toLowerCase() === filters.type!.toLowerCase());
    }

    return results;
  }

  addVehicle(vehicle: Omit<Vehicle, 'id'>) {
    const newId = Math.max(...this.vehicles().map(v => v.id), 0) + 1;
    const newVehicle: Vehicle = { ...vehicle, id: newId };
    this.vehicles.update(v => [...v, newVehicle]);
    return newVehicle;
  }

  deleteVehicle(id: number) {
    this.vehicles.update(v => v.filter(vehicle => vehicle.id !== id));
  }

  updateVehicle(id: number, updates: Partial<Vehicle>) {
    this.vehicles.update(v => 
      v.map(vehicle => vehicle.id === id ? { ...vehicle, ...updates } : vehicle)
    );
  }
}
