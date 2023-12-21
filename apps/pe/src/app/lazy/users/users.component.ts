import { Component, Inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectUsersOfSite } from '@appBase/+state/select';

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
