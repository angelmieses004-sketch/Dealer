import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'vehicleCondition',
  standalone: true
})
export class VehicleConditionPipe implements PipeTransform {
  transform(condition: 'nuevo' | 'usado' | undefined): string {
    return condition === 'nuevo' ? 'Nuevo' : 'Usado';
  }
}

