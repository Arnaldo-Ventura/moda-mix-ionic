import { ConfirmTransaction } from './../model/confirm-transaction';
import { endDay } from './../../../shared/models/format-date';
import { ExpectedPay } from './../model/expected-pay';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IonDatetime, ModalController } from '@ionic/angular';
import { BaseFormComponent } from 'src/app/shared/base-form.component';
import { PayMethodEnum } from 'src/app/shared/enums/pay-method.enum';
import { typeList } from 'src/app/shared/enums/type.enum';
import {
  formatDate,
  formatDateToDateTime,
  formatDateToSave,
  startDay,
} from 'src/app/shared/models/format-date';
import { NotificationsService } from 'src/app/shared/notifications.service';
import { newParams } from 'src/app/shared/params/new-params';
import { Parametro } from 'src/app/shared/params/parametro';
import { UnitsService } from 'src/app/shared/units.service';
import { TransactionsService } from '../transactions.service';

@Component({
  selector: 'app-confirm-transaction',
  templateUrl: './confirm-transaction.component.html',
  styleUrls: ['./confirm-transaction.component.scss'],
})
export class ConfirmTransactionComponent
  extends BaseFormComponent
  implements OnInit
{
  @ViewChild(IonDatetime) from: IonDatetime;
  @ViewChild(IonDatetime) to: IonDatetime;
  toDateValue: any;
  fromDateValue: any;
  confirmTransactionList: ExpectedPay[] = [];
  typeList = typeList();
  methodsIcons = {
    [PayMethodEnum.CREDITCARD]: { name: 'card-outline', color: 'warning' },
    [PayMethodEnum.DEBITCARD]: { name: 'card-outline', color: 'success' },
  };
  unitList: string[] = [];

  constructor(
    private formBuilder: FormBuilder,
    //private storageService: StorageService,
    private unitsService: UnitsService,
    private transactionService: TransactionsService,
    private notificationsService: NotificationsService,
    private modalController: ModalController
  ) {
    super();
  }

  ngOnInit() {
    // this.setCashierPermissions();
    this.initForm();
  }

  /* async setCashierPermissions() {
    const permissions = await this.storageService.getPermissions();
    this.cashierPermissions = permissions.cashier;
  } */

  initForm() {
    this.formulario = this.formBuilder.group({
      type: [null, Validators.required],
      unit: [null, Validators.required],
      from: [formatDate(new Date()), Validators.required],
      to: [formatDate(new Date()), Validators.required],
    });
    this.loadUnits();
  }
  async loadUnits() {
    const params: Parametro = {
      sort: 'name',
    };
    this.unitsService.getAll(newParams(params)).subscribe((units) => {
      if (units.length > 1) {
        this.unitList = units.map((unit) => unit.name);
      } else {
        this.formulario.patchValue({
          unit: units[0].name,
        });
      }
    });
  }

  async loadtransactionToConfirm() {
    if (this.formulario.valid) {
      const { unit, type, from, to } = this.formulario.value;
      const confirm: ConfirmTransaction = {
        unit,
        type,
        from: startDay(from),
        to: endDay(to),
      };

      this.notificationsService.showLoading();
      this.transactionService
        .transactionExpectedPay(confirm)
        .subscribe((confirmTransaction: ExpectedPay[]) => {
          console.log(confirmTransaction);
          this.confirmTransactionList = confirmTransaction;
          this.notificationsService.dismisseLoading();
        });
    }
  }

  calculateTotalCards() {}

  valueDateToDateTime(value) {
    return formatDateToDateTime(value);
  }

  dateFromChange(date) {
    this.formulario.patchValue({
      from: formatDate(date),
    });
    this.fromDateValue = this.valueDateToDateTime(date);
    this.from.confirm(true);
  }

  dateToChange(date) {
    this.formulario.patchValue({
      to: formatDate(date),
    });
    this.toDateValue = this.valueDateToDateTime(date);
    this.to.confirm(true);
  }

  submit() {
    throw new Error('Method not implemented.');
  }
}
