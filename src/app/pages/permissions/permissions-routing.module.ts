import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PermissionListComponent } from './permission-list/permission-list.component';
import { PermissionFormComponent } from './permission-form/permission-form.component';
import { PermissionsGuard } from 'src/app/guards/permissions.guard';
import { DataRoute } from 'src/app/shared/models/data-route';
import { EPermissionType } from 'src/app/shared/enums/permission-type';
import { EPermission } from 'src/app/shared/enums/permission';

const routes: Routes = [
  {
    path: '',
    component: PermissionListComponent,
    canActivate: [PermissionsGuard],
    data: new DataRoute(EPermission.PERMISSION, EPermissionType.READ),
  },
  {
    path: 'adicionar',
    component: PermissionFormComponent,
    canActivate: [PermissionsGuard],
    data: new DataRoute(EPermission.PERMISSION, EPermissionType.CREATE),
  },
  {
    path: 'editar/:id',
    component: PermissionFormComponent,
    canActivate: [PermissionsGuard],
    data: new DataRoute(EPermission.PERMISSION, EPermissionType.UPDATE),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PermissionsPageRoutingModule {}
