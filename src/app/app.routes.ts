import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { VehicleDetailComponent } from './components/vehicle-detail/vehicle-detail.component';
import { SellComponent } from './components/sell/sell.component';
import { FinanceComponent } from './components/finance/finance.component';
import { LoginComponent } from './components/login/login.component';
import { AdminComponent } from './components/admin/admin.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'vehicle/:id', component: VehicleDetailComponent },
  { path: 'sell', component: SellComponent },
  { path: 'finance', component: FinanceComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminComponent },
  { path: '**', redirectTo: '' }
];
