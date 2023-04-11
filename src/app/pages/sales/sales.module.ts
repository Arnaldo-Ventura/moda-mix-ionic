import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SalesPageRoutingModule } from './sales-routing.module';

import { SharedModule } from 'src/app/shared/shared.module';
import { SalesPage } from './sales.page';
import { ProductsPageModule } from '../products/products.module';
import { CustomersPageModule } from '../customers/customers.module';
import { SuppliersPageModule } from '../suppliers/suppliers.module';

@NgModule({
  imports: [
    CommonModule,
    SalesPageRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SharedModule,
    ProductsPageModule,
    CustomersPageModule,
    SuppliersPageModule
  ],
  declarations: [SalesPage]
})
export class SalesPageModule {}
