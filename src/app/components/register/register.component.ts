import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  confirmPassword = '';
  error = '';
  isLoading = false;
  returnUrl = '/';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe(params => {
      this.returnUrl = params['returnUrl'] || '/';
    });
  }

  async register() {
    this.error = '';
    this.isLoading = true;

    // Validaciones
    if (!this.username || !this.email || !this.password || !this.confirmPassword) {
      this.error = 'Por favor completa todos los campos';
      this.isLoading = false;
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Las contraseñas no coinciden';
      this.isLoading = false;
      return;
    }

    if (this.password.length < 6) {
      this.error = 'La contraseña debe tener al menos 6 caracteres';
      this.isLoading = false;
      return;
    }

    if (!this.isValidEmail(this.email)) {
      this.error = 'Por favor ingresa un email válido';
      this.isLoading = false;
      return;
    }

    try {
      const success = await this.authService.register(this.username, this.email, this.password);
      
      if (success) {
        this.router.navigate([this.returnUrl || '/']);
      } else {
        this.error = 'El usuario o email ya está registrado';
      }
    } catch (err: any) {
      this.error = err || 'Error al registrar. Por favor intenta de nuevo.';
    }
    
    this.isLoading = false;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

