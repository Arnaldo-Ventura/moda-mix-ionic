import { CardExpenseFormComponent } from './card-expense-form/card-expense-form.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CardsExpensePageRoutingModule } from './cards-expense-routing.module';
import { CardExpenseListComponent } from './card-expense-list/card-expense-list.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    IonicModule,
    CardsExpensePageRoutingModule,
  ],
  declarations: [CardExpenseFormComponent, CardExpenseListComponent],
})
export class CardsExpensePageModule {}
