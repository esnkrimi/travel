import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { LocationGeoService } from '@appBase/drawer.service';
import { SettingService } from '@appBase/setting';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'pe-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  @Output() resultOutput = new EventEmitter<any>();
  locationSelected: any;
  setting = {
    placeholder: 'location',
  };
  constructor(
    private translate: TranslateService,
    private settingService: SettingService,
    private router: Router,
    private drawerService: LocationGeoService
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
    {
      this.locationSelected = event.id;
      this.drawerService.showMap.next(true);
      this.router.navigateByUrl('');
      const result: any = {
        center: [event?.latitude, event?.longitude],
        city: event?.name,
        country: event?.country_name,
        state: event?.name,
      };
      this.resultOutput.emit(result);
    }
  }
}
