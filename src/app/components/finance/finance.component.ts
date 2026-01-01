import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-finance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './finance.component.html',
  styleUrl: './finance.component.css'
})
export class FinanceComponent {
  financing = {
    vehiclePrice: 0,
    years: 1,
    monthlyPayment: 0,
    totalPayment: 0,
    totalInterest: 0
  };

  financingYears = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  annualRate = 0.12; // 12% annual rate

  calculateFinancing() {
    const monthlyRate = this.annualRate / 12;
    const numPayments = this.financing.years * 12;
    
    if (this.financing.vehiclePrice > 0 && numPayments > 0) {
      const numerator = this.financing.vehiclePrice * monthlyRate * Math.pow(1 + monthlyRate, numPayments);
      const denominator = Math.pow(1 + monthlyRate, numPayments) - 1;
      this.financing.monthlyPayment = numerator / denominator;
      this.financing.totalPayment = this.financing.monthlyPayment * numPayments;
      this.financing.totalInterest = this.financing.totalPayment - this.financing.vehiclePrice;
    } else {
      this.financing.monthlyPayment = 0;
      this.financing.totalPayment = 0;
      this.financing.totalInterest = 0;
    }
  }
}
