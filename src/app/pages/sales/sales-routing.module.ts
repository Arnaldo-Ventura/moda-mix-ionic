import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SalesPage } from './sales.page';

const routes: Routes = [
  {
    path: 'vender',
    component: SalesPage,
    //   data:new DataRoute(EPermission.SALE,EPermissionType.CREATE)
  },
  {
    path: 'retirada-caixa',
    component: SalesPage,
    //   data:new DataRoute(EPermission.BILL,EPermissionType.CREATE)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalesPageRoutingModule {}
