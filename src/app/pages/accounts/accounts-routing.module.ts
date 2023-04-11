import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PermissionsGuard } from 'src/app/guards/permissions.guard';
import { EPermission } from 'src/app/shared/enums/permission';
import { EPermissionType } from 'src/app/shared/enums/permission-type';
import { DataRoute } from 'src/app/shared/models/data-route';
import { AccountFormComponent } from './account-form/account-form.component';
import { AccountListComponent } from './account-list/account-list.component';

const routes: Routes = [
  {
    path: '',
    component: AccountListComponent,
    canActivate: [PermissionsGuard],
    data: new DataRoute(EPermission.ACCOUNT, EPermissionType.READ),
  },
  {
    path: 'adicionar',
    component: AccountFormComponent,
    canActivate: [PermissionsGuard],
    data: new DataRoute(EPermission.ACCOUNT, EPermissionType.CREATE),
  },
  {
    path: 'editar/:id',
    component: AccountFormComponent,
    canActivate: [PermissionsGuard],
    data: new DataRoute(EPermission.ACCOUNT, EPermissionType.UPDATE),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountsPageRoutingModule {}
