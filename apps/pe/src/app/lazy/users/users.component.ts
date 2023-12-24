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
export class UsersComponent {
  @Input() users: any;
  constructor(private store: Store) {}

  resultSelected(event: any) {}
}
