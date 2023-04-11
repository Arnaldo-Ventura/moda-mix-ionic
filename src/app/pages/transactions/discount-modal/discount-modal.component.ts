import { roundDown } from './../../../shared/utils/rounded-donw';
import {
  Component,
  HostListener,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { BaseFormComponent } from 'src/app/shared/base-form.component';
import { CurrencyService } from 'src/app/shared/currency.service';
import {
  parseCurrencyToNumber,
  parsePercentToNumber,
} from 'src/app/shared/helper/passing-current';
import { NotificationsService } from 'src/app/shared/notifications.service';
import { AlertModalComponent } from '../alert-modal/alert-modal.component';

@Component({
  selector: 'app-discount-modal',
  templateUrl: './discount-modal.component.html',
  styleUrls: ['./discount-modal.component.scss'],
})
export class DiscountModalComponent
  extends BaseFormComponent
  implements OnInit
{
  @Input() items: number[];
  @ViewChild('cash', { static: false }) cash: { setFocus: () => void };
  @ViewChild('item', { static: false }) item: { setFocus: () => void };
  @ViewChild('percent', { static: false }) percent: { setFocus: () => void };
  discountsApplied: { i: number; discount: number }[] | null = null;
  discounts = [
    { name: 'Geral', value: 'g' },
    { name: 'Individual', value: 'i' },
  ];
  types = [
    { name: 'Percentual', value: 'p' },
    { name: 'Valor', value: 'v' },
  ];
  discountIsActive = true;
  itemsIsVisible = false;
  totalDiscount: number;
  individualDiscount;
  productValue;
  constructor(
    public modalController: ModalController,
    private formBuilder: FormBuilder,
    private notificationsService: NotificationsService,
    private currencyService: CurrencyService
  ) {
    super();
  }
  @HostListener('document:keydown', ['$event']) onKeydownHandler(
    event: KeyboardEvent
  ) {
    const { key } = event;
    if (this.discountIsActive) {
      if (key === 'Enter' && !this.itemsIsVisible) {
        this.confirmOperation();
        return;
      }
      if (key.toLocaleLowerCase() === 'i') {
        this.itemFocus();
        return;
      }
      if (key.toLocaleLowerCase() === 'v') {
        this.cashFocus();
        return;
      }
      if (key.toLocaleLowerCase() === 'p') {
        this.percentFocus();
        return;
      }
    }
  }
  ngOnInit() {
    this.initForm();
    setTimeout(() => {
      this.itemFocus();
    }, 300);
  }
  initForm() {
    this.formulario = this.formBuilder.group({
      discount: 'i',
      type: 'v',
      item: 1,
      cash: null,
      percent: null,
    });
  }
  getFormValue() {
    return this.formulario.value;
  }
  cashFocus() {
    setTimeout(() => {
      const { type } = this.getFormValue();
      if (type === 'v') {
        this.cash.setFocus();
      }
    }, 100);
  }
  itemFocus() {
    setTimeout(() => {
      const { discount } = this.getFormValue();
      if (discount === 'i') {
        this.item.setFocus();
      }
    }, 100);
  }
  percentFocus() {
    setTimeout(() => {
      const { type } = this.getFormValue();
      if (type === 'p') {
        this.percent.setFocus();
      }
    }, 100);
  }
  itemsVisible(event) {
    this.itemsIsVisible = event;
  }
  discountChange(discount: any) {
    this.formulario.patchValue({
      discount: discount.value,
      cash: this.currencyService.transformCurrency(0),
      percent: '0,00%',
      item: 1,
    });
    const { type } = this.getFormValue();
    if (discount === 'g') {
      if (type === 'v') {
        this.cashFocus();
      }
      this.percentFocus();
    }
    this.itemFocus();
  }
  typeDiscountChange(type: any) {
    this.formulario.patchValue({
      type: type.value,
      cash: this.currencyService.transformCurrency(0),
      percent: '0,00%',
      item: 1,
    });
    const { discount } = this.getFormValue();
    if (discount === 'g') {
      if (type === 'v') {
        this.cashFocus();
      }
      this.percentFocus();
    }
    this.itemFocus();
  }
  inputItem(event) {
    let item = event.target.value;
    if (item < 1 || item > this.items.length) {
      this.notificationsService.presentToast(
        'Item não localizado',
        'bottom',
        'dark',
        1000
      );
    }
    item = item < 1 ? 1 : item;
    item = item > this.items.length - 1 ? this.items.length : item;
    this.formulario.patchValue({
      item,
      percent: '0,00%',
      cash: this.currencyService.transformCurrency(0),
    });
    this.discountsApplied = null;
  }
  getFormProductValueAndIndex() {
    const formValue = this.getFormValue();
    const productIndex = formValue.item - 1;
    const productValue =
      formValue.discount === 'i'
        ? this.items[productIndex]
        : this.items.reduce((prev, cur) => prev + cur, 0);
    return { formValue, productIndex, productValue };
  }
  inputCash() {
    const { formValue, productValue, productIndex } =
      this.getFormProductValueAndIndex();
    const newCash = this.currencyService.retransformCurrency(formValue.cash);
    let cash = parseCurrencyToNumber(newCash);
    if (cash > productValue) {
      cash = productValue;
      this.formulario.patchValue({
        cash: this.currencyService.transformCurrency(productValue),
      });
      this.presenteToastMaxValue();
    }
    if (formValue.discount === 'i') {
      this.individualDiscount = cash;
      this.productValue = productValue;
      this.discountsApplied = [{ i: productIndex, discount: cash }];
    } else {
      this.totalDiscount = cash;
      const percentDiscount = cash / productValue;
      this.applyDiscountValue(percentDiscount, cash);
    }
  }
  inputPercent() {
    const { formValue, productValue, productIndex } =
      this.getFormProductValueAndIndex();
    const percent = parsePercentToNumber(formValue.percent);

    const discount = roundDown(productValue * percent);
    if (discount < 0.01) {
      this.discountsApplied = null;
      return;
    }
    if (formValue.discount === 'i') {
      this.individualDiscount = discount;
      this.productValue = productValue;
      this.discountsApplied = [{ i: productIndex, discount }];
    } else {
      const discountInAllProducts = roundDown(productValue * percent);
      this.totalDiscount = discountInAllProducts;
      this.applyDiscountValue(percent, discountInAllProducts);
    }
  }
  presenteToastMaxValue() {
    this.notificationsService.presentToast(
      'Valor máximo atingido',
      'bottom',
      'dark',
      1000
    );
  }
  applyDiscountValue(percent: number, cash: number) {
    this.discountsApplied = this.applyDiscountPercent(percent);
    const totalDiscounted = this.discountsApplied.reduce(
      (prev, acc) => +(prev + acc.discount).toFixed(2),
      0
    );
    const restDiscount = +(cash - totalDiscounted).toFixed(2);
    if (restDiscount > 0) {
      this.applyRestDiscount(restDiscount);
    }
  }
  applyDiscountPercent(percent: number) {
    return this.items.map((x, i) => ({
      i,
      discount: roundDown(x * percent),
    }));
  }
  applyRestDiscount(restDiscount: number) {
    const discountsAppliedFromLargest = this.discountsApplied.sort((a, b) => {
      if (a.discount < b.discount) {
        return 1;
      }
      if (a.discount > b.discount) {
        return -1;
      }
      return 0;
    });
    this.discountsApplied = discountsAppliedFromLargest.map((x) => {
      if (restDiscount) {
        restDiscount = +(restDiscount - 0.01).toFixed(2);
        return { i: x.i, discount: +(x.discount + 0.01).toFixed(2) };
      }
      return x;
    });
  }
  async confirmOperation() {
    this.discountIsActive = false;
    if (this.formulario.valid) {
      const modal = await this.modalController.create({
        component: AlertModalComponent,
        cssClass: 'modal-alert',
        componentProps: {
          title: 'Confima o desconto?',
        },
      });
      modal.onDidDismiss().then(({ data }) => {
        if (data) {
          this.submit();
        } else {
          this.discountIsActive = true;
        }
      });
      return await modal.present();
    } else {
      this.discountIsActive = true;
      this.notificationsService.presentToast(
        'Adicione todas as informações',
        'middle'
      );
    }
  }
  submit() {
    setTimeout(() => {
      this.modalController.dismiss(this.discountsApplied);
    }, 100);
  }
}
