import { Component, OnInit } from '@angular/core';
import { EmployeesService } from '../employees.service';
import { Employees } from '../employees';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {

  employees: Observable<Employees[]>;
  constructor(private employeesService: EmployeesService) { }

  ngOnInit() {
    this.employees = this.employeesService.getAllEmployees();
  }

  getAge(bdate) {
    const today = new Date();
    const birthDate = bdate.toDate();
    let ageYear = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    let month = m;
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      ageYear--;
    }
    if (m < 0) {
      month = 12 + m;
    }
    return ageYear + (ageYear > 1 ? 'yrs, ' : 'yr ') + month + (month > 1 ? 'months' : 'month');
  }

  getTenure(dhired) {
    return this.getAge(dhired);
  }

  deleteEmployee(id) {
    const c = confirm('Are you sure?');
    if (c === true) {
      this.employeesService.deleteEmployee(id).then(() => {
        console.log('deleted');
      });
    }
  }
}
