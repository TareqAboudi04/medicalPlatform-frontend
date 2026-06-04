import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PrescriptionService } from '../../core/services/prescription.service';
import { PrescriptionResponse } from '../../models/prescription-response.model';

@Component({
  selector: 'app-view-prescription',
  imports: [CommonModule, RouterLink],
  templateUrl: './view-prescription.html',
  styleUrl: './view-prescription.css',
})
export class ViewPrescription implements OnInit {
  prescription = signal<PrescriptionResponse | null>(null);
  loading = signal(false);
  errorMessage = signal('');

  private appointmentId = 0;

  constructor(
    private prescriptionService: PrescriptionService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.appointmentId = Number(this.route.snapshot.paramMap.get('appointmentId'));

    if (!this.appointmentId) {
      this.errorMessage.set('Appointment not found.');
      return;
    }

    this.loadPrescription();
  }

  loadPrescription(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.prescriptionService.getPrescriptionByAppointment(this.appointmentId).subscribe({
      next: (data) => {
        this.prescription.set(data);
        this.loading.set(false);
      },
      error: (error) => {
        this.prescription.set(null);
        this.errorMessage.set(this.getErrorMessage(error, 'No prescription found for this appointment.'));
        this.loading.set(false);
      }
    });
  }

  formatCreatedAt(createdAt: string): string {
    const date = new Date(createdAt);

    if (Number.isNaN(date.getTime())) {
      return createdAt;
    }

    const day = this.padDatePart(date.getDate());
    const month = this.padDatePart(date.getMonth() + 1);
    const year = date.getFullYear();
    const hours = this.padDatePart(date.getHours());
    const minutes = this.padDatePart(date.getMinutes());

    return `${day}-${month}-${year} ${hours}:${minutes}`;
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

  private padDatePart(value: number): string {
    return value.toString().padStart(2, '0');
  }
}
