import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';
import { BookAppointment } from './pages/book-appointment/book-appointment';
import { CreatePrescription } from './pages/create-prescription/create-prescription';
import { Doctors } from './pages/doctors/doctors';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { MyAppointments } from './pages/my-appointments/my-appointments';
import { DoctorSignup } from './pages/signup/doctor-signup/doctor-signup';
import { PatientSignup } from './pages/signup/patient-signup/patient-signup';
import { ViewPrescription } from './pages/view-prescription/view-prescription';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'doctors', component: Doctors },
  { path: 'login', component: Login },
  { path: 'signup/patient', component: PatientSignup },
  { path: 'signup/doctor', component: DoctorSignup },
  { path: 'book-appointment/:doctorId', component: BookAppointment },
  { path: 'my-appointments', component: MyAppointments },
  { path: 'doctor-appointments', component: MyAppointments },
  { path: 'prescriptions/create/:appointmentId', component: CreatePrescription },
  { path: 'prescriptions/appointment/:appointmentId', component: ViewPrescription },
  { path: 'admin/dashboard', component: AdminDashboard, canActivate: [adminGuard] }
];
