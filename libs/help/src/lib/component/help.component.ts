import { Component, Input, OnInit } from '@angular/core';
import { HelpService } from './help.service';
import { toArray } from 'rxjs';

@Component({
  selector: 'pe-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss'],
})
export class HelpComponent implements OnInit {
  text: any;
  arrayOfText = [];
  arrayToShow = [];
  i = 0;
  constructor(private service: HelpService) {}
  ngOnInit(): void {
    this.service.textInner.subscribe((res: any) => {
      this.text = res;
      this.arrayOfText = res.split(' ');
    });
  }
}
