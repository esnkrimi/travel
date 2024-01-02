<ng-container
  *ngIf="
    loadinProgressDoSharingLocation || !localInformation?.country;
    else showLocationInformation
  "
>
  <div class="w-100 loading-div position-relative p-1">
    <div class="position-absolute d-inline loading">
      <pe-loading-progress [mode]="'animated'"></pe-loading-progress>
    </div>
  </div>
</ng-container>

<ng-template #showLocationInformation>
  <div class="text-left p-3 w-100">
    <div class="bg-light inner w-100">
      <div class="p-2" *ngIf="!setting.existLocation; else ExistsLocation">
        <form
          class="m-4"
          [formGroup]="form"
          (submit)="onSubmit('file_1')"
          enctype="multipart/form-data"
        >
          <div class="row flex-nowrap">
            <div>
              <div class="row flex-nowrap mb-4">
                <div class="col-md-6">
                  <img
                    class="rounded-circle img-country m-2 animated-scale"
                    [src]="
                      'https://cdn.countryflags.com/thumbs/' +
                      lowercase(localInformation.country) +
                      '/flag-square-250.png'
                    "
                  />
                  <span>
                    {{ localInformation.country | uppercase }} -
                    {{ localInformation.city }}
                  </span>
                </div>
                <div class="cil-md-6 text-left"></div>
              </div>
              <div>
                <mat-form-field>
                  <mat-label>
                    {{ 'County' | translate }}
                  </mat-label>
                  <input
                    matInput
                    [readonly]="setting.existLocation"
                    formControlName="county"
                  />
                </mat-form-field>
              </div>

              <div>
                <mat-form-field>
                  <mat-label> {{ 'district' | translate }} </mat-label>
                  <input
                    matInput
                    [readonly]="setting.existLocation"
                    formControlName="district"
                  />
                </mat-form-field>
              </div>
              <div>
                <mat-form-field>
                  <mat-label> {{ 'street' | translate }}</mat-label>
                  <input
                    matInput
                    [readonly]="setting.existLocation"
                    formControlName="street"
                  />
                </mat-form-field>
              </div>

              <div>
                <mat-form-field>
                  <mat-label> {{ 'placename' | translate }} </mat-label>
                  <input
                    matInput
                    [readonly]="setting.existLocation"
                    formControlName="title"
                    placeholder="Ex . google company"
                  />
                </mat-form-field>
              </div>
              <div>
                <mat-form-field>
                  <mat-label> {{ 'placetype' | translate }}</mat-label>
                  <input
                    matInput
                    [readonly]="setting.existLocation"
                    formControlName="type"
                    placeholder="Ex . google company"
                  />
                </mat-form-field>

                <div
                  *ngIf="
                    locationTypeAutocompleteDataFiltered !== null &&
                    locationTypeAutocompleteDataFiltered.length < 10
                  "
                  class="lists form"
                >
                  <div
                    class="cursor-pointer w-100 bg-light p-1"
                    *ngFor="
                      let item of locationTypeAutocompleteDataFiltered;
                      let i = index
                    "
                  >
                    <div class="bg-light span-animated-on-hover cursor-pointer">
                      <div class="row d-flex flex-nowrap">
                        <div
                          style="flex-basis: 45%"
                          class="text-left"
                          (click)="changeLocatioType(item.type)"
                          *ngIf="item.type !== 'null'"
                        >
                          {{ item.type }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <mat-form-field>
                  <mat-label> {{ 'email' | translate }}</mat-label>
                  <input
                    matInput
                    [readonly]="setting.existLocation"
                    formControlName="email"
                  />
                </mat-form-field>
              </div>

              <div>
                <mat-form-field>
                  <mat-label> {{ 'tell' | translate }}</mat-label>
                  <input
                    matInput
                    [readonly]="setting.existLocation"
                    formControlName="phone"
                  />
                </mat-form-field>
              </div>

              <div>
                <mat-form-field>
                  <mat-label> {{ 'website' | translate }}</mat-label>
                  <input
                    matInput
                    [readonly]="setting.existLocation"
                    formControlName="web"
                  />
                </mat-form-field>
              </div>
            </div>
          </div>

          <div class="w-100">
            <mat-form-field class="w-100">
              <mat-label> {{ 'shareexperience' | translate }} </mat-label>
              <textarea matInput formControlName="describe"></textarea>
            </mat-form-field>
          </div>
          <div class="w-100 text-left">
            <input
              (change)="onFileChange($event)"
              class="input-file-upload"
              type="file"
              id="file"
              #id
              name="file"
              multiple="multiple"
              formControlName="file"
            />
          </div>
          <div class="w-100 text-center">
            <button
            class="btn-master-orange"
            mat-stroked-button
              type="submit"
              [disabled]="!form.valid"
            >
              {{ 'submit' | translate }}
            </button>
          </div>
        </form>
      </div>

      <ng-template #ExistsLocation>
        <div class="p-3">
          <div class="title-bar">
            <div>
              <span class="fw-bold text-title text-large">
                {{ fetchFormInputValue('title') | titlecase }}&nbsp;
              </span>
              <span class="fw-bold text-title text-large">
                {{ fetchFormInputValue('type') | titlecase }}
              </span>
            </div>
            <div>
              <span class="sign" *ngFor="let i of numberToArray(result.score)">
                <i class="fa fa-star bg-light text-gold" *ngIf="i === '1'"></i>
              </span>
            </div>
            <div class="flex-cell">
              <span class="p-1">
                <mat-icon
                  (click)="saved()"
                  class="cursor-pointer"
                  [class.selected]="result.saved"
                >
                  {{ 'favorite' | translate }}
                </mat-icon>
              </span>
              <span class="sign p-1">
                <i
                  class="cursor-pointer fa fa-2x fa-share-alt"
                  (click)="setting.userListShow = true"
                >
                </i>
              </span>
            </div>
            <div *ngIf="setting.userListShow">
              <pe-autocomplete-public
                (resultSelected)="resultSelect($event)"
                [data]="usersList"
              ></pe-autocomplete-public>
            </div>
          </div>
          <div class="bg-white p-4">
            <p *ngIf="fetchFormInputValue('city')">
              <span class="fw-bold text-blueblack">
                {{ fetchFormInputValue('country') }} -
              </span>
              <span class="fw-bold text-blueblack">
                {{ fetchFormInputValue('city') }}
              </span>
            </p>
            <p>
              <span>
                {{ fetchFormInputValue('district') }}
              </span>
              <span>
                {{ fetchFormInputValue('street') }}
              </span>
            </p>

            <p *ngIf="fetchFormInputValue('phone').length > 4">
              <span class="fw-bold">
                {{ fetchFormInputValue('phone') }}
              </span>
            </p>
            <p *ngIf="fetchFormInputValue('email').length > 4">
              {{ fetchFormInputValue('email') }}
            </p>
            <p *ngIf="fetchFormInputValue('web').length > 4">
              <span class="fst-italic">
                {{ fetchFormInputValue('web') }}
              </span>
            </p>
            <p>
              <span class="fst-italic text-muted">
                GEO [{{ fetchFormInputValue('lat') }},
                {{ fetchFormInputValue('lat') }}]
              </span>
            </p>
            <div class="p-3 bg-light bg-white">
              <div class="d-flex bg-white">
                <div *ngFor="let img of imgSrc" (click)="openImage(img)">
                  <img [src]="img" class="cursor-pointer img_icon m-1" />
                </div>
              </div>
            </div>
          </div>
          <div class="modals w-100" *ngIf="setting.showFormSubmit">
            <div>
              <div
                class="mt-4 w-100 bg-light bg-primary"
                *ngIf="setting.existLocation"
              >
                <div class="title-bar">
                  People interrested in
                  {{ fetchFormInputValue('title') | titlecase }}
                  {{ fetchFormInputValue('type') | titlecase }}
                </div>
                <pe-experiences
                  *ngIf="result?.id > 0"
                  [locationId]="result.id"
                ></pe-experiences>
              </div>
            </div>

            <form
              [formGroup]="form"
              class="w-100 m-2 p-4"
              (submit)="onSubmit('file')"
              enctype="multipart/form-data"
            >
              <div class="w-100 text-left">
                <div class="w-100">
                  <mat-form-field class="w-100">
                    <mat-label>
                      {{ 'shareexperience' | translate }}
                    </mat-label>
                    <textarea formControlName="describe"></textarea>
                  </mat-form-field>
                </div>
                <div *ngIf="setting.existLocation" class="w-100 text-left p-2">
                  <span
                    class="fa fa-star cursor-pointer fa-2x checked"
                    [class.selected-rate]="result.score >= 1"
                    (click)="rate(1)"
                  ></span>
                  <span
                    class="fa fa-star cursor-pointer fa-2x checked"
                    [class.selected-rate]="result.score >= 2"
                    (click)="rate(2)"
                  ></span>
                  <span
                    class="fa fa-star cursor-pointer fa-2x checked"
                    [class.selected-rate]="result.score >= 3"
                    (click)="rate(3)"
                  ></span>
                  <span
                    class="fa fa-star cursor-pointer fa-2x"
                    [class.selected-rate]="result.score >= 4"
                    (click)="rate(4)"
                  ></span>
                  <span
                    class="fa fa-star cursor-pointer fa-2x"
                    [class.selected-rate]="result.score === 5"
                    (click)="rate(5)"
                  ></span>
                  <span *ngIf="setting.loadingSmall">
                    <img
                      src="../../../assets/img/loading.png"
                      class="icon-small"
                    />
                  </span>
                </div>
                <div class="w-100 text-left" *ngIf="result?.id > 0">
                  <input
                    (change)="onFileChange($event)"
                    class="input-file-upload"
                    type="file"
                    id="file"
                    #id
                    name="file"
                    multiple="multiple"
                    formControlName="file"
                  />
                </div>
                <div class="w-100 text-left mt-2">
                  <button
                    class="link-darks border p-2 m-2 fw-bold bg-light"
                    type="submit"
                  >
                    {{ 'submit' | translate }}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </ng-template>
    </div>
  </div>
</ng-template>
