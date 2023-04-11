import { CardExpense } from './../../cards-expense/models/card-expense';
import { CardsExpenseService } from './../../cards-expense/cards-expense.service';
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable no-underscore-dangle */
import {
  PayMethodEnum,
  payMethodList,
} from './../../../shared/enums/pay-method.enum';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { CurrencyService } from 'src/app/shared/currency.service';
import { OperatorsService } from '../../operators/operators.service';
import { BaseFormComponent } from 'src/app/shared/base-form.component';
import { parseCurrencyToNumber } from 'src/app/shared/helper/passing-current';
import { PayInfoList } from '../model/pay-info-list';
import { Operator, OperatorCard } from '../../operators/model/operator';
import { TypeEnum } from 'src/app/shared/enums/type.enum';

@Component({
  selector: 'app-add-method-pay-modal',
  templateUrl: './add-method-pay-modal.component.html',
  styleUrls: ['./add-method-pay-modal.component.scss'],
})
export class AddMethodPayModalComponent
  extends BaseFormComponent
  implements OnInit
{
  amount: number;
  method: PayMethodEnum;
  methodName: string;
  type: TypeEnum;
  methods = payMethodList();
  itemsIsVisible = false;
  operators: Operator[] = [];
  groupOperators = false;
  initialOperator: string;
  cardsIncome: OperatorCard[] = [];
  cardsExpense: CardExpense[] = [];
  groupCards = false;
  showCards = false;
  showinsts = false;

  constructor(
    public modalController: ModalController,
    private formBuilder: FormBuilder,
    private operatorService: OperatorsService,
    private currencyService: CurrencyService,
    private cardsExpenseService: CardsExpenseService
  ) {
    super();
  }
  @ViewChild('inputAmount', { static: false }) inputAmount: {
    setFocus: () => void;
  };
  @ViewChild('cash', { static: false }) cash: {
    setFocus: () => void;
  };
  @ViewChild('inst', { static: false }) inst: { setFocus: () => void };
  @HostListener('document:keydown', ['$event']) onKeydownHandler(
    event: KeyboardEvent
  ) {
    const { key } = event;
    if (key === 'Enter') {
      this.submit();
    }
    if (key.toLocaleLowerCase() === 'd') {
      this.inputCashFocus();
    }
    if (key.toLocaleLowerCase() === 'v') {
      this.inputAmountFocus();
    }
    if (key.toLocaleLowerCase() === 'p') {
      this.inputInstFocus();
    }
  }
  ngOnInit() {
    this.initForm();
  }
  initForm() {
    this.formulario = this.formBuilder.group({
      method: [this.method, Validators.required],
      amount: [null, Validators.required],
      cash: [null],
      change: [null],
      operator: [null],
      card: [null],
      installs: [null],
    });
    this.setAmount();
    this.setMethodFormaValidation();
  }
  setAmount() {
    setTimeout(() => {
      const amount = this.currencyService.transformCurrency(this.amount);
      this.formulario.patchValue({
        amount,
      });
      if (this.method === PayMethodEnum.CASH) {
        this.initCashAndChange(amount);
      }
      this.inputAmountFocus();
    }, 300);
  }
  initCashAndChange(value: string) {
    this.formulario.patchValue({
      cash: value,
      change: value,
    });
  }
  inputAmountFocus() {
    setTimeout(() => {
      this.inputAmount.setFocus();
    }, 100);
  }
  inputCashFocus() {
    setTimeout(() => {
      this.cash.setFocus();
    }, 100);
  }
  inputInstFocus() {
    setTimeout(() => {
      this.inst.setFocus();
    }, 100);
  }
  inputValue(event: any) {
    const value = event.target.value;
    if (value) {
      const amount = parseCurrencyToNumber(value);
      const cash =
        amount > this.amount
          ? this.currencyService.transformCurrency(this.amount)
          : this.currencyService.transformCurrency(amount);
      if (this.method === PayMethodEnum.CASH) {
        this.formulario.patchValue({
          cash,
          change: this.currencyService.transformCurrency(0),
        });
      }
      if (parseCurrencyToNumber(this.formulario.value.amount) > this.amount) {
        this.formulario.patchValue({
          amount: this.currencyService.transformCurrency(this.amount),
        });
      }
    }
  }
  inputCash(event: any) {
    const value = event.target.value;
    if (value) {
      const cash = parseCurrencyToNumber(value);
      const amount = parseCurrencyToNumber(this.formulario.value.amount);
      const change =
        cash > amount
          ? this.currencyService.transformCurrency(cash - amount)
          : this.currencyService.transformCurrency(0);
      this.formulario.patchValue({
        change,
      });
    }
  }
  values() {
    const values = Object.assign({}, this.formulario.value);
    values.amount = parseCurrencyToNumber(values.amount);
    values.cash = values.cash ? parseCurrencyToNumber(values.cash) : null;
    values.change = values.change ? parseCurrencyToNumber(values.change) : null;
    return values;
  }
  setMethodFormaValidation() {
    switch (this.method) {
      case PayMethodEnum.CREDITCARD:
        this.setFormValidationToPayCredit();
        this.loadOperator();
        break;
      case PayMethodEnum.DEBITCARD:
        this.setFormValidationToPayDebit();
        this.loadOperator();
        break;
      case PayMethodEnum.CASH:
        this.setFormValidationToPayCash();
        break;
      default:
        this.setFormValidationToPayPix();
        break;
    }
  }
  setFormValidationToPayCash() {
    this.setControlRequired('amount');
    this.setControlRequired('cash');
    this.setControlRequired('change');
  }
  setFormValidationToPayPix() {
    this.setControlNoRequired('cash');
    this.setControlNoRequired('change');
    this.setControlNoRequired('operator');
    this.setControlNoRequired('card');
    this.setControlNoRequired('installs');
  }
  setFormValidationToPayDebit() {
    this.setControlRequired('card');
    this.setControlNoRequired('cash');
    this.setControlNoRequired('change');
    this.setControlNoRequired('installs');
    if (this.type === TypeEnum.INCOME) {
      this.setControlRequired('operator');
    }
  }
  setFormValidationToPayCredit() {
    this.setControlRequired('card');
    this.setControlRequired('installs');
    this.setControlNoRequired('cash');
    this.setControlNoRequired('change');
    if (this.type === TypeEnum.INCOME) {
      this.setControlRequired('operator');
    }
  }
  setControlRequired(control) {
    this.formulario.get(control).setValidators(Validators.required);
    this.formulario.get(control).updateValueAndValidity();
  }
  setControlNoRequired(control) {
    this.formulario.get(control).clearValidators();
    this.formulario.get(control).updateValueAndValidity();
  }
  itemsVisible(event) {
    this.itemsIsVisible = event;
  }
  loadOperator() {
    if (this.type === TypeEnum.INCOME) {
      this.operatorService.getAll().subscribe((operators) => {
        this.operators = operators;
        if (operators.length === 1) {
          this.loadCardsIncome(operators[0]);
          this.initialOperator = operators[0].name;
        } else {
          this.initialOperator = operators[0].name;
        }
      });
    } else {
      this.loadCardsExpense();
    }
  }
  loadCardsIncome(operator: Operator) {
    this.itemsIsVisible = true;
    this.showCards = true;
    this.groupCards = true;
    this.cardsIncome = operator.cards.map((x) => x.card);
    this.formulario.patchValue({
      operator: { _id: operator._id, name: operator.name },
    });
  }
  loadCardsExpense() {
    this.itemsIsVisible = true;
    this.showCards = true;
    this.groupCards = true;
    this.cardsExpenseService.getAll().subscribe((cards) => {
      this.cardsExpense = cards;
    });
  }
  selectedCard(card: OperatorCard) {
    this.formulario.patchValue({
      card: { _id: card._id, name: card.name },
    });
    if (this.method === 'cc') {
      this.showinsts = true;
      this.formulario.patchValue({
        installs: 1,
      });
      this.inputInstFocus();
    }
  }
  changeInst() {
    let { installs } = this.formulario.value;
    if (installs >= 12) {
      installs = 12;
    }
    if (installs < 1) {
      installs = 1;
    }
    this.formulario.patchValue({
      installs,
    });
  }
  filterInfoPay() {
    switch (this.method) {
      case PayMethodEnum.CREDITCARD:
        return this.infoPayInCredit();
      case PayMethodEnum.DEBITCARD:
        return this.infoPayInDebit();
      case PayMethodEnum.CASH:
        return this.infoPayInCash();
      default:
        return this.infoPayInPix();
    }
  }
  infoPayInCash() {
    const { method, amount, cash, change } = this.values();
    const infoPayinCash: PayInfoList = {
      method,
      amount,
      cash,
      change,
    };
    return infoPayinCash;
  }
  infoPayInPix() {
    const { method, amount } = this.values();
    const infoPayinPix: PayInfoList = {
      method,
      amount,
    };
    return infoPayinPix;
  }
  infoPayInDebit() {
    const { method, operator, card, amount } = this.values();
    const infoPayinDebit: PayInfoList = {
      method,
      amount,
      infoCard: {
        operator,
        card,
      },
    };
    return infoPayinDebit;
  }
  infoPayInCredit() {
    const { method, operator, card, installs, amount } = this.values();
    const infoPayinPix: PayInfoList = {
      method,
      amount,
      infoCard: {
        installs,
        operator,
        card,
      },
    };
    return infoPayinPix;
  }
  submit() {
    if (this.formulario.valid) {
      if (this.filterInfoPay().amount > 0) {
        this.modalController.dismiss(this.filterInfoPay());
      } else {
        this.modalController.dismiss();
      }
    }
  }
}
