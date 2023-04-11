import { OperatorFormComponent } from './operator-form/operator-form.component';
import { InstallmentsModalComponent } from './installments-modal/installments-modal.component';
import { SharedModule } from './../../shared/shared.module';
import { OperatorListComponent } from './operator-list/operator-list.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OperatorsPageRoutingModule } from './operators-routing.module';
import { OperationModalComponent } from './operation-modal/operation-modal.component';
import { BrMaskerModule } from 'br-mask';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    OperatorsPageRoutingModule,
    SharedModule,
    BrMaskerModule,
  ],
  declarations: [
    OperatorListComponent,
    OperatorFormComponent,
    OperationModalComponent,
    InstallmentsModalComponent,
  ],
})
export class OperatorsPageModule {}
