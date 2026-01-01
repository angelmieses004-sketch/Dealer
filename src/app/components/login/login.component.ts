import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login() {
    this.error = '';
    this.isLoading = true;

    if (!this.username || !this.password) {
      this.error = 'Por favor completa todos los campos';
      this.isLoading = false;
      return;
    }

    const success = this.authService.login(this.username, this.password);
    
    if (success) {
      this.router.navigate(['/admin']);
    } else {
      this.error = 'Usuario o contraseña incorrectos';
    }
    
    this.isLoading = false;
  }
}
