import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { SearchComponent } from './master/search/search.component';
const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./master/master.module').then((m) => m.MasterModule),
  },
  {
    path: 'lazy',
    loadChildren: () => import('./lazy/lazy.module').then((m) => m.LazyModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class rootRouterModule {}
