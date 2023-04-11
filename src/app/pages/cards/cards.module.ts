import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { SharedModule } from './../../shared/shared.module';
import { CardsPageRoutingModule } from './cards-routing.module';
import { CardFormComponent } from './card-form/card-form.component';
import { CardListComponent } from './card-list/card-list.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    CardsPageRoutingModule,
    SharedModule,
  ],
  declarations: [CardFormComponent, CardListComponent],
})
export class CardsPageModule {}
