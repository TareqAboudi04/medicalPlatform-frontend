import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PrescriptionRequest } from '../../models/prescription-request.model';
import { PrescriptionResponse } from '../../models/prescription-response.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PrescriptionService {
  private apiUrl = `${environment.apiUrl}/prescriptions`;

  constructor(private http: HttpClient) {}

  createPrescription(request: PrescriptionRequest): Observable<string> {
    return this.http.post(`${this.apiUrl}/create`, request, {
      responseType: 'text'
    });
  }

  getPrescriptionByAppointment(appointmentId: number): Observable<PrescriptionResponse> {
    return this.http.get<PrescriptionResponse>(`${this.apiUrl}/appointment/${appointmentId}`);
  }
}
