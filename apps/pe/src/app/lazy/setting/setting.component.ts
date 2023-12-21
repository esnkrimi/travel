import { Component, Inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { actions } from '@appBase/+state/actions';
import { selectUsersOfSite } from '@appBase/+state/select';
import { DrawerService } from '@appBase/drawer.service';
import { map } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import { MapService } from '@appBase/master/map/service';

@Component({
  selector: 'pe-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
})
export class SettingComponent implements OnInit {
  formSetting = new FormGroup({
    name: new FormControl(''),
    lname: new FormControl(''),
    email: new FormControl(''),
    pass: new FormControl(''),
    uid: new FormControl(''),
  });

  formAboutMe = new FormGroup({
    aboutme: new FormControl(''),
    uid: new FormControl(''),
  });

  usersList: any;
  userId: any;
  timestamp = 1;
  userInformation: any = [];
  form = new FormGroup({
    uid: new FormControl(),
    files: new FormControl(),
  });
  constructor(
    private store: Store,
    private drawerService: DrawerService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    public mapService: MapService,
    @Inject('userSession') public userSession: any
  ) {}
  ngOnInit(): void {
    this.hideMap();
    this.userId = JSON.parse(this.userSession)?.id;
    this.selectUser();
  }

  timeStamp() {
    return new Date().getTime() + this.timestamp;
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.form.patchValue({
        files: file,
        uid: this.userId,
      });
    }
    const formData = new FormData();
    formData.append('file', this.form.get('files')?.value);
    this.store.dispatch(
      actions.startProfilePictureUploading({
        uid: this.userId,
        formData: formData,
      })
    );

    this.timestamp++;
  }

  hideMap() {
    this.drawerService.showMap.next(false);
  }
  openDialog() {
    const dialogRef = this.dialog.open(SettingDialog, {});
    dialogRef.afterClosed().subscribe();
  }

  updateAboutme() {
    this.formAboutMe.get('uid')?.setValue(JSON.parse(this.userSession)?.id);
    this.store.dispatch(
      actions.getStartUpdateSettingAboutMe({
        uid: JSON.parse(this.userSession)?.id,
        about: this.formAboutMe.value.aboutme,
      })
    );
  }
  updateInfo() {
    this.formSetting.get('uid')?.setValue(JSON.parse(this.userSession)?.id);
    this.store.dispatch(
      actions.getStartUpdateSetting({ data: this.formSetting.value })
    );
  }
  selectUser() {
    const uid = String(JSON.parse(this.userSession)?.id);

    this.store
      .select(selectUsersOfSite)
      .pipe(map((res) => res.filter((res) => res.id === uid)))
      .subscribe((res) => {
        this.userInformation = res;
        this.formAboutMe
          .get('aboutme')
          ?.setValue(this.userInformation[0].about);
      });
  }
}

@Component({
  selector: 'dialogue',
  templateUrl: 'dialogue.html',
  styleUrls: ['./dialogue.scss'],
  standalone: true,
  imports: [],
})
export class SettingDialog implements OnInit {
  tripUsers: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store
  ) {}

  ngOnInit(): void {}
}
