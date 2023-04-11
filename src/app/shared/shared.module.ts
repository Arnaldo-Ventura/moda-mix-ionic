import { FoundItemsComponent } from './../components/found-items/found-items.component';
import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AdminHeaderComponent } from '../components/admin-header/admin-header.component';
import { MenuComponent } from '../components/menu/menu.component';
import { RouterModule } from '@angular/router';
//import { ImageCropperModule } from 'ngx-image-cropper';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
//import { Ionic4DatepickerModule } from '@logisticinfotech/ionic4-datepicker';
import { InputSearchComponent } from '../components/input-search/input-search.component';
import { SearchBarComponent } from '../components/search-bar/search-bar.component';
import { CurrencyDirective } from '../directives/currency.directive';
import { PercentDirective } from '../directives/percent.directive';
import { InputGroupItemsComponent } from '../pages/transactions/input-group-items/input-group-items.component';
import { ProfileMenuComponent } from '../components/profile-menu/profile-menu.component';

@NgModule({
  declarations: [
    AdminHeaderComponent,
    MenuComponent,
    ProfileMenuComponent,
    InputSearchComponent,
    SearchBarComponent,
    CurrencyDirective,
    PercentDirective,
    InputGroupItemsComponent,
    FoundItemsComponent,
  ],
  exports: [
    AdminHeaderComponent,
    MenuComponent,
    InputSearchComponent,
    SearchBarComponent,
    CurrencyDirective,
    PercentDirective,
    InputGroupItemsComponent,
    FoundItemsComponent,
  ],
  imports: [
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    IonicModule,
  ],
  providers: [CurrencyPipe],
})
export class SharedModule {}
