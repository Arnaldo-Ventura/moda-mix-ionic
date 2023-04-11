import { ConfirmTransactionComponent } from './confirm-transaction/confirm-transaction.component';
import { PdvComponent } from './pdv/pdv.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'pdv',
    component: PdvComponent,
  },
  {
    path: 'confirmar',
    component: ConfirmTransactionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransactionsPageRoutingModule {}
