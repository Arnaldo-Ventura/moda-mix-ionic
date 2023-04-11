import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserListComponent } from './user-list/user-list.component';
import { UserFormComponent } from './user-form/user-form.component';
import { PermissionsGuard } from 'src/app/guards/permissions.guard';
import { DataRoute } from 'src/app/shared/models/data-route';
import { EPermission } from 'src/app/shared/enums/permission';
import { EPermissionType } from 'src/app/shared/enums/permission-type';

const routes: Routes = [
  {
    path: '',
    component: UserListComponent,
    canActivate: [PermissionsGuard],
    data: new DataRoute(EPermission.EMPLOYEE, EPermissionType.READ),
  },
  {
    path: 'adicionar',
    component: UserFormComponent,
    canActivate: [PermissionsGuard],
    data: new DataRoute(EPermission.EMPLOYEE, EPermissionType.CREATE),
  },
  {
    path: 'editar/:id',
    component: UserFormComponent,
    canActivate: [PermissionsGuard],
    data: new DataRoute(EPermission.EMPLOYEE, EPermissionType.UPDATE),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersPageRoutingModule {}
