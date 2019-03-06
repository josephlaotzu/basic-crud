import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../loader.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {

  loading: Observable<boolean>;
  constructor(private loader: LoaderService) { }

  ngOnInit() {
    this.loading = this.loader.loading;
  }

}
