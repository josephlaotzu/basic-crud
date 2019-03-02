import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: '', // showcasing angular lazy loading
    loadChildren: './auth/auth.module#AuthModule'
  },
  {
    path: 'employees', // showcasing angular lazy loading
    loadChildren: './employees/employees.module#EmployeesModule',
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
