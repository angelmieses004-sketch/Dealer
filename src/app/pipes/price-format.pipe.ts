import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'priceFormat',
  standalone: true
})
export class PriceFormatPipe implements PipeTransform {
  transform(price: number, currency: string): string {
    return `${currency} ${price.toLocaleString('es-DO')}`;
  }
}

