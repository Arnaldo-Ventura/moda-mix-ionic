import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BrandPageRoutingModule } from './brand-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { BrandFormComponent } from './brand-form/brand-form.component';
import { BrandListComponent } from './brand-list/brand-list.component';


@NgModule({
  imports: [
    CommonModule,
    BrandPageRoutingModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [BrandFormComponent, BrandListComponent]
})
export class BrandPageModule {}
