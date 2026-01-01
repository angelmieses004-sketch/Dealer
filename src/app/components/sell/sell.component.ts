import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sell',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sell.component.html',
  styleUrl: './sell.component.css'
})
export class SellComponent {
  tips = [
    {
      title: 'Fotografías de calidad',
      description: 'Toma fotos claras y desde diferentes ángulos. La buena iluminación es clave para mostrar tu vehículo en su mejor forma.'
    },
    {
      title: 'Descripción detallada',
      description: 'Incluye información sobre el estado del vehículo, mantenimientos realizados, y cualquier característica especial.'
    },
    {
      title: 'Precio competitivo',
      description: 'Investiga precios similares en el mercado para establecer un precio justo y atractivo.'
    },
    {
      title: 'Mantenimiento al día',
      description: 'Asegúrate de tener todos los documentos y mantenimientos al día antes de publicar.'
    }
  ];
}
