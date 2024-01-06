import { Component, Inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { actions } from '@appBase/+state/actions';
import { selectUsersOfSite } from '@appBase/+state/select';
import { LocationGeoService } from '@appBase/drawer.service';
import { map } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MapService } from '@appBase/master/map/service';
import { Iuser } from '@appBase/+state/state';

@Component({
  selector: 'pe-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
})
export class SettingComponent implements OnInit {
  uploading = false;
  formSetting = new FormGroup({
    name: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(2),
    ]),
    lname: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(2),
    ]),
    email: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(5),
    ]),
    pass: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(5),
    ]),
    uid: new FormControl<string>(''),
  });

  formAboutMe = new FormGroup({
    aboutme: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
    ]),
    uid: new FormControl(''),
  });

  userId: number;
  timestamp = 1;
  userInformation: Iuser[] = [];
  form = new FormGroup({
    uid: new FormControl(),
    files: new FormControl(),
  });

  constructor(
    private store: Store,
    private drawerService: LocationGeoService,
    public dialog: MatDialog,
    public mapService: MapService,
    @Inject('userSession') public userSession: any
  ) {}
  listenerCount() {
    this.mapService.loadingProgress.subscribe((res) => (this.uploading = res));
  }
  ngOnInit(): void {
    this.hideMap();
    this.listenerCount();
    this.userId = JSON.parse(this.userSession)?.id;
    this.selectUser();
  }

  timeStamp() {
    return new Date().getTime() + this.timestamp;
  }
  openFile(id: string) {
    document.getElementById(id)?.click();
  }
  onFileChange(event: any) {
    this.mapService.loadingProgress.next(true);
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

  effectiveReloadPage() {
    this.mapService.loadingProgress.next(true);
    setTimeout(() => {
      location.reload();
    }, 1000);
  }
  updateAboutme() {
    this.formAboutMe.get('uid')?.setValue(JSON.parse(this.userSession)?.id);
    this.store.dispatch(
      actions.getStartUpdateSettingAboutMe({
        uid: JSON.parse(this.userSession)?.id,
        about: this.formAboutMe.value.aboutme,
      })
    );
    this.effectiveReloadPage();
  }
  updateInfo() {
    this.formSetting.get('uid')?.setValue(JSON.parse(this.userSession)?.id);
    this.store.dispatch(
      actions.getStartUpdateSetting({ data: this.formSetting.value })
    );
    this.effectiveReloadPage();
  }
  selectUser() {
    const uid = String(JSON.parse(this.userSession)?.id);

    this.store
      .select(selectUsersOfSite)
      .pipe(map((res) => res.filter((res) => res.id === uid)))
      .subscribe((res: any) => {
        this.userInformation = res;
        this.formSetting.get('name')?.setValue(res[0].name);
        this.formSetting.get('lname')?.setValue(res[0].lnama);
        this.formSetting.get('email')?.setValue(res[0].email);
        this.formSetting.get('pass')?.setValue(res[0].pass);
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
