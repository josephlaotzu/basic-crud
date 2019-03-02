export interface Employees {
  firstname: string;
  lastname: string;
  middlename: string;
  gender: string;
  maritalStatus: string;
  position: string;
  dateHired: Date;
  birthday: Date;
  contactInfo: [{
    value: string,
    isPrimary: boolean
  }];
  addressInfo: [{
    street: string;
    city: string;
    isPrimary: boolean;
  }];
}
