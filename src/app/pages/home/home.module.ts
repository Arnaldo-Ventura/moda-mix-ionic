import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { ProductsPageModule } from '../products/products.module';
import { CartPageModule } from '../cart/cart.module';


@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    HomePageRoutingModule,
    ProductsPageModule,
    CartPageModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
