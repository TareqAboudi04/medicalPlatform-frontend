import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppointmentService } from '../../core/services/appointment.service';
import { AuthService } from '../../core/services/auth.service';
import { AppointmentRequest } from '../../models/appointment-request.model';

@Component({
  selector: 'app-book-appointment',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './book-appointment.html',
  styleUrl: './book-appointment.css',
})
export class BookAppointment implements OnInit {
  loading = signal(false);
  checkingAvailability = signal(false);
  available = signal<boolean | null>(null);
  errorMessage = signal('');
  successMessage = signal('');
  appointmentForm: FormGroup;

  private doctorId = 0;
  private patientId = 0;

  constructor(
    private formBuilder: FormBuilder,
    private appointmentService: AppointmentService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.appointmentForm = this.formBuilder.group({
      appointmentDate: ['', Validators.required],
      appointmentTime: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.doctorId = Number(this.route.snapshot.paramMap.get('doctorId'));
    this.patientId = this.authService.getPatientId() || 0;

    if (!this.patientId) {
      this.errorMessage.set('Patient profile not found. Please login again.');
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 800);
      return;
    }

    if (this.authService.getUserRole() !== 'PATIENT') {
      this.errorMessage.set('Only patients can book appointments.');
      setTimeout(() => {
        this.router.navigate(['/doctors']);
      }, 1000);
    }
  }

  get appointmentDate() {
    return this.appointmentForm.get('appointmentDate');
  }

  get appointmentTime() {
    return this.appointmentForm.get('appointmentTime');
  }

  checkAvailability(): void {
    this.errorMessage.set('');
    this.successMessage.set('');
    this.available.set(null);

    if (this.appointmentForm.invalid) {
      this.appointmentForm.markAllAsTouched();
      return;
    }

    this.checkingAvailability.set(true);
    const appointmentDate = this.appointmentDate?.value;
    const appointmentTime = this.appointmentTime?.value;

    this.appointmentService.isSpotAvailable(this.doctorId, appointmentDate, appointmentTime).subscribe({
      next: (isAvailable) => {
        this.available.set(isAvailable);
        this.checkingAvailability.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to check availability.');
        this.checkingAvailability.set(false);
      }
    });
  }

  bookAppointment(): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    if (!this.patientId) {
      this.errorMessage.set('Patient profile not found. Please login again.');
      this.router.navigate(['/login']);
      return;
    }

    if (this.authService.getUserRole() !== 'PATIENT') {
      this.errorMessage.set('Only patients can book appointments.');
      return;
    }

    if (this.appointmentForm.invalid) {
      this.appointmentForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);

    const request: AppointmentRequest = {
      patientId: this.patientId,
      doctorId: this.doctorId,
      appointmentDate: this.appointmentDate?.value,
      appointmentTime: this.appointmentTime?.value
    };

    this.appointmentService.createAppointment(request).subscribe({
      next: (message) => {
        this.successMessage.set(message || 'Appointment booked successfully.');
        this.loading.set(false);

        setTimeout(() => {
          this.router.navigate(['/my-appointments']);
        }, 1200);
      },
      error: (error) => {
        this.errorMessage.set(this.getErrorMessage(error, 'Failed to book appointment. Please try again.'));
        this.loading.set(false);
      }
    });
  }

  private getErrorMessage(error: { error?: unknown }, fallbackMessage: string): string {
    if (typeof error.error === 'string' && error.error.trim()) {
      return error.error;
    }

    if (this.hasMessage(error.error)) {
      return error.error.message;
    }

    return fallbackMessage;
  }

  private hasMessage(value: unknown): value is { message: string } {
    return typeof value === 'object'
      && value !== null
      && 'message' in value
      && typeof (value as { message: unknown }).message === 'string';
  }
}
