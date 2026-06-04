export interface PrescriptionResponse {
  prescriptionId: number;
  appointmentId: number;
  patientId: number;
  patientName: string;
  doctorId: number;
  doctorName: string;
  medicineName: string;
  instructions: string;
  createdAt: string;
}
