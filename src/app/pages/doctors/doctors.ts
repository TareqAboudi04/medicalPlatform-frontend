import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { DoctorService } from '../../core/services/doctor.service';
import { Doctor } from '../../models/doctor.model';

@Component({
  selector: 'app-doctors',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './doctors.html',
  styleUrl: './doctors.css',
})
export class Doctors {
  doctors = signal<Doctor[]>([]);
  loading = signal(false);
  errorMessage = signal('');

  specialty = '';
  name = '';
  location = '';

  constructor(private doctorService: DoctorService) {}

  ngOnInit(): void {
    this.getAllDoctors();
  }

  getAllDoctors(): void {
    this.runDoctorRequest(this.doctorService.getAllDoctors());
  }

  searchBySpecialty(): void {
    if (!this.specialty.trim()) {
      this.getAllDoctors();
      return;
    }

    this.runDoctorRequest(this.doctorService.searchBySpecialty(this.specialty.trim()));
  }

  searchByName(): void {
    if (!this.name.trim()) {
      this.getAllDoctors();
      return;
    }

    this.runDoctorRequest(this.doctorService.searchByName(this.name.trim()));
  }

  searchByLocation(): void {
    if (!this.location.trim()) {
      this.getAllDoctors();
      return;
    }

    this.runDoctorRequest(this.doctorService.searchByLocation(this.location.trim()));
  }

  private runDoctorRequest(request: Observable<Doctor[]>): void {
    this.loading.set(true);
    this.errorMessage.set('');

    request.subscribe({
      next: (data) => {
        this.doctors.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.doctors.set([]);
        this.errorMessage.set('Failed to load doctors');
        this.loading.set(false);
      }
    });
  }
}
