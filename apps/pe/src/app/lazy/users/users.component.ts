import {
  Component,
  Inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { selectUsersOfSite } from '@appBase/+state/select';

@Component({
  selector: 'pe-users-list',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnChanges {
  @Input() users: any;
  constructor(private store: Store) {}
  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.users);
  }

  resultSelected(event: any) {
    console.log(event);
  }
}
