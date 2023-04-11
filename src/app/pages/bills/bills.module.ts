import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BillsPageRoutingModule } from './bills-routing.module';

import { BillFormComponent } from './bill-form/bill-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { BrMaskerModule } from 'br-mask';
import { SelectExpenseInfoComponent } from './select-expense-info/select-expense-info.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    IonicModule,
    BillsPageRoutingModule,
    BrMaskerModule,
  ],
  entryComponents: [BillFormComponent],
  declarations: [BillFormComponent, SelectExpenseInfoComponent],
})
export class BillsPageModule {}
