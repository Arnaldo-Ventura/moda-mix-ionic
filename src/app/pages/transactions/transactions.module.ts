import { ConfirmTransactionComponent } from './confirm-transaction/confirm-transaction.component';
import { AddMethodPayModalComponent } from './add-method-pay-modal/add-method-pay-modal.component';
import { DiscountModalComponent } from './discount-modal/discount-modal.component';
import { FinalizeModalComponent } from './finalize-modal/finalize-modal.component';
import { SharedModule } from './../../shared/shared.module';
import { PdvComponent } from './pdv/pdv.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TransactionsPageRoutingModule } from './transactions-routing.module';
import { AlertModalComponent } from './alert-modal/alert-modal.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    TransactionsPageRoutingModule,
    SharedModule,
  ],
  declarations: [
    PdvComponent,
    FinalizeModalComponent,
    AlertModalComponent,
    DiscountModalComponent,
    AddMethodPayModalComponent,
    ConfirmTransactionComponent,
  ],
})
export class TransactionsPageModule {}
