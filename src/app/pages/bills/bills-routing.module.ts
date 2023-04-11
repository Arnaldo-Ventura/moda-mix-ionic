import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BillFormComponent } from './bill-form/bill-form.component';

const routes: Routes = [
  {
    path: '',
    component: BillFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BillsPageRoutingModule {}
