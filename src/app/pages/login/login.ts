import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LoginRequest } from '../../models/login-request.model';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loading = signal(false);
  errorMessage = signal('');
  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit(): void {
    this.errorMessage.set('');

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const request = this.loginForm.value as LoginRequest;

    this.authService.login(request).subscribe({
      next: (response) => {
        this.authService.saveAuthData(response);
        this.loading.set(false);

        if (response.role === 'ADMIN') {
          this.router.navigate(['/admin/dashboard']);
          return;
        }

        this.router.navigate(['/']);
      },
      error: () => {
        this.errorMessage.set('Login failed. Please check your email and password.');
        this.loading.set(false);
      }
    });
  }
}
