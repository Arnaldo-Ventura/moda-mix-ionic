import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  ReactiveFormsModule, FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CategoriasPageRoutingModule } from './categories-routing.module';

import { SharedModule } from 'src/app/shared/shared.module';
import { CategoryListComponent } from './category-list/categoria-list.component';
import { CategoryFormComponent } from './category-form/category-form.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    CategoriasPageRoutingModule,
    SharedModule
  ],
  declarations: [ CategoryListComponent, CategoryFormComponent]
})
export class CategoriesPageModule {}
