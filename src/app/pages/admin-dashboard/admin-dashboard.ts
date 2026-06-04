import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { AdminService } from '../../core/services/admin.service';
import { DashboardResponse } from '../../models/dashboard-response.model';
import { UserResponse } from '../../models/user-response.model';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit {
  dashboard = signal<DashboardResponse | null>(null);
  pendingDoctors = signal<UserResponse[]>([]);
  loading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.refreshDashboard();
  }

  loadDashboardCounts(): void {
    this.adminService.getDashboardCounts().subscribe({
      next: (data) => {
        this.dashboard.set(data);
      },
      error: () => {
        this.errorMessage.set('Failed to load dashboard counts.');
      }
    });
  }

  loadPendingDoctors(): void {
    this.adminService.getPendingDoctors().subscribe({
      next: (data) => {
        this.pendingDoctors.set(data);
      },
      error: () => {
        this.errorMessage.set('Failed to load pending doctors.');
      }
    });
  }

  refreshDashboard(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    forkJoin({
      dashboard: this.adminService.getDashboardCounts(),
      pendingDoctors: this.adminService.getPendingDoctors()
    }).subscribe({
      next: (data) => {
        this.dashboard.set(data.dashboard);
        this.pendingDoctors.set(data.pendingDoctors);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load admin dashboard.');
        this.loading.set(false);
      }
    });
  }

  approveDoctor(userId: number): void {
    this.runDoctorAction(
      this.adminService.approveDoctor(userId),
      'Doctor approved successfully.'
    );
  }

  rejectDoctor(userId: number): void {
    this.runDoctorAction(
      this.adminService.rejectDoctor(userId),
      'Doctor rejected successfully.'
    );
  }

  blockUser(userId: number): void {
    this.runDoctorAction(
      this.adminService.blockUser(userId),
      'User blocked successfully.'
    );
  }

  getDoctorName(doctor: UserResponse): string {
    const fullName = `${doctor.firstName || ''} ${doctor.lastName || ''}`.trim();
    return fullName || 'Not provided';
  }

  private runDoctorAction(request: Observable<string>, fallbackMessage: string): void {
    this.loading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    request.subscribe({
      next: (message) => {
        this.successMessage.set(message || fallbackMessage);
        this.refreshDashboard();
      },
      error: (error) => {
        this.errorMessage.set(this.getActionErrorMessage(error));
        this.loading.set(false);
      }
    });
  }

  private getActionErrorMessage(error: { error?: unknown }): string {
    if (typeof error.error === 'string' && error.error.trim()) {
      return error.error;
    }

    return 'Admin action failed. Please try again.';
  }
}
