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
import { selectLocation } from '@appBase/+state/select';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SettingService } from '@appBase/setting';

@Component({
  selector: 'pe-zoom',
  templateUrl: './zoom.component.html',
  styleUrls: ['./zoom.component.scss'],
})
export class ZoomComponent implements AfterViewInit {
  existLocation = false;
  showFormSubmit = true;
  placeType = typeOflocations;
  userLogined: any;
  loginSUggest = false;
  result: any;
  loadingSmall = false;
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
    country: new FormControl('', {}),
    city: new FormControl('', {}),
    district: new FormControl('', {}),
    county: new FormControl('', {}),
    street: new FormControl('', {}),
    email: new FormControl('', Validators.email),
    phone: new FormControl('', {}),
    web: new FormControl('', {}),
    type: new FormControl('', {}),
    describe: new FormControl('', {}),
    title: new FormControl('', {}),
    score: new FormControl(0, {}),
    lat: new FormControl('0', {}),
    lon: new FormControl('0', {}),
    file: new FormControl<any>('', [Validators.required]),
  });

  constructor(
    private drawerService: DrawerService,
    private entryService: EntryService,
    public dialog: MatDialog,
    private mapService: MapService,
    private store: Store
  ) {}

  ngAfterViewInit(): void {
    this.listener();
  }

  rate(rate: number) {
    if (this.userLogined) {
      this.loadingSmall = true;
      this.form.get('score')?.setValue(rate);
      this.store.dispatch(
        actions.startRateAction({
          updateSaved: [this.userLogined, this.result?.id, rate],
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
        updateSaved: [this.result?.id, this.userLogined],
      })
    );
  }
  openDialog() {
    const dialogRef = this.dialog.open(DialogContent);
    dialogRef.afterClosed().subscribe();
  }
  onSubmit(fileId: string) {
    if (this.userLogined) {
      this.mapService.loadingProgress.next(true);
      const formData = new FormData();
      formData.append('file', this.form.get(fileId)?.value);
      if (this.result?.id) {
        this.store.dispatch(
          actions.startShareExperience({
            uid: this.userLogined,
            id: this.result?.id,
            describtion: this.form.get('describe')?.value,
            formData: formData,
          })
        );
      } else {
        this.store.dispatch(
          actions.startSubmitLocation({
            form: this.form?.value,
            uid: this.userLogined,
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
      //console.log(file);
      this.form.patchValue({
        file: file,
      });
    }
  }
  listener() {
    this.entryService.userLoginInformation.subscribe((res: any) => {
      this.userLogined = res.id;
    });
    this.drawerService.localInformation.subscribe((res) => {
      this.localInformation = res;
      this.existLocation = false;
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
              if (res.length) this.existLocation = true;
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
              this.loadingSmall = false;
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
