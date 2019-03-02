import { Component, OnInit } from '@angular/core';
import { NgForm, FormArray } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeesService } from '../employees.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.css']
})
export class EmployeeDetailComponent implements OnInit {

  employeeForm: FormGroup;
  contactInfoArray: FormArray;
  addressInfoArray: FormArray;
  submitted: boolean;
  id: string;
  loading = true;
  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router,
    private employeeService: EmployeesService, private a: AngularFirestore) { }

  ngOnInit() {

    this.id = this.route.snapshot.paramMap.get('id');
    // if edit get current employee data
    if (this.id) {
      this.employeeService.getEmployeeData(this.id).then(sq => {
        this.loading = false;
        const doc = sq.docs[0];
        const data = doc.data();
        this.buildForm(data);
      });
    } else {
      this.buildForm({});
      this.loading = false;
    }
  }

  buildForm(data) {
    this.employeeForm = this.formBuilder.group({
      firstname: [data.firstname || '', Validators.required],
      lastname: [data.lastname || '', Validators.required],
      middlename: [data.middlename || '', Validators.required],
      birthday: [data.birthday || '', Validators.required],
      gender: [data.gender || '', Validators.required],
      maritalStatus: [data.maritalStatus || '', Validators.required],
      position: [data.position || '', Validators.required],
      dateHired: [data.dateHired || '', Validators.required],
      contactInfo: this.formBuilder.array([
        this.formBuilder.group({
          value: ['', ''],
          isPrimary: ['', '']
        })
      ]),
      addressInfo: this.formBuilder.array([
        this.formBuilder.group({
          street: ['', ''],
          city: ['', ''],
          isPrimary: ['', '']
        })
      ]),
    });

    this.contactInfoArray = this.employeeForm.get('contactInfo') as FormArray;
    this.addressInfoArray = this.employeeForm.get('addressInfo') as FormArray;
  }

  onSave(f: NgForm) {
    this.submitted = true;

    if (f.valid) {
      f.value.birthday = new Date(f.value.birthday); // convert to firebase supported timestamp value
      f.value.dateHired = new Date(f.value.dateHired);
      this.employeeService.saveEmployeeDetails(this.id, f.value).then(() => {
        console.log('saved');
        this.router.navigateByUrl('/employees');
      });
    }
  }

}
