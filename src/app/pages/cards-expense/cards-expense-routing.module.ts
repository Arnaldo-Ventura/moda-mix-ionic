import { CardExpenseFormComponent } from './card-expense-form/card-expense-form.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CardExpenseListComponent } from './card-expense-list/card-expense-list.component';

const routes: Routes = [
  {
    path: '',
    component: CardExpenseListComponent,
  },
  {
    path: 'adicionar',
    component: CardExpenseFormComponent,
  },
  {
    path: 'editar/:id',
    component: CardExpenseFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CardsExpensePageRoutingModule {}
