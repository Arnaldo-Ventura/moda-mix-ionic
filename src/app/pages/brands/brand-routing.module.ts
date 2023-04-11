import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BrandFormComponent } from './brand-form/brand-form.component';
import { BrandListComponent } from './brand-list/brand-list.component';
import { PermissionsGuard } from 'src/app/guards/permissions.guard';
import { DataRoute } from 'src/app/shared/models/data-route';
import { EPermission } from 'src/app/shared/enums/permission';
import { EPermissionType } from 'src/app/shared/enums/permission-type';

const routes: Routes = [
  {
    path: '',
    component: BrandListComponent,
    canActivate: [PermissionsGuard],
    data: new DataRoute(EPermission.BRAND, EPermissionType.READ),
  },
  {
    path: 'adicionar',
    component: BrandFormComponent,
    canActivate: [PermissionsGuard],
    data: new DataRoute(EPermission.BRAND, EPermissionType.CREATE),
  },
  {
    path: 'editar/:id',
    component: BrandFormComponent,
    canActivate: [PermissionsGuard],
    data: new DataRoute(EPermission.BRAND, EPermissionType.UPDATE),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BrandPageRoutingModule {}
