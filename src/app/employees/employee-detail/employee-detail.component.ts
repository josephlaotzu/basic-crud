import { Component, OnInit } from '@angular/core';
import { NgForm, FormArray } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeesService } from '../employees.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

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
    private employeeService: EmployeesService, private a: AngularFirestore, private location: Location) { }

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
    data.contactInfo = data.contactInfo ? data.contactInfo : [{value: ''}]
    data.addressInfo = data.addressInfo ? data.addressInfo : [{}]
    this.employeeForm = this.formBuilder.group({
      firstname: [data.firstname || '', Validators.required],
      lastname: [data.lastname || '', Validators.required],
      middlename: [data.middlename || '', Validators.required],
      birthday: [this.formatDateValue(data.birthday) || '', Validators.required],
      gender: [data.gender || '', Validators.required],
      maritalStatus: [data.maritalStatus || '', Validators.required],
      position: [data.position || '', Validators.required],
      dateHired: [this.formatDateValue(data.dateHired) || '', Validators.required],
      contactInfo: this.buildFormArray(data.contactInfo),
      addressInfo: this.buildFormArray(data.addressInfo)
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

  goBack() {
    this.location.back();
  }

  buildFormArray(arr) {
    const formarray = () => {
      let holder = [];
      arr.forEach(item => {
        if (item.hasOwnProperty('value')) {
          holder.push(this.formBuilder.group({
            value: [item.value || '', ''],
            isPrimary: [item.isPrimary || 'true', '']
          }))
        } else {
          holder.push(this.formBuilder.group({
            street: [item.street || '', ''],
            city: [item.city || '', ''],
            isPrimary: [item.isPrimary || 'true', '']
          }))
        }
      });
      return holder;
    };
    return this.formBuilder.array(formarray());
  }

  formatDateValue(date) {
    date = date ? date.toDate() : new Date();
    return (date.getFullYear() + '-' + ("0" + date.getDate()).slice(-2) + "-" + ("0" + (date.getMonth() + 1)).slice(-2));
  }

  addContacts() {
    this.contactInfoArray.push(
      this.formBuilder.group({
        value: ['', '',],
        isPrimary: ['false', '']
      })
    );
  }

  addAddress() {
    this.addressInfoArray.push(
      this.formBuilder.group({
        street: ['', ''],
        city: ['', ''],
        isPrimary: ['false', '']
      })
    );
  }


  removeContact(index) {
    this.contactInfoArray.removeAt(index);
  }

  removeAdress(index) {
    this.addressInfoArray.removeAt(index);
  }
}
