import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
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

  login() {
    this.error = '';
    this.isLoading = true;

    if (!this.username || !this.password) {
      this.error = 'Por favor completa todos los campos';
      this.isLoading = false;
      return;
    }

    this.authService.login(this.username, this.password).then((success) => {
      if (success) {
        const user = this.authService.getCurrentUser();
        // Si es admin, ir a admin, sino a la página de retorno
        if (user?.isAdmin) {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate([this.returnUrl || '/']);
        }
      } else {
        this.error = 'Usuario o contraseña incorrectos';
      }
      this.isLoading = false;
    }).catch((error) => {
      this.error = error || 'Error al iniciar sesión';
      this.isLoading = false;
    });
  }
}
