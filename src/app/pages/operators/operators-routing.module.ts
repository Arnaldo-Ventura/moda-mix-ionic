import { OperatorFormComponent } from './operator-form/operator-form.component';
import { OperatorListComponent } from './operator-list/operator-list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: OperatorListComponent,
  },
  {
    path: 'adicionar',
    component: OperatorFormComponent,
  },
  {
    path: 'editar/:id',
    component: OperatorFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OperatorsPageRoutingModule {}
