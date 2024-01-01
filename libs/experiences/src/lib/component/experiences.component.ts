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
  imageGalleryData: any = [];
  imageGalleryDataIndex = 0;
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
  action() {
    this.imageGalleryData = [];
  }
  remove(userId: string, locationId: string, id: string) {
    this.store.dispatch(
      actions.getStartDeleteLocationComments({
        locationId: locationId,
        userId: userId,
        id: id,
      })
    );
    this.selectSource();
  }
  likeComment(commentId: string) {}

  disLikeComment(commentId: string) {}
  selectSource() {
    setTimeout(() => {
      this.store.select(selectLocationComments).subscribe((res: any) => {
        this.result = res;
        this.userIdCommenter.userId = res[0]?.userid;
        this.store
          .select(selectUsersOfSite)
          .pipe(
            map((res) =>
              res.filter((res) => res.id === this.userIdCommenter.userId)
            )
          )
          .subscribe((res: any) => {
            this.userIdCommenter.userName = res[0]?.name;
            this.userIdCommenter.userFamily = res[0]?.lnama;
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
  openImage(imageSource: any) {
    this.imageGalleryData = imageSource;
  }
}
