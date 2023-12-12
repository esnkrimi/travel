import { AfterViewInit, Component, Inject, Input, OnInit } from '@angular/core';
import { ExperiencesApiService } from './experiences.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { actions } from '@appBase/+state/actions';
import {
  selectLocationComments,
  selectUsersOfSite,
} from '@appBase/+state/select';
import { map, tap } from 'rxjs';

@Component({
  selector: 'pe-experiences',
  templateUrl: './experiences.component.html',
  styleUrls: ['./experiences.component.scss'],
})
export class ExperiencesComponent implements OnInit {
  @Input() locationId: any;
  result: any;
  userLoginId = JSON.parse(this.userSession)?.id;
  img = [];
  userIdCommenter = {
    userId: '',
    userName: '',
    userFamily: '',
  };
  constructor(
    public dialog: MatDialog,
    private store: Store,
    @Inject('userSession') public userSession: any
  ) {}
  ngOnInit(): void {
    this.fetch(this.locationId);
  }
  remove(userId: string, locationId: string) {
    this.store.dispatch(
      actions.getStartDeleteLocationComments({
        locationId: locationId,
        userId: userId,
      })
    );
    this.selectSource();
  }
  selectSource() {
    setTimeout(() => {
      this.store.select(selectLocationComments).subscribe((res) => {
        this.result = res;
        this.userIdCommenter.userId = res[0].userid;

        this.store
          .select(selectUsersOfSite)
          .pipe(
            map((res) =>
              res.filter((res) => res.id === this.userIdCommenter.userId)
            )
          )
          .subscribe((res: any) => {
            this.userIdCommenter.userName = res[0].name;
            this.userIdCommenter.userFamily = res[0].lnama;
            //console.log(res[0]);
          });
      });
    }, 10);
  }
  fetch(locationId: string) {
    this.result = [];
    this.store.dispatch(
      actions.getStartFetchLocationComments({ locationId: locationId })
    );
    this.selectSource();
  }
  openImage(img: string, index: any) {
    const dialogRef = this.dialog.open(OpenImage, {
      data: { image: img, result: this.result[0], index: index + 1 },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }
}

@Component({
  selector: 'image-zoom',
  templateUrl: 'image-zoom.html',
})
export class OpenImage implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
  ngOnInit(): void {}
  next() {
    this.data.index =
      this.data.result.img.length === this.data.index ? 1 : this.data.index + 1;
    this.data.image =
      'https://www.burjcrown.com/drm/travel/users/' +
      this.data.result.locationid +
      '/' +
      this.data.result.userid +
      '/' +
      this.data.index +
      '.jpg';
  }
}
