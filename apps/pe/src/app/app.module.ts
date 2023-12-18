import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { NxWelcomeComponent } from './nx-welcome.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { rootRouterModule } from './routes';
import { MasterModule } from './master/master.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LocalService } from './storage';
import { MatRippleModule } from '@angular/material/core';
import { ActionReducer, MetaReducer, StoreModule } from '@ngrx/store';
import { reducerStates } from './+state/reducer';
import { EffectsModule } from '@ngrx/effects';
import { NgxPaginationModule } from 'ngx-pagination';
import { storeEffects } from './+state/effects';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { LoadingProgressModule } from '@pe/loading-progress';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import {
  SocialLoginModule,
  GoogleSigninButtonModule,
  SocialAuthServiceConfig,
  GoogleLoginProvider,
} from '@abacritt/angularx-social-login';
import { HelpModule } from '@pe/help';

export function debug(reducer: ActionReducer<any>): ActionReducer<any> {
  return function (state: any, action: any) {
    //  ('state', state);
    //  ('action', action);
    return reducer(state, action);
  };
}
export const metaReducers: MetaReducer<any>[] = [debug];

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function getUserSession(localService: LocalService) {
  return localService.getData('user');
}

export function detectDevice(localService: LocalService) {
  return window.innerWidth > 1200;
}

@NgModule({
  declarations: [AppComponent, NxWelcomeComponent],
  imports: [
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    HelpModule,
    GoogleSigninButtonModule,
    SocialLoginModule,
    HttpClientModule,
    MatIconModule,
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    DragDropModule,
    MatSidenavModule,
    MatChipsModule,
    MatRippleModule,
    MatFormFieldModule,
    rootRouterModule,
    MatListModule,
    LoadingProgressModule,
    NgxPaginationModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    MasterModule,
    EffectsModule.forRoot([storeEffects]),
    StoreModule.forRoot({ store: reducerStates.reducer }, { metaReducers }),
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '639634141754-upc7snom2kpm0mv9vm1ugtpchlh6tp36.apps.googleusercontent.com'
            ),
          },
        ],
        onError: (err: any) => {
          console.error(err);
        },
      } as SocialAuthServiceConfig,
    },
    {
      provide: LocalService,
      useClass: LocalService,
    },
    {
      provide: 'userSession',
      useFactory: getUserSession,
      deps: [LocalService],
    },
    {
      provide: 'deviceIsWide',
      useFactory: detectDevice,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
