import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Employees } from './employees';
import { v4 as uuid } from 'uuid';
@Injectable({
  providedIn: 'root'
})
export class EmployeesService {

  employeesCollection: AngularFirestoreCollection<Employees>;
  constructor(private db: AngularFirestore) {
    this.employeesCollection = this.db.collection<Employees>('employees');
  }

  getAllEmployees() {
    return this.employeesCollection.valueChanges();
  }

  async saveEmployeeDetails(id, data) {
    if (!id) {
      data.id = uuid();
      this.employeesCollection.add(data);
    } else {
      this.employeesCollection.ref.where('id', '==', id).get().then(ret => {
        const doc = ret.docs[0];
        this.employeesCollection.doc(doc.id).update(data);
      });
    }
  }

  getEmployeeData(id) {
    return this.employeesCollection.ref.where('id', '==', id).get();
  }

  async deleteEmployee(id) {
    this.employeesCollection.ref.where('id', '==', id).get().then(ret => {
      const doc = ret.docs[0];
      this.employeesCollection.doc(doc.id).delete();
    });
  }

}
