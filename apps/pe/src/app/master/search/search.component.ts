import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SettingService } from '@appBase/setting';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'pe-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  @Output() resultOutput = new EventEmitter<any>();
  setting = {
    placeholder: 'location',
  };
  constructor(
    private translate: TranslateService,
    private settingService: SettingService
  ) {}
  ngOnInit(): void {
    this.settingService.language.subscribe(() => {
      this.translate.get('search').subscribe((res) => {
        this.setting.placeholder = res;
      });
    });
    this.translate
      .get('search')
      .subscribe((res) => (this.setting.placeholder = res));
  }
  results(event: any) {
    const result: any = {
      center: [event?.latitude, event?.longitude],
      country: event?.country_name,
    };
    this.resultOutput.emit(result);
  }
}
