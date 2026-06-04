import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DashboardResponse } from '../../models/dashboard-response.model';
import { UserResponse } from '../../models/user-response.model';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  getDashboardCounts(): Observable<DashboardResponse> {
    return this.http.get<DashboardResponse>(`${this.apiUrl}/dashboard`);
  }

  getPendingDoctors(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(`${this.apiUrl}/doctors/pending`);
  }

  approveDoctor(userId: number): Observable<string> {
    return this.http.put(`${this.apiUrl}/doctors/approve/${userId}`, null, {
      responseType: 'text'
    });
  }

  rejectDoctor(userId: number): Observable<string> {
    return this.http.put(`${this.apiUrl}/doctors/reject/${userId}`, null, {
      responseType: 'text'
    });
  }

  blockUser(userId: number): Observable<string> {
    return this.http.put(`${this.apiUrl}/doctors/block/${userId}`, null, {
      responseType: 'text'
    });
  }
}
