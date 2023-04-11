import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SupplierFormComponent } from './supplier-form/supplier-form.component';
import { SupplierListComponent } from './supplier-list/supplier-list.component';
import { PermissionsGuard } from 'src/app/guards/permissions.guard';
import { DataRoute } from 'src/app/shared/models/data-route';
import { Rote, Operation } from 'src/app/shared/enums/permissions.enum';
import { EPermission } from 'src/app/shared/enums/permission';
import { EPermissionType } from 'src/app/shared/enums/permission-type';

const routes: Routes = [
  {
    path: '',
    component: SupplierListComponent,
    canActivate: [PermissionsGuard],
    data: new DataRoute(EPermission.SUPPLIER, EPermissionType.READ),
  },
  {
    path: 'adicionar',
    component: SupplierFormComponent,
    canActivate: [PermissionsGuard],
    data: new DataRoute(EPermission.SUPPLIER, EPermissionType.CREATE),
  },
  {
    path: 'editar/:id',
    component: SupplierFormComponent,
    canActivate: [PermissionsGuard],
    data: new DataRoute(EPermission.SUPPLIER, EPermissionType.UPDATE),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SuppliersPageRoutingModule {}
