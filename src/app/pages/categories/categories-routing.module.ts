import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoryListComponent } from './category-list/categoria-list.component';
import { CategoryFormComponent } from './category-form/category-form.component';
import { PermissionsGuard } from 'src/app/guards/permissions.guard';
import { DataRoute } from 'src/app/shared/models/data-route';
import { Rote, Operation } from 'src/app/shared/enums/permissions.enum';
import { EPermission } from 'src/app/shared/enums/permission';
import { EPermissionType } from 'src/app/shared/enums/permission-type';

const routes: Routes = [
  {
    path: '',
    component: CategoryListComponent,
    canActivate: [PermissionsGuard],
    data: new DataRoute(EPermission.CATEGORY, EPermissionType.READ),
  },
  {
    path: 'adicionar',
    component: CategoryFormComponent,
    canActivate: [PermissionsGuard],
    data: new DataRoute(EPermission.CATEGORY, EPermissionType.CREATE),
  },
  {
    path: 'editar/:id',
    component: CategoryFormComponent,
    canActivate: [PermissionsGuard],
    data: new DataRoute(EPermission.CATEGORY, EPermissionType.UPDATE),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoriasPageRoutingModule {}
