import { EChannel } from './../../../shared/enums/show';
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable no-underscore-dangle */
import { CustomerSearchComponent } from './../../customers/customer-search/customer-search.component';
import { Product } from 'src/app/pages/products/models/product';
import { Prod } from './../model/transaction';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { debounceTime, filter, map } from 'rxjs/operators';
import { BaseFormComponent } from 'src/app/shared/base-form.component';
import { TypeEnum } from 'src/app/shared/enums/type.enum';
import { NotificationsService } from 'src/app/shared/notifications.service';
import { newParams } from 'src/app/shared/params/new-params';
import { Parametro } from 'src/app/shared/params/parametro';
import { StorageService } from 'src/app/shared/storage.service';
import { ProductsService } from '../../products/products.service';
import { TransactionsService } from '../transactions.service';
import { FinalizeModalComponent } from '../finalize-modal/finalize-modal.component';
import { AlertModalComponent } from '../alert-modal/alert-modal.component';
import { DiscountModalComponent } from '../discount-modal/discount-modal.component';
import { ProductSearchComponent } from '../../products/product-search/product-search.component';
import { CashierService } from '../../cashier/cashier.service';
import { OpenCashierComponent } from '../../cashier/open-cashier/open-cashier.component';

@Component({
  selector: 'app-pdv',
  templateUrl: './pdv.component.html',
  styleUrls: ['./pdv.component.scss'],
})
export class PdvComponent extends BaseFormComponent implements OnInit {
  formProd: FormGroup;
  formBarCode: FormGroup;
  readonlyQty = true;
  products: Prod[] = [];
  totalItems = 0;
  totalTransactions = 0;
  readonlyCodeBar = false;
  unitLogged: string;
  user: string;
  pdvIsActive = true;
  constructor(
    private formBuilder: FormBuilder,
    private productsService: ProductsService,
    private notificationsService: NotificationsService,
    private storageService: StorageService,
    private transactionService: TransactionsService,
    private cashierService: CashierService,
    public modalController: ModalController
  ) {
    super();
  }
  @HostListener('document:keydown', ['$event']) onKeydownHandler(
    event: KeyboardEvent
  ) {
    const { key } = event;
    console.log({ key });
    if (this.pdvIsActive) {
      if (key.toLowerCase() === 'q') {
        this.qtyFocus();
        return;
      }
      if (key === 'F4') {
        this.cancelOperation();
        return;
      }
      if (key === 'F2') {
        this.finalizeTransaction();
        return;
      }
      if (key.toLowerCase() === 'c') {
        this.barCodeFocus();
        return;
      }
      if (key.toLowerCase() === 'd') {
        this.applyDiscount();
        return;
      }
      if (key.toLowerCase() === 'l') {
        this.productSearch();
        return;
      }
      if (key.toLowerCase() === 'i') {
        this.customerSearch();
        return;
      }
    }
  }
  @ViewChild('barCode', { static: false }) barCode: { setFocus: () => void };
  @ViewChild('qty', { static: false }) qty: { setFocus: () => void };
  @ViewChild('coupom', { static: false }) private coupom: any;

  ngOnInit() {
    this.initFormProd();
    this.initForm();
    this.initFormBarCode();
    this.barCodeValues();
  }

  async setUserAndUnit() {
    if (!this.unitLogged) {
      const unitLogged = await this.storageService.getUnitLogged();
      this.unitLogged = unitLogged;
    }
    if (!this.user) {
      const user = await this.storageService.getUser();
      this.user = user.name;
    }
    this.formulario.patchValue({
      unit: this.unitLogged,
      employee: this.user,
    });
    this.verifyCashierIsOpen();
  }
  async verifyCashierIsOpen() {
    const cashierIsOpen = await this.storageService.getOpenCashier();
    if (!cashierIsOpen) {
      this.cashierService
        .getCashierIsOpen(this.unitLogged)
        .subscribe(async (cashier) => {
          if (cashier.length === 0) {
            this.pdvIsActive = false;
            const modal = await this.modalController.create({
              component: AlertModalComponent,
              cssClass: 'modal-alert',
              componentProps: {
                title: 'Caixa fechado, deseja abri-lo?',
              },
            });
            modal.onDidDismiss().then(({ data }) => {
              this.pdvIsActive = true;
              if (data) {
                this.openCashier();
              }
            });
            return await modal.present();
          }
        });
    }
  }
  async openCashier() {
    this.pdvIsActive = false;
    const modal = await this.modalController.create({
      component: OpenCashierComponent,
      cssClass: 'open-close-cashier',
    });
    modal.onDidDismiss().then(({ data }) => {
      this.pdvIsActive = true;
      if (data) {
        console.log(data);
      }
    });
    return await modal.present();
  }
  barCodeValues() {
    this.formBarCode.valueChanges
      .pipe(
        map((value) => (value.barCode ? value.barCode.trim() : '')),
        filter((value) => value.length > 1),
        debounceTime(300)
      )
      .subscribe((data) => {
        this.loadProduct(data);
      });

    setTimeout(() => {
      this.barCodeFocus();
      this.scrollToBottomOnInit();
    }, 1000);
  }
  scrollToBottomOnInit() {
    setTimeout(() => {
      this.coupom.nativeElement.scrollTop =
        this.coupom.nativeElement.scrollHeight;
    }, 300);
  }
  initForm() {
    this.formulario = this.formBuilder.group({
      unit: [null, Validators.required],
      date: [null, Validators.required],
      employee: [null, Validators.required],
      favored: [null],
      type: [TypeEnum.INCOME, Validators.required],
      pays: [null, Validators.required],
      prods: [null, Validators.required],
      cashierOpened: [true, Validators.required],
    });
    this.setUserAndUnit();
  }

  initFormProd() {
    this.formProd = this.formBuilder.group({
      clas: [null],
      account: [null],
      brand: [null],
      category: [null],
      name: [null, Validators.required],
      price: [null, Validators.required],
      qty: [1, Validators.required],
      discount: [null],
    });
  }
  initFormBarCode() {
    this.formBarCode = this.formBuilder.group({
      barCode: [null],
    });
  }
  addProd(product: Product) {
    this.formProd.patchValue({
      clas: product?.incomeInfo[0]?.clas,
      account: product?.incomeInfo[0]?.account,
      category: product.cat,
      brand: product.brand,
      name: product.name,
      price: product.price,
    });
    if (!this.formProd.valid) {
      this.missingInformation();
      return;
    }
    this.products.push(this.formProd.value);
    this.initFormProd();
    this.formBarCode.reset();
    this.scrollToBottomOnInit();
    this.setTotalItemAndTotalTransactions();
  }
  setTotalItemAndTotalTransactions() {
    this.totalItems = this.products.reduce((acc, prev) => acc + prev.qty, 0);
    this.totalTransactions = this.products.reduce(
      (acc, prev) =>
        acc + (this.total(prev.qty, prev.price) - prev.discount || 0),
      0
    );
  }
  total(qty: number, price: number) {
    return qty * price;
  }
  qtyFocus() {
    this.readonlyQty = false;
    this.formProd.patchValue({ qty: null });
    this.qty.setFocus();
  }
  barCodeFocus() {
    setTimeout(() => {
      this.barCode.setFocus();
    }, 100);
  }
  barCodeOnFocus() {
    this.readonlyQty = true;
    if (!this.formProd.value.qty) {
      this.formProd.patchValue({
        qty: 1,
      });
    }
  }
  loadProduct(barCode) {
    this.readonlyCodeBar = true;
    const params: Parametro = {
      filter: `show:$in:${'pos'},active:true`,
      fields: 'name,price,incomeInfo,brand,cat',
      barCode: `${barCode}`,
    };
    this.productsService.getAll(newParams(params)).subscribe(
      (data) => {
        const [product] = data;
        if (!product) {
          this.initFormProd();
          this.formBarCode.reset();
          this.notificationsService.presentToast(
            'Produto não localizado!',
            'middle'
          );
          this.readonlyCodeBar = false;
          return;
        }
        this.readonlyCodeBar = false;
        this.addProd(product);
      },
      (_) => (this.readonlyCodeBar = false)
    );
  }
  async cancelOperation() {
    if (this.products.length > 0) {
      this.pdvIsActive = false;
      this.formBarCode.patchValue({ barCode: '' });
      const modal = await this.modalController.create({
        component: AlertModalComponent,
        cssClass: 'modal-alert',
        componentProps: {
          title: 'Confima a cancelamento da Venda?',
        },
      });
      modal.onDidDismiss().then(({ data }) => {
        if (data) {
          this.cleanOperation();
        }
        this.pdvIsActive = true;
        this.barCodeFocus();
      });
      return await modal.present();
    } else {
      this.notificationsService.presentToast('Nenhum produto adicionado!');
    }
    this.pdvIsActive = true;
  }
  cleanOperation() {
    this.initForm();
    this.initFormProd();
    this.readonlyQty = true;
    this.readonlyCodeBar = false;
    this.totalItems = 0;
    this.totalTransactions = 0;
    this.products = [];
  }
  missingInformation() {
    this.notificationsService.presentToast(
      'Adicione todas as informações',
      'middle'
    );
  }
  async productSearch() {
    this.formBarCode.reset();
    this.pdvIsActive = false;
    this.readonlyCodeBar = true;
    const modal = await this.modalController.create({
      component: ProductSearchComponent,
      componentProps: {
        filter: `show:$in:${EChannel.pos},type:$in:${TypeEnum.EXPENSE},active:true`,
        fields: 'name,price,incomeInfo,brand,cat',
      },
    });
    modal.onDidDismiss().then(({ data }) => {
      this.readonlyCodeBar = false;
      this.pdvIsActive = true;
      this.barCodeFocus();
      if (data) {
        this.addProd(data);
      }
    });

    return await modal.present();
  }
  async customerSearch() {
    this.formBarCode.reset();
    this.pdvIsActive = false;
    this.readonlyCodeBar = true;
    const modal = await this.modalController.create({
      component: CustomerSearchComponent,
    });
    modal.onDidDismiss().then(({ data }) => {
      this.readonlyCodeBar = false;
      this.pdvIsActive = true;
      this.barCodeFocus();
      if (data) {
        console.log(data);
        this.formulario.patchValue({
          favored: data,
        });
        console.log(this.formulario.value);
      }
    });

    return await modal.present();
  }
  async applyDiscount() {
    setTimeout(() => {
      this.formBarCode.patchValue({
        barCode: null,
      });
    }, 100);
    if (this.products.length === 0) {
      this.notificationsService.presentToast('Nenhum produto adicionado!');
      return;
    }
    this.pdvIsActive = false;
    this.readonlyCodeBar = true;
    const modal = await this.modalController.create({
      component: DiscountModalComponent,
      componentProps: {
        items: this.products.map((x) => x.price * x.qty),
      },
    });
    modal.onDidDismiss().then(({ data }) => {
      this.readonlyCodeBar = false;
      this.pdvIsActive = true;
      this.barCodeFocus();
      if (data) {
        data.forEach((x) => {
          this.products[x.i] = { ...this.products[x.i], discount: x.discount };
        });
        this.setTotalItemAndTotalTransactions();
      }
    });
    return await modal.present();
  }
  finalizeTransaction() {
    if (this.products.length === 0) {
      this.notificationsService.presentToast(
        'Nenhum produto adicionado',
        'middle',
        'danger'
      );
      return;
    }
    this.finalizeModal();
  }
  async finalizeModal() {
    this.pdvIsActive = false;
    this.readonlyCodeBar = true;
    const modal = await this.modalController.create({
      component: FinalizeModalComponent,
      cssClass: 'finalizePaymentCss',
      componentProps: {
        total: this.totalTransactions,
        type: TypeEnum.INCOME,
      },
    });
    modal.onDidDismiss().then(({ data }) => {
      this.readonlyCodeBar = false;
      this.pdvIsActive = true;
      this.barCodeFocus();
      if (data) {
        this.formulario.patchValue({
          date: new Date(),
          pays: data,
          prods: this.products,
        });
        this.submit();
      }
    });
    return await modal.present();
  }

  async submit() {
    if (this.formulario.valid) {
      this.notificationsService.showLoading();
      this.transactionService
        .transactionIncomeCashier(this.formulario.value)
        .subscribe(() => {
          this.notificationsService.dismisseLoading();
          this.notificationsService.presentToast(
            'Venda realizada com sucesso!!',
            'top',
            'success'
          );
          this.cleanOperation();
        });
    } else {
      this.notificationsService.presentToast(
        'Falta alguma informação para concretizar a venda!',
        'middle',
        'danger'
      );
    }
  }
}
