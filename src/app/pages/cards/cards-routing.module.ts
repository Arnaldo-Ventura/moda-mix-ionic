import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CardFormComponent } from './card-form/card-form.component';
import { CardListComponent } from './card-list/card-list.component';

const routes: Routes = [
  {
    path: '',
    component: CardListComponent,
  },
  {
    path: 'adicionar',
    component: CardFormComponent,
  },
  {
    path: 'editar/:id',
    component: CardFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CardsPageRoutingModule {}
