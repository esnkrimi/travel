import { AfterViewInit, Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DrawerService } from '@appBase/drawer.service';
import { Ilocation, typeOflocations } from '@appBase/+state/state';
import { EntryService } from '../entry/entry.service';
import { map } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MapService } from '@appBase/master/map/service';
import { Store } from '@ngrx/store';
import { actions } from '@appBase/+state/actions';
import {
  selectILocationTypes,
  selectLocation,
  selectUsersOfSite,
} from '@appBase/+state/select';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SettingService, ZoomSetting } from '@appBase/setting';

@Component({
  selector: 'pe-zoom',
  templateUrl: './zoom.component.html',
  styleUrls: ['./zoom.component.scss'],
})
export class ZoomComponent implements AfterViewInit {
  locationTypeAutocompleteDataFiltered: any = [];
  locationTypeAutocompleteDataFilteredPre: any = [];
  usersList: any;
  result: any;
  placeType = typeOflocations;

  setting: ZoomSetting = {
    showFormSubmit: true,
    userListShow: false,
    existLocation: false,
    userLogined: 0,
    loadingSmall: false,
  };

  localInformation: Ilocation = {
    id: 0,
    country: '',
    city: '',
    street: '',
    county: '',
    no: '',
    email: '',
    phone: '',
    web: '',
    describe: '',
    type: '',
    lon: '',
    lat: '',
    title: '',
    district: '',
    score: 0,
  };

  form = new FormGroup({
    country: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    district: new FormControl('', Validators.required),
    county: new FormControl('', Validators.required),
    street: new FormControl('', Validators.required),
    email: new FormControl(''),
    phone: new FormControl(''),
    web: new FormControl(''),
    type: new FormControl('', Validators.required),
    describe: new FormControl(''),
    title: new FormControl('', Validators.required),
    score: new FormControl(0),
    lat: new FormControl('0', Validators.required),
    lon: new FormControl('0', Validators.required),
    file: new FormControl<any>('', {}),
  });

  constructor(
    private dialog: MatDialog,
    private drawerService: DrawerService,
    private entryService: EntryService,
    private mapService: MapService,
    private store: Store
  ) {}
  ngAfterViewInit(): void {
    this.listener();
    this.getUserList();
    this.selectLocationTypes();
    this.inputListener();
  }
  getUserList() {
    this.store.select(selectUsersOfSite).subscribe((res) => {
      this.usersList = res;
    });
  }

  rate(rate: number) {
    if (this.setting.userLogined) {
      this.setting.loadingSmall = true;
      this.form.get('score')?.setValue(rate);
      this.store.dispatch(
        actions.startRateAction({
          updateSaved: [this.setting.userLogined, this.result?.id, rate],
        })
      );
    } else {
      this.openDialog();
    }
  }
  fetchFormInputValue(field: string) {
    return this.form.get(field)?.value;
  }
  saved() {
    this.store.dispatch(
      actions.startSaveAction({
        updateSaved: [this.result?.id, this.setting.userLogined],
      })
    );
  }
  inputListener() {
    this.form.get('type')?.valueChanges.subscribe((res) => {
      this.locationTypeAutocompleteDataFiltered =
        this.locationTypeAutocompleteDataFilteredPre.filter((result: any) =>
          result.type.includes(res)
        );
    });
  }
  changeLocatioType(type: string) {
    this.locationTypeAutocompleteDataFiltered = [];
    this.form.get('type')?.setValue(type);
  }
  selectLocationTypes() {
    this.store.select(selectILocationTypes).subscribe((res) => {
      this.locationTypeAutocompleteDataFilteredPre = res;
    });
  }
  lower(str: any) {
    if (str[0] === ' ') str = str.slice(1, str.length);
    return str.replaceAll(' ', '-').replaceAll('%20', '-').toLowerCase();
  }
  openDialog() {
    const dialogRef = this.dialog.open(DialogContent);
    dialogRef.afterClosed().subscribe();
  }
  onSubmit(fileId: string) {
    if (this.setting.userLogined) {
      this.mapService.loadingProgress.next(true);
      const formData = new FormData();
      formData.append('file', this.form.get(fileId)?.value);
      if (this.result?.id) {
        this.store.dispatch(
          actions.startShareExperience({
            uid: this.setting.userLogined,
            id: this.result?.id,
            describtion: this.form.get('describe')?.value,
            formData: formData,
          })
        );
      } else {
        this.store.dispatch(
          actions.startSubmitLocation({
            form: this.form?.value,
            uid: this.setting.userLogined,
          })
        );
      }
      this.doneSubmit();
    } else {
      this.openDialog();
    }
  }

  lowercase(country: any) {
    if (country)
      return country.replaceAll(' ', '-').replaceAll('%20', '-').toLowerCase();
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      file;
      this.form.patchValue({
        file: file,
      });
    }
  }
  numberToArray(i: number) {
    const arr = ['0', '0', '0', '0', '0'];
    return arr.fill('1', 0, i);
  }
  listener() {
    this.entryService.userLoginInformation.subscribe((res: any) => {
      this.setting.userLogined = res.id;
    });
    this.drawerService.localInformation.subscribe((res) => {
      this.localInformation = res;
      this.setting.existLocation = false;
      this.drawerService
        .fetchLocationByLatlng(
          this.localInformation.lat,
          this.localInformation.lon
        )
        .subscribe((res: any) => {
          this.form.reset();
          this.localInformation = {
            id: 0,
            country: res.country,
            city: res.city,
            street: res.street,
            county: res.county,
            no: '',
            score: 0,
            email: '',
            phone: '',
            web: '',
            describe: '',
            type: '',
            lon: this.localInformation.lon,
            lat: this.localInformation.lat,
            title: res.name,
            district: res.district,
          };
          this.form.get('country')?.setValue(res.country);
          this.form.get('city')?.setValue(res.city);
          this.form.get('lat')?.setValue(this.localInformation.lat);
          this.form.get('lon')?.setValue(this.localInformation.lon);
          this.form.get('street')?.setValue(res.street);
          this.form.get('district')?.setValue(res.district);
          this.form.get('county')?.setValue(res.county);
          this.store
            .select(selectLocation)
            .pipe(
              map((res) =>
                res.filter(
                  (res) =>
                    res.lon === this.localInformation.lon.toString() &&
                    res.lat === this.localInformation.lat.toString()
                )
              )
            )
            .subscribe((res: any) => {
              if (res.length) this.setting.existLocation = true;
              this.result = res[0];
              if (this.result) {
                this.form.get('email')?.setValue(this.result.email || '');
                this.form.get('phone')?.setValue(this.result.phone || '');
                this.form.get('web')?.setValue(this.result.web);
                this.form.get('type')?.setValue(this.result.type);
                this.form.get('title')?.setValue(this.result.title || '');
                this.form.get('district')?.setValue(this.result.district);
                this.form.get('country')?.setValue(this.result?.country);
                this.form.get('city')?.setValue(this.result?.city);
                this.form.get('lat')?.setValue(this.localInformation.lat);
                this.form.get('lon')?.setValue(this.localInformation.lon);
                this.form.get('street')?.setValue(this.result?.street);
                this.form.get('district')?.setValue(this.result?.district);
                this.form.get('county')?.setValue(this.result?.county);
              }
              this.setting.loadingSmall = false;
            });
        });
    });
  }

  doneSubmit() {
    const dialogRef = this.dialog.open(DoneSubmitClass, {
      data: { result: this.form.value },
    });
    dialogRef.afterClosed().subscribe((result) => {});
    this.mapService.loadingProgress.next(false);
  }
}

@Component({
  selector: 'image-zoom',
  templateUrl: 'image-zoom.html',
})
export class DoneSubmitClass {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}

@Component({
  selector: 'dialog-content',
  templateUrl: 'dialog-content.html',
  standalone: true,
  imports: [TranslateModule],
})
export class DialogContent {
  constructor(
    private translate: TranslateService,
    private settingService: SettingService
  ) {
    this.settingService.language.subscribe((res) => {
      this.translate.setDefaultLang(res);
      this.translate.use(res);
    });
  }
}
