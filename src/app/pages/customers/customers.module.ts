import { CustomerSearchComponent } from './customer-search/customer-search.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CustomersPageRoutingModule } from './customers-routing.module';
import { CustomerFormComponent } from './customer-form/customer-form.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { BrMaskerModule } from 'br-mask';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    CustomersPageRoutingModule,
    SharedModule,
    BrMaskerModule,
  ],
  declarations: [
    CustomerFormComponent,
    CustomerListComponent,
    CustomerSearchComponent,
  ],
  entryComponents: [CustomerFormComponent],
})
export class CustomersPageModule {}
