/* eslint-disable no-underscore-dangle */
import { Transaction } from './../transactions/model/transaction';
import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseFormComponent } from 'src/app/shared/base-form.component';
import { typeList, TypeEnum } from 'src/app/shared/enums/type.enum';
import {
  payMethodList,
  PayMethodEnum,
} from 'src/app/shared/enums/pay-method.enum';
import { FormBuilder } from '@angular/forms';
import { StorageService } from 'src/app/shared/storage.service';
import { UsersService } from '../users/users.service';
import { UnitsService } from 'src/app/shared/units.service';
import { NotificationsService } from 'src/app/shared/notifications.service';
import { IonDatetime, ModalController } from '@ionic/angular';
import { Parametro } from 'src/app/shared/params/parametro';
import { newParams } from 'src/app/shared/params/new-params';
import {
  getHours,
  formatDate,
  startDay,
  endDay,
  formatDateToDateTime,
} from 'src/app/shared/models/format-date';
import { Cashier } from './models/cashier';
import { CashierService } from './cashier.service';
import { EPermissionTypeCashier } from 'src/app/shared/enums/permission-type';
import { CashierPermissions } from './models/cashier-permissions';
import { BillFormComponent } from '../bills/bill-form/bill-form.component';
import { CloseCashierComponent } from './close-cashier/close-cashier.component';
import { OpenCashierComponent } from './open-cashier/open-cashier.component';
import { OpenCashier } from './models/open-cashier';

@Component({
  selector: 'app-cashier',
  templateUrl: './cashier.page.html',
  styleUrls: ['./cashier.page.scss'],
})
export class CashierPage extends BaseFormComponent implements OnInit {
  @ViewChild(IonDatetime) from: IonDatetime;
  @ViewChild(IonDatetime) to: IonDatetime;
  cashierPermissions: CashierPermissions = Object.values(
    EPermissionTypeCashier
  ).reduce((prev, acc) => ({ ...prev, [acc]: false }), {});
  dateFilter = {
    from: formatDate(new Date()),
    to: formatDate(new Date()),
  };
  toDateValue: any;
  fromDateValue: any;
  totalCards = {
    income: null,
    expense: null,
    balace: null,
  };
  typeList = typeList();
  methodList = payMethodList();
  methodsIcons = {
    [PayMethodEnum.CASH]: { name: 'cash-outline', color: 'primary' },
    [PayMethodEnum.CREDITCARD]: { name: 'card-outline', color: 'warning' },
    [PayMethodEnum.DEBITCARD]: { name: 'card-outline', color: 'success' },
  };
  filters = false;
  cashierInitial: OpenCashier;
  cashier: Cashier[] = [];
  cashierList: Cashier[] = [];
  reloadCashierList = 0;
  employeeList: string[] = [];
  unitList: string[] = [];
  unitLogged: string;
  showInfoCashier = false;

  constructor(
    private formBuilder: FormBuilder,
    private cashierService: CashierService,
    private storageService: StorageService,
    private usersService: UsersService,
    private unitsService: UnitsService,
    private notificationsService: NotificationsService,
    private modalController: ModalController
  ) {
    super();
  }

  ngOnInit() {
    this.setCashierPermissions();
    this.initForm();
  }

  async setCashierPermissions() {
    const permissions = await this.storageService.getPermissions();
    this.cashierPermissions = permissions.cashier;
  }

  initForm() {
    this.formulario = this.formBuilder.group({
      employee: [null],
      type: [null],
      method: [null],
      unit: [null],
    });
    this.setUnitLogged();
  }
  async setUnitLogged() {
    this.unitLogged = await this.storageService.getUnitLogged();
    this.verifyCashierIsOpen();
  }

  async verifyCashierIsOpen() {
    const cashierIsOpen = await this.storageService.getOpenCashier();
    if (!cashierIsOpen) {
      this.cashierService
        .getCashierIsOpen(this.unitLogged)
        .subscribe((cashierInitial) => {
          if (cashierInitial.length > 0) {
            this.cashierInitial = cashierInitial[0];
            this.storageService.setOpenCashier(cashierInitial[0]);
            this.loadCashierOpened();
          }
        });
      return;
    }
    this.cashierInitial = cashierIsOpen;
    this.loadCashierOpened();
  }

  async loadCashierOpened() {
    this.notificationsService.showLoading();
    this.cashierService.getCashierOpened(this.unitLogged).subscribe((data) => {
      console.log(data);
      this.cashierList = data;
      this.cashier = data;
      this.calculateTotalCards();
      this.notificationsService.dismisseLoading();
    });
  }

  async openCashier() {
    const modal = await this.modalController.create({
      component: OpenCashierComponent,
      cssClass: 'open-close-cashier',
    });
    modal.onDidDismiss().then(async ({ data }) => {
      if (data) {
        this.showInfoCashier = false;
        this.cashierInitial = await this.storageService.getOpenCashier();
      }
    });
    return await modal.present();
  }

  calculateTotalCards() {
    let income = 0;
    let expense = 0;
    this.cashierList.forEach((pay) => {
      if (pay.type === TypeEnum.INCOME) {
        income += pay.amount;
      } else {
        expense += pay.amount;
      }
    });
    this.totalCards.income = income;
    this.totalCards.expense = expense;
    this.totalCards.balace = income - expense;
  }

  enableFilters() {
    this.filters = !this.filters;
    if (this.filters) {
      this.loadUnits();
      this.loadUsers();
    }
  }

  loadUnits() {
    if (this.unitList.length === 0) {
      const params: Parametro = {
        sort: 'name',
      };
      this.unitsService.getAll(newParams(params)).subscribe(async (data) => {
        this.unitList = data.map((u) => u.name);
        const unit = await this.storageService.getUnitLogged();
        this.formulario.patchValue({
          unit,
        });
      });
    }
  }

  loadUsers() {
    this.usersService.getAll().subscribe(async (data) => {
      this.employeeList = data.map((user) => user.name);
      const userLogged = await this.storageService.getUser();
      this.formulario.patchValue({
        employee: userLogged.name,
      });
    });
  }

  valueDateToDateTime(value) {
    return formatDateToDateTime(value);
  }

  dateFromChange(date) {
    this.dateFilter.from = formatDate(date);
    this.fromDateValue = this.valueDateToDateTime(date);
    this.from.confirm(true);
    this.getCashierByDate();
  }

  dateToChange(date) {
    this.dateFilter.to = formatDate(date);
    this.toDateValue = this.valueDateToDateTime(date);
    this.to.confirm(true);
    this.getCashierByDate();
  }

  getCashierByDate() {
    const from = startDay(this.dateFilter.from);
    const to = endDay(this.dateFilter.to);
    this.notificationsService.showLoading();
    this.cashierService.getCashierByDate(from, to).subscribe((cashier) => {
      this.cashierList = cashier;
      this.cashier = cashier;
      this.calculateTotalCards();
      this.notificationsService.dismisseLoading();
      this.initForm();
    });
  }

  filterCashier() {
    const { employee, type, unit, method } = this.formulario.value;
    this.cashierList = this.cashier
      .filter((cashier) =>
        employee ? cashier.employee === employee : cashier.employee !== employee
      )
      .filter((t) => (type ? t.type === type : t.type !== type))
      .filter((m) => (method ? m.method === method : m.method !== method))
      .filter((u) => (unit ? u.unit === unit : u.unit !== unit));
  }

  async cashierClose() {
    const modal = await this.modalController.create({
      component: CloseCashierComponent,
      cssClass: 'open-close-cashier',
    });
    modal.onDidDismiss().then(({ data }) => {
      if (data) {
        this.cashierInitial = null;
        this.showInfoCashier = false;
        this.loadCashierOpened();
      }
    });
    return await modal.present();
  }

  async withdrawal() {
    if (!this.cashierInitial) {
      const confirm = await this.notificationsService.presentAlert(
        'Caixa Fechado, deseja abri-lo?'
      );
      if (confirm) {
        this.openCashier();
      }
      return;
    }
    this.showBillFormModal();
  }

  async showBillFormModal() {
    const withdrawal = await this.modalController.create({
      component: BillFormComponent,
      componentProps: {
        isModal: true,
      },
    });

    withdrawal.onDidDismiss().then(({ data }) => {
      if (data) {
        const transaction: Transaction = data;
        console.log({ transaction });
        this.cashierService.cashierCreateExpense(transaction).subscribe(() => {
          this.loadCashierOpened();
        });
      }
    });

    return await withdrawal.present();
  }
  submit() {
    throw new Error('Method not implemented.');
  }
}
