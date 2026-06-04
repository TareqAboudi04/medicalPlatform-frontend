import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PrescriptionService } from '../../core/services/prescription.service';
import { PrescriptionRequest } from '../../models/prescription-request.model';

@Component({
  selector: 'app-create-prescription',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-prescription.html',
  styleUrl: './create-prescription.css',
})
export class CreatePrescription implements OnInit {
  loading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
  prescriptionForm: FormGroup;

  private appointmentId = 0;

  constructor(
    private formBuilder: FormBuilder,
    private prescriptionService: PrescriptionService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.prescriptionForm = this.formBuilder.group({
      medicineName: ['', Validators.required],
      instructions: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.appointmentId = Number(this.route.snapshot.paramMap.get('appointmentId'));

    if (!this.appointmentId) {
      this.errorMessage.set('Appointment not found.');
    }
  }

  get medicineName() {
    return this.prescriptionForm.get('medicineName');
  }

  get instructions() {
    return this.prescriptionForm.get('instructions');
  }

  onSubmit(): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    if (this.prescriptionForm.invalid) {
      this.prescriptionForm.markAllAsTouched();
      return;
    }

    if (!this.appointmentId) {
      this.errorMessage.set('Appointment not found.');
      return;
    }

    this.loading.set(true);

    const request: PrescriptionRequest = {
      appointmentId: this.appointmentId,
      medicineName: this.medicineName?.value,
      instructions: this.instructions?.value
    };

    this.prescriptionService.createPrescription(request).subscribe({
      next: () => {
        this.successMessage.set('Prescription created successfully.');
        this.loading.set(false);

        setTimeout(() => {
          this.router.navigate(['/doctor-appointments']);
        }, 1200);
      },
      error: (error) => {
        this.errorMessage.set(this.getErrorMessage(error, 'Failed to create prescription. Please try again.'));
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
