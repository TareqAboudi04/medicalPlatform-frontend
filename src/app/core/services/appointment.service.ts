import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppointmentRequest } from '../../models/appointment-request.model';
import { AppointmentResponse } from '../../models/appointment-response.model';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private readonly apiUrl = 'http://localhost:8080/api/appointments';

  constructor(private http: HttpClient) {}

  getDoctorAppointments(doctorId: number): Observable<AppointmentResponse[]> {
    return this.http.get<AppointmentResponse[]>(`${this.apiUrl}/doctor/${doctorId}`);
  }

  getPatientAppointments(patientId: number): Observable<AppointmentResponse[]> {
    return this.http.get<AppointmentResponse[]>(`${this.apiUrl}/patient/${patientId}`);
  }

  createAppointment(request: AppointmentRequest): Observable<string> {
    return this.http.post(`${this.apiUrl}/create/appointment`, request, {
      responseType: 'text'
    });
  }

  getDoctorAppointmentsByStatus(doctorId: number, status: string): Observable<AppointmentResponse[]> {
    const params = new HttpParams().set('status', status);
    return this.http.get<AppointmentResponse[]>(`${this.apiUrl}/doctor/${doctorId}/status`, { params });
  }

  getPatientAppointmentsByStatus(patientId: number, status: string): Observable<AppointmentResponse[]> {
    const params = new HttpParams().set('status', status);
    return this.http.get<AppointmentResponse[]>(`${this.apiUrl}/patient/${patientId}/status`, { params });
  }

  getDoctorSchedule(doctorId: number, startDate: string, endDate: string): Observable<AppointmentResponse[]> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);

    return this.http.get<AppointmentResponse[]>(`${this.apiUrl}/doctor/${doctorId}/schedule`, { params });
  }

  isSpotAvailable(doctorId: number, appointmentDate: string, appointmentTime: string): Observable<boolean> {
    const params = new HttpParams()
      .set('appointmentDate', appointmentDate)
      .set('appointmentTime', appointmentTime);

    return this.http.get<boolean>(`${this.apiUrl}/doctor/${doctorId}/availability`, { params });
  }

  confirmAppointment(appointmentId: number): Observable<string> {
    return this.http.put(`${this.apiUrl}/${appointmentId}/confirm`, null, {
      responseType: 'text'
    });
  }

  completeAppointment(appointmentId: number): Observable<string> {
    return this.http.put(`${this.apiUrl}/${appointmentId}/complete`, null, {
      responseType: 'text'
    });
  }

  cancelAppointment(appointmentId: number): Observable<string> {
    return this.http.put(`${this.apiUrl}/${appointmentId}/cancel`, null, {
      responseType: 'text'
    });
  }
}
