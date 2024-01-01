import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LocationGeoService } from '@appBase/drawer.service';
import { Ilocation, Iuser, typeOflocations } from '@appBase/+state/state';
import { EntryService } from '../entry/entry.service';
import { map } from 'rxjs';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
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
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'pe-zoom',
  templateUrl: './zoom.component.html',
  styleUrls: ['./zoom.component.scss'],
})
export class ZoomComponent implements AfterViewInit {
  destinationSharedUsers: Iuser[];
  locationID: string;
  loadinProgressDoSharingLocation = false;
  openZoom = true;
  file: any = [];
  imgSrc: any = [];
  imgSrcToGallery: any = [];
  locationTypeAutocompleteDataFiltered: any = [];
  locationTypeAutocompleteDataFilteredPre: any = [];
  usersList: Iuser[];
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
  @ViewChild('file1') file1: ElementRef;
  @ViewChild('file2') file2: ElementRef;
  constructor(
    private dialog: MatDialog,
    private drawerService: LocationGeoService,
    private entryService: EntryService,
    private mapService: MapService,
    private store: Store
  ) {}
  ngAfterViewInit(): void {
    this.mapService.loadingProgress.subscribe((res) => {
      this.loadinProgressDoSharingLocation = res;
    });
    this.listener();
    this.getUserList();
    this.selectLocationTypes();
    this.inputListener();
  }
  getUserList() {
    this.store.select(selectUsersOfSite).subscribe((res: any) => {
      this.usersList = res;
    });
  }
  action() {
    console.log('closing');
  }
  selectFileInput(inputFileId: any) {
    if (inputFileId === 'file1') this.file1.nativeElement.click();
    else this.file2.nativeElement.click();
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
    this.form.get('type')?.valueChanges.subscribe((res: any) => {
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
      for (let i = 0; i <= this.file.length; i++) {
        formData.append('file[]', this.file[i]);
      }
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
            formData: formData,
          })
        );
      }
      this.doneSubmit();
    } else {
      this.openDialog();
    }
  }

  onFileChange(event: any) {
    this.file = [];
    for (let i = 0; i <= event.target.files.length; i++) {
      this.file.push(event.target.files[i]);
    }
    this.form.patchValue({
      file: this.file,
    });
  }

  lowercase(country: any) {
    if (country)
      return country.replaceAll(' ', '-').replaceAll('%20', '-').toLowerCase();
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
              this.imgSrc = res[0]?.img;
              this.locationID = res[0]?.id;
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
  resultSelect(event: any) {
    this.share(event, this.locationID);
    this.destinationSharedUsers.push(event);
  }
  share(userId: string, locationId: string) {
    this.store.dispatch(
      actions.startShareLocation({ userId: userId, locationId: locationId })
    );
  }
  doneSubmit() {
    this.listener();
  }

  openImage(img: string) {
    this.imgSrcToGallery = this.imgSrc;
    console.log(this.imgSrcToGallery);
  }
}

@Component({
  selector: 'image-zoom',
  templateUrl: 'image-zoom.html',
  imports: [MatButtonModule, MatDialogModule],
  standalone: true,
})
export class DoneSubmitClass implements OnInit {
  constructor(
    private mapService: MapService,
    public dialogRef: MatDialogRef<DoneSubmitClass>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  ngOnInit(): void {}
  onNoClick(): void {
    this.mapService.loadingProgress.next(false);
    this.dialogRef.close();
  }
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
