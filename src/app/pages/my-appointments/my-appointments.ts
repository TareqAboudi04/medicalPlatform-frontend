import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { AppointmentService } from '../../core/services/appointment.service';
import { AuthService } from '../../core/services/auth.service';
import { AppointmentResponse } from '../../models/appointment-response.model';

@Component({
  selector: 'app-my-appointments',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './my-appointments.html',
  styleUrl: './my-appointments.css',
})
export class MyAppointments implements OnInit {
  appointments = signal<AppointmentResponse[]>([]);
  loading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
  selectedStatus = signal('ALL');

  statusOptions = ['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];
  userRole = '';
  private patientId = 0;
  private doctorId = 0;

  constructor(
    private appointmentService: AppointmentService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole() || '';

    if (!this.authService.isLoggedIn()) {
      this.errorMessage.set('Please login to view your appointments.');
      this.goToLogin();
      return;
    }

    if (this.userRole === 'PATIENT') {
      this.patientId = this.authService.getPatientId() || 0;

      if (!this.patientId) {
        this.errorMessage.set('Patient profile not found. Please login again.');
        this.authService.logout();
        this.goToLogin();
        return;
      }
    } else if (this.userRole === 'DOCTOR') {
      this.doctorId = this.authService.getDoctorId() || 0;

      if (!this.doctorId) {
        this.errorMessage.set('Doctor profile not found. Please login again.');
        this.authService.logout();
        this.goToLogin();
        return;
      }
    } else {
      this.router.navigate(['/']);
      return;
    }

    this.loadAppointments();
  }

  loadAppointments(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    const request = this.getAppointmentsRequest();

    request.subscribe({
      next: (data) => {
        this.appointments.set(data);
        this.loading.set(false);
      },
      error: (error) => {
        this.appointments.set([]);
        this.errorMessage.set(this.getErrorMessage(error, 'Failed to load appointments.'));
        this.loading.set(false);
      }
    });
  }

  onStatusChange(status: string): void {
    this.selectedStatus.set(status);
    this.successMessage.set('');
    this.loadAppointments();
  }

  canCancel(appointment: AppointmentResponse): boolean {
    return this.userRole === 'DOCTOR'
      && appointment.status !== 'COMPLETED'
      && appointment.status !== 'CANCELLED';
  }

  canApprove(appointment: AppointmentResponse): boolean {
    return this.userRole === 'DOCTOR' && appointment.status === 'PENDING';
  }

  approveAppointment(appointmentId: number): void {
    this.loading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.appointmentService.confirmAppointment(appointmentId).subscribe({
      next: (message) => {
        this.successMessage.set(message || 'Appointment approved successfully.');
        this.loadAppointments();
      },
      error: (error) => {
        this.errorMessage.set(this.getErrorMessage(error, 'Failed to approve appointment. Please try again.'));
        this.loading.set(false);
      }
    });
  }

  canComplete(appointment: AppointmentResponse): boolean {
    return this.userRole === 'DOCTOR'
      && (appointment.status === 'CONFIRMED' || appointment.status === 'PENDING');
  }

  canViewPrescription(appointment: AppointmentResponse): boolean {
    return appointment.status === 'COMPLETED';
  }

  canCreatePrescription(appointment: AppointmentResponse): boolean {
    return this.userRole === 'DOCTOR' && appointment.status === 'COMPLETED';
  }

  completeAppointment(appointmentId: number): void {
    this.loading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.appointmentService.completeAppointment(appointmentId).subscribe({
      next: (message) => {
        this.successMessage.set(message || 'Appointment completed successfully.');
        this.loadAppointments();
      },
      error: (error) => {
        this.errorMessage.set(this.getErrorMessage(error, 'Failed to complete appointment. Please try again.'));
        this.loading.set(false);
      }
    });
  }

  cancelAppointment(appointmentId: number): void {
    this.loading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.appointmentService.cancelAppointment(appointmentId).subscribe({
      next: (message) => {
        this.successMessage.set(message || 'Appointment cancelled successfully.');
        this.loadAppointments();
      },
      error: (error) => {
        this.errorMessage.set(this.getErrorMessage(error, 'Failed to update appointment. Please try again.'));
        this.loading.set(false);
      }
    });
  }

  private getAppointmentsRequest(): Observable<AppointmentResponse[]> {
    if (this.userRole === 'DOCTOR') {
      return this.selectedStatus() === 'ALL'
        ? this.appointmentService.getDoctorAppointments(this.doctorId)
        : this.appointmentService.getDoctorAppointmentsByStatus(this.doctorId, this.selectedStatus());
    }

    return this.selectedStatus() === 'ALL'
      ? this.appointmentService.getPatientAppointments(this.patientId)
      : this.appointmentService.getPatientAppointmentsByStatus(this.patientId, this.selectedStatus());
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

  private goToLogin(): void {
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 1200);
  }
}
