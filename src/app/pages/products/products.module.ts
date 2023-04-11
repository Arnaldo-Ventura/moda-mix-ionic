import { ProductSearchComponent } from './product-search/product-search.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductsPageRoutingModule } from './products-routing.module';

import { ProductFormComponent } from './product-form/product-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProductListComponent } from './product-list/product-list.component';
import { BrMaskerModule } from 'br-mask';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ProductsPageRoutingModule,
    SharedModule,
    BrMaskerModule,
  ],
  declarations: [
    ProductFormComponent,
    ProductListComponent,
    ProductSearchComponent,
  ],
  entryComponents: [ProductFormComponent, ProductSearchComponent],
})
export class ProductsPageModule {}
