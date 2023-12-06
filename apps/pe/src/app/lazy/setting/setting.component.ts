import { Component, Inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { actions } from '@appBase/+state/actions';
import { selectUserRates, selectUsersOfSite } from '@appBase/+state/select';
import { DrawerService } from '@appBase/drawer.service';
import { map, tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';
import { FormControl, FormGroup, FormsModule } from '@angular/forms';

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
  });
  usersList: any;
  userId: any;
  userInformation: any = [];
  constructor(
    private store: Store,
    private drawerService: DrawerService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    @Inject('userSession') public userSession: any
  ) {}
  ngOnInit(): void {
    this.hideMap();
    this.userId = JSON.parse(this.userSession)?.id;
    this.selectUser();
  }
  hideMap() {
    this.drawerService.showMap.next(false);
  }
  openDialog() {
    const dialogRef = this.dialog.open(SettingDialog, {});
    dialogRef.afterClosed().subscribe();
  }
  updateInfo() {
    //console.log(this.formSetting.value);
  }
  selectUser() {
    const uid = String(JSON.parse(this.userSession)?.id);

    this.store
      .select(selectUsersOfSite)
      .pipe(map((res) => res.filter((res) => res.id === uid)))
      .subscribe((res) => {
        //console.log(res);
        this.userInformation = res;
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
