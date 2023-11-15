import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { LocalService } from '@appBase/storage';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { selectTrip } from '@appBase/+state/select';
import { DrawerService } from '@appBase/drawer.service';
import { Store } from '@ngrx/store';
import { MapApiService } from 'libs/map/src/lib/component/map.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { HelpService } from 'libs/help/src/lib/component/help.service';
import { map } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'pe-trips',
  templateUrl: './trips.component.html',
})
export class TripsComponent implements OnChanges {
  @Input() currentTrip: any;
  index = 0;
  constructor(public dialog: MatDialog) {}
  openDialog() {
    const dialogRef = this.dialog.open(DialogContentExampleDialog);
    dialogRef.afterClosed().subscribe((result) => {});
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.openDialog();
  }
}

@Component({
  selector: 'dialog-content',
  templateUrl: 'dialog-content.html',
  styleUrls: ['./dialog-content.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    RouterModule,
    MatButtonModule,
    NgxPaginationModule,
  ],
})
export class DialogContentExampleDialog implements AfterViewInit, OnInit {
  listOfTrip: any;
  user: any;
  page = 1;

  constructor(
    public dialog: MatDialog,
    private store: Store,
    private localStorage: LocalService,
    private mapApiService: MapApiService,
    private drawerService: DrawerService,
    private helpService: HelpService
  ) {}
  ngOnInit(): void {
    this.drawerService.showMap.next(true);
  }
  ngAfterViewInit(): void {
    this.fetchTrip();
    this.user = this.localStorage.getData('user');
  }
  showCreateNewGuide() {
    this.helpService.messageWrite(
      'select a location on map to start your trip !'
    );
  }
  fetchTrip() {
    this.store
      .select(selectTrip)
      .pipe(map((res) => res.filter((res) => typeof res === 'object')))
      .subscribe((res) => {
        this.listOfTrip = res;
      });
  }
  zoomTrips(trip: any) {
    this.helpService.messageWrite(
      'You can manage trip,change input and insert real value after trip occured.you can compare and check if your program was gone well or no !'
    );
    this.mapApiService.tripLocations.next(trip);
    //this.drawerService.drawerType.next('/trip/' + trip.title);
    //this.drawerService.open.next(true);
  }
}
