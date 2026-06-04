import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthResponse } from '../../models/auth-response.model';
import { DoctorRegisterRequest } from '../../models/doctor-register-request.model';
import { LoginRequest } from '../../models/login-request.model';
import { PatientRegisterRequest } from '../../models/patient-register-request.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request);
  }

  registerPatient(request: PatientRegisterRequest): Observable<string> {
    return this.http.post(`${this.apiUrl}/register/patient`, request, {
      responseType: 'text'
    });
  }

  registerDoctor(request: DoctorRegisterRequest): Observable<string> {
    return this.http.post(`${this.apiUrl}/register/doctor`, request, {
      responseType: 'text'
    });
  }

  saveAuthData(response: AuthResponse): void {
    localStorage.setItem('token', response.token);
    localStorage.setItem('userId', response.userId.toString());
    localStorage.setItem('email', response.email);
    localStorage.setItem('role', response.role);
    localStorage.setItem('status', response.status);
    localStorage.removeItem('patientId');
    localStorage.removeItem('doctorId');

    if (response.patientId !== null && response.patientId !== undefined) {
      localStorage.setItem('patientId', response.patientId.toString());
    }

    if (response.doctorId !== null && response.doctorId !== undefined) {
      localStorage.setItem('doctorId', response.doctorId.toString());
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserRole(): string | null {
    return localStorage.getItem('role');
  }

  getUserId(): number | null {
    const userId = localStorage.getItem('userId');
    return userId ? Number(userId) : null;
  }

  getPatientId(): number | null {
    const patientId = localStorage.getItem('patientId');
    return patientId ? Number(patientId) : null;
  }

  getDoctorId(): number | null {
    const doctorId = localStorage.getItem('doctorId');
    return doctorId ? Number(doctorId) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('patientId');
    localStorage.removeItem('doctorId');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
    localStorage.removeItem('status');
  }
}
