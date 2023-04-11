import { CustomersService } from 'src/app/pages/customers/customers.service';
import { Component, HostListener, ViewChild } from '@angular/core';
import { IonInfiniteScroll, ModalController } from '@ionic/angular';
import { Customer } from '../models/customer';
import { Observable } from 'rxjs';
import { Parametro } from 'src/app/shared/params/parametro';
import { newParams } from 'src/app/shared/params/new-params';
import { AlertModalComponent } from '../../transactions/alert-modal/alert-modal.component';

@Component({
  selector: 'app-customer-search',
  templateUrl: './customer-search.component.html',
  styleUrls: ['./customer-search.component.scss'],
})
export class CustomerSearchComponent {
  @ViewChild(IonInfiniteScroll, { static: true })
  infiniteScroll: IonInfiniteScroll;
  searchCustomerIsActive = true;
  indexItemSelected = 0;
  customerList: Customer[];
  search: string;
  skip = 0;
  limit = 15;
  loadAll = true;

  constructor(
    public modalController: ModalController,
    private customerService: CustomersService
  ) {}
  @HostListener('document:keydown', ['$event']) onKeydownHandler(
    event: KeyboardEvent
  ) {
    const { key } = event;
    if (this.searchCustomerIsActive) {
      if (key === 'ArrowUp') {
        this.decrement();
        return;
      }
      if (key === 'ArrowDown') {
        this.increment();
        return;
      }
      if (key === 'Enter') {
        this.selectCustomer(this.indexItemSelected);
      }
    }
  }
  loadCustomers(value?: string): Observable<Customer[]> {
    const params: Parametro = {
      sort: 'name',
      limit: value ? null : this.limit.toString(),
      skip: this.skip.toString(),
      name: value ? `${value}` : undefined,
      filter: 'active:true',
      fields: 'name',
    };
    return this.customerService.getAll(newParams(params));
  }

  reloadCustomers() {
    this.customerList = [];
  }

  onInput(event) {
    this.loadCustomers(event).subscribe((data) => (this.customerList = data));
  }

  selectCustomer(i: number) {
    this.indexItemSelected = i;
    this.confirmOperation();
  }

  increment() {
    if (this.indexItemSelected < this.customerList.length - 1) {
      this.indexItemSelected++;
    }
  }

  decrement() {
    if (this.indexItemSelected > 0) {
      this.indexItemSelected--;
    }
  }

  loadScrollData() {
    this.skip += 5;
    if (this.loadAll) {
      this.loadCustomers().subscribe((data) => {
        if (data.length < this.limit) {
          this.loadAll = false;
          this.skip = 0;
        }
        this.infiniteScroll.complete();
        this.customerList = this.customerList.concat(data);
      });
    } else {
      this.infiniteScroll.complete();
    }
  }
  async confirmOperation() {
    this.searchCustomerIsActive = false;
    const modal = await this.modalController.create({
      component: AlertModalComponent,
      cssClass: 'modal-alert',
      componentProps: {
        title: 'Adicionar Cliente?',
      },
    });
    modal.onDidDismiss().then(({ data }) => {
      if (data) {
        this.onDismiss();
      } else {
        this.searchCustomerIsActive = true;
      }
    });
    return await modal.present();
  }
  onDismiss() {
    setTimeout(() => {
      const selectedCustomer = this.customerList[this.indexItemSelected].name;
      this.modalController.dismiss(selectedCustomer);
    }, 100);
  }
}
