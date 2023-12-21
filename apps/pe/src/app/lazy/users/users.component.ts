import { Component, Inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { actions } from '@appBase/+state/actions';
import {
  selectTripUsers,
  selectUserRates,
  selectUsersOfSite,
} from '@appBase/+state/select';
import { DrawerService } from '@appBase/drawer.service';
import { map } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'pe-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  users: any;
  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.select(selectUsersOfSite).subscribe((res) => {
      this.users = res;
      console.log(res);
    });
  }
  resultSelected(event: any) {}
}
