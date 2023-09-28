import { Component, OnInit, inject } from '@angular/core';
import { MytripsService } from './mytrips.service';

@Component({
  selector: 'pe-mytrips',
  templateUrl: './mytrips.component.html',
  styleUrls: ['./mytrips.component.scss'],
})
export class MytripsComponent implements OnInit {
  trips: any = [];
  constructor(private service: MytripsService) {}
  ngOnInit(): void {
    this.myTrips();
  }
  myTrips() {
    this.service.myTrips(15).subscribe((res: any) => {
      this.trips = res;
    });
  }
}
