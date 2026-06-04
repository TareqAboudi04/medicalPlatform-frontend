import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { PatientRegisterRequest } from '../../../models/patient-register-request.model';

@Component({
  selector: 'app-patient-signup',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './patient-signup.html',
  styleUrl: './patient-signup.css',
})
export class PatientSignup {
  loading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
  signupForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signupForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', Validators.required],
      dateOfBirth: ['', Validators.required]
    });
  }

  get email() {
    return this.signupForm.get('email');
  }

  get password() {
    return this.signupForm.get('password');
  }

  get firstName() {
    return this.signupForm.get('firstName');
  }

  get lastName() {
    return this.signupForm.get('lastName');
  }

  get phone() {
    return this.signupForm.get('phone');
  }

  get dateOfBirth() {
    return this.signupForm.get('dateOfBirth');
  }

  onSubmit(): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const request = this.signupForm.value as PatientRegisterRequest;

    this.authService.registerPatient(request).subscribe({
      next: (message) => {
        this.successMessage.set(message || 'Patient account created successfully.');
        this.loading.set(false);

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1200);
      },
      error: (error) => {
        this.errorMessage.set(this.getRegisterErrorMessage(error));
        this.loading.set(false);
      }
    });
  }

  private getRegisterErrorMessage(error: { error?: unknown }): string {
    if (typeof error.error === 'string' && error.error.trim()) {
      return error.error;
    }

    return 'Registration failed. Please check your information and try again.';
  }
}
