import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { VehicleDetailComponent } from './components/vehicle-detail/vehicle-detail.component';
import { SellComponent } from './components/sell/sell.component';
import { FinanceComponent } from './components/finance/finance.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AdminComponent } from './components/admin/admin.component';
import { SearchResultsComponent } from './components/search-results/search-results.component';
import { FavoritesComponent } from './components/favorites/favorites.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'search', component: SearchResultsComponent },
  { path: 'vehicle/:id', component: VehicleDetailComponent },
  { path: 'sell', component: SellComponent },
  { path: 'finance', component: FinanceComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'favorites', component: FavoritesComponent },
  { path: 'admin', component: AdminComponent },
  { path: '**', redirectTo: '' }
];
