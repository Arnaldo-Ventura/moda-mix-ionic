import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll, NavController } from '@ionic/angular';
import { FormGroup, FormControl } from '@angular/forms';
import { Customer } from '../models/customer';
import { CustomersService } from '../customers.service';
import { NotificationsService } from 'src/app/shared/notifications.service';
import { map } from 'rxjs/internal/operators/map';
import { filter } from 'rxjs/internal/operators/filter';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs/internal/operators/distinctUntilChanged';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { Observable } from 'rxjs';
import { Parametro } from 'src/app/shared/params/parametro';
import { UserTypeEnum } from 'src/app/shared/enums/user-type.enum';
import { newParams } from 'src/app/shared/params/new-params';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss'],
})
export class CustomerListComponent implements OnInit {
  @ViewChild(IonInfiniteScroll, { static: true })
  infiniteScroll: IonInfiniteScroll;

  form: FormGroup;
  customerList: Customer[];
  search: string;
  skip = 0;
  limit = 15;
  reloadInfiniteScroll = true;

  constructor(
    private customersService: CustomersService,
    private notifications: NotificationsService,
    private navController: NavController
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      pesq: new FormControl(),
    });

    this.form.valueChanges
      .pipe(
        map((value) => (value.pesq ? value.pesq.trim() : '')),
        filter((value) => value.length > 2),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((value) => this.loadCustomers(value))
      )
      .subscribe((data) => {
        this.customerList = data;
      });

    this.reloadCustomer();
  }

  loadCustomers(value?): Observable<Customer[]> {
    const params: Parametro = {
      sort: 'name',
      limit: value ? null : this.limit.toString(),
      skip: this.skip.toString(),
      filter: value
        ? `name:${value},type:${UserTypeEnum.CUSTOMER}`
        : `type:${UserTypeEnum.CUSTOMER}`,
      fields: 'name',
    };
    return this.customersService.getAll(newParams(params));
  }

  reloadCustomer() {
    this.form.patchValue({ pesq: null });
    this.loadCustomers().subscribe((data) => {
      this.customerList = data;
    });
  }

  onInput(event) {
    if (!event.target.value) {
      this.skip = 0;
      this.reloadInfiniteScroll = true;
      this.reloadCustomer();
    }
  }

  loadScrollData() {
    this.skip += 5;
    if (this.reloadInfiniteScroll) {
      this.loadCustomers().subscribe((data) => {
        if (data.length < this.limit) {
          this.reloadInfiniteScroll = false;
          this.skip = 0;
        }
        this.infiniteScroll.complete();
        this.customerList = this.customerList.concat(data);
      });
    } else {
      this.infiniteScroll.complete();
    }
  }

  async selecionOption(id: string) {
    const option = await this.notifications.presentActionSheet();
    if (option) {
      switch (option) {
        case 'delete':
          this.delete(id);
          break;

        case 'edit':
          this.redirectForm(id);
          break;
      }
    }
  }

  redirectForm(id?: string) {
    const route = id
      ? `/admin/clientes/editar/${id}`
      : '/admin/clientes/adicionar';
    this.navController.navigateRoot([route]);
  }

  async delete(id: string) {
    const confirm = await this.notifications.presentAlert(
      'Tem certeza que quer excluir esse cliente?'
    );
    if (confirm) {
      this.notifications.showLoading();
      this.customersService.delete(id).subscribe(() => {
        this.notifications.dismisseLoading();
        this.notifications.presentToast('Cliente excluído com sucesso');
        this.skip = 0;
        this.reloadCustomer();
      });
    }
  }
}
