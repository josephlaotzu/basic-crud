import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  loader = new BehaviorSubject<boolean>(false)
  constructor() { }

  get loading() {
    return this.loader.asObservable();
  }

  startLoading() {
    this.loader.next(true);
  }

  stopLoading() {
    this.loader.next(false);
  }
}
