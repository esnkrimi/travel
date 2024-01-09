import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from './search/search.component';
import { MapComponent } from './map/map.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { ResponsiveHeaderComponent } from './responsive-header/responsive-header.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MapModule } from '@pe/map';
import { AutoCompleteModule } from '@pe/auto-complete';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { masterRouterModule } from './routes';
import { HelpModule } from '@pe/help';
import { NavbarMenuModule } from '@pe/navbar-menu';
import { LoadingProgressModule } from '@pe/loading-progress';

@NgModule({
  declarations: [
    SearchComponent,
    MapComponent,
    FooterComponent,
    HeaderComponent,
    ResponsiveHeaderComponent,
  ],
  imports: [
    CommonModule,
    MapModule,
    AutoCompleteModule,
    masterRouterModule,
    LoadingProgressModule,
    HelpModule,
    NavbarMenuModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    TranslateModule,
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    MapComponent,
    ResponsiveHeaderComponent,
  ],
})
export class MasterModule {}
