import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomerFormComponent } from './customer-form/customer-form.component';
import { PermissionsGuard } from 'src/app/guards/permissions.guard';
import { DataRoute } from 'src/app/shared/models/data-route';
import { EPermission } from 'src/app/shared/enums/permission';
import { EPermissionType } from 'src/app/shared/enums/permission-type';

const routes: Routes = [
  {
    path: '',
    component: CustomerListComponent,
    canActivate: [PermissionsGuard],
    data: new DataRoute(EPermission.CUSTOMER, EPermissionType.READ),
  },
  {
    path: 'adicionar',
    component: CustomerFormComponent,
    canActivate: [PermissionsGuard],
    data: new DataRoute(EPermission.CUSTOMER, EPermissionType.CREATE),
  },
  {
    path: 'editar/:id',
    component: CustomerFormComponent,
    canActivate: [PermissionsGuard],
    data: new DataRoute(EPermission.CUSTOMER, EPermissionType.UPDATE),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomersPageRoutingModule {}
