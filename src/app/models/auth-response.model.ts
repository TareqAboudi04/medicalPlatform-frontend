export interface AuthResponse {
  token: string;
  userId: number;
  patientId?: number | null;
  doctorId?: number | null;
  email: string;
  role: string;
  status: string;
}
