import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Doctor } from '../../models/doctor.model';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private readonly apiUrl = 'http://localhost:8080/api/doctors';

  constructor(private http: HttpClient) {}

  getAllDoctors(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(this.apiUrl);
  }

  searchBySpecialty(specialty: string): Observable<Doctor[]> {
    const params = new HttpParams().set('specialty', specialty);
    return this.http.get<Doctor[]>(`${this.apiUrl}/search/specialty`, { params });
  }

  searchByName(name: string): Observable<Doctor[]> {
    const params = new HttpParams().set('name', name);
    return this.http.get<Doctor[]>(`${this.apiUrl}/search/name`, { params });
  }

  searchByLocation(location: string): Observable<Doctor[]> {
    const params = new HttpParams().set('location', location);
    return this.http.get<Doctor[]>(`${this.apiUrl}/search/location`, { params });
  }
}
