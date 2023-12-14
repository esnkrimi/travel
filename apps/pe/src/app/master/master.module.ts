import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from './search/search.component';
import { MapComponent } from './map/map.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { MenuComponent } from './menu/menu.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MapModule } from '@pe/map';
import { AutoCompleteModule } from '@pe/auto-complete';
import { HttpClient } from '@angular/common/http';
import { HttpLoaderFactory } from '@appBase/app.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
//import { masterRouterModule } from './routes';
import { RouterModule, Routes } from '@angular/router';
import { masterRouterModule } from './routes';
import { HelpModule } from '@pe/help';
import { NavbarMenuModule } from '@pe/navbar-menu';

@NgModule({
  declarations: [
    SearchComponent,
    MapComponent,
    FooterComponent,
    HeaderComponent,
    MenuComponent,
  ],
  imports: [
    CommonModule,
    MapModule,
    AutoCompleteModule,
    masterRouterModule,
    HelpModule,
    NavbarMenuModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  exports: [HeaderComponent, FooterComponent, MapComponent],
})
export class MasterModule {}
