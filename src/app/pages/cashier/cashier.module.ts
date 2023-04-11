import { CloseCashierComponent } from './close-cashier/close-cashier.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CashierPageRoutingModule } from './cashier-routing.module';

import { CashierPage } from './cashier.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { OpenCashierComponent } from './open-cashier/open-cashier.component';
//import { Ionic4DatepickerModule } from '@logisticinfotech/ionic4-datepicker';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    CashierPageRoutingModule,
    SharedModule,
    //  Ionic4DatepickerModule
  ],
  declarations: [CashierPage, OpenCashierComponent, CloseCashierComponent],
})
export class CashierPageModule {}
