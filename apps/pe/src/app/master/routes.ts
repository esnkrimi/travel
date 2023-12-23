import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [
  {
    path: 'lazy',
    loadChildren: () => import('../lazy/lazy.module').then((m) => m.LazyModule),
    outlet: 'secondRouter',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class masterRouterModule {}
