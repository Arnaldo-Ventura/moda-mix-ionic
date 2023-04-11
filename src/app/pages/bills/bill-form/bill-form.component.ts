import { DiscountModalComponent } from './../../transactions/discount-modal/discount-modal.component';
/* eslint-disable no-underscore-dangle */
import { SuppliersService } from './../../suppliers/suppliers.service';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { BaseFormComponent } from 'src/app/shared/base-form.component';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Parametro } from 'src/app/shared/params/parametro';
import { TypeEnum } from 'src/app/shared/enums/type.enum';
import { newParams } from 'src/app/shared/params/new-params';
import { BehaviorSubject } from 'rxjs';
import { NavController, ModalController, IonDatetime } from '@ionic/angular';
import { Product } from '../../products/models/product';
import { ProductsService } from '../../products/products.service';
import { StorageService } from 'src/app/shared/storage.service';
import { NotificationsService } from 'src/app/shared/notifications.service';
import { UsersService } from '../../users/users.service';
import {
  formatDate,
  formatDateToDateTime,
  formatDateToSave,
} from 'src/app/shared/models/format-date';
import { CurrencyService } from 'src/app/shared/currency.service';
import { parseCurrencyToNumber } from 'src/app/shared/helper/passing-current';
import { Prod } from '../../transactions/model/transaction';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  tap,
} from 'rxjs/operators';
import { SelectExpenseInfoComponent } from '../select-expense-info/select-expense-info.component';
import { FinalizeModalComponent } from '../../transactions/finalize-modal/finalize-modal.component';

@Component({
  selector: 'app-bill-form',
  templateUrl: './bill-form.component.html',
  styleUrls: ['./bill-form.component.scss'],
})
export class BillFormComponent extends BaseFormComponent implements OnInit {
  @ViewChild(IonDatetime) ionDate: IonDatetime;
  isModal = false;
  billIsActive = true;
  dateToDateTime: any;
  unit: string;
  employee: string;
  favoredList: any[] = [];
  favoredsListVisible;
  favoredSelected = false;
  productList: any[] = [];
  productListVisible;
  productSelected = false;
  typeUserList = ['Cliente', 'Fornecedor', 'Funcionário'];
  typeUser = 'Fornecedor';
  products: BehaviorSubject<Prod[]> = new BehaviorSubject([]);
  totalBill: number;
  totalQtyPrice: string;
  formProd: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private productsService: ProductsService,
    private navController: NavController,
    private storageService: StorageService,
    private notificationsService: NotificationsService,
    private usersService: UsersService,
    private modalController: ModalController,
    private currencyService: CurrencyService,
    private suppliersService: SuppliersService
  ) {
    super();
  }

  ngOnInit() {
    console.log(this.isModal);
    this.initForm();
    this.initFormProduct();

    this.formulario.controls.favored.valueChanges
      .pipe(
        map((value) => (value ? value.trim() : '')),
        tap((data) => {
          if (!data) {
            this.favoredsListVisible = false;
          }
        }),
        filter((value) => value.length > 2 && !this.favoredSelected),
        debounceTime(600),
        distinctUntilChanged()
      )
      .subscribe((data) => this.loadFavoreds(data));

    this.formProd.controls.name.valueChanges
      .pipe(
        map((value) => (value ? value.trim() : '')),
        tap((data) => {
          if (!data) {
            this.productListVisible = false;
          }
        }),
        filter((value) => value.length > 2 && !this.productSelected),
        debounceTime(600),
        distinctUntilChanged()
      )
      .subscribe((data) => this.loadProducts(data));
  }

  initForm() {
    this.formulario = this.formBuilder.group({
      unit: [null, Validators.required],
      date: [formatDate(new Date()), Validators.required],
      employee: [null, Validators.required],
      favored: [null, Validators.required],
      type: [TypeEnum.EXPENSE, Validators.required],
      pays: [null, Validators.required],
      prods: [null, Validators.required],
      cashier: [this.isModal, Validators.required],
      cashierOpened: [this.isModal],
    });
    this.setEmployeeAndUnit();
  }
  async setEmployeeAndUnit() {
    if (!this.unit) {
      this.unit = await this.storageService.getUnitLogged();
    }
    if (!this.employee) {
      const employee = await this.storageService.getUser();
      this.employee = employee.name;
    }
    this.formulario.patchValue({
      unit: this.unit,
      employee: this.employee,
    });
  }

  initFormProduct() {
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

  dateChange(date) {
    this.formulario.patchValue({
      date: formatDate(date),
    });
    this.dateToDateTime = formatDateToDateTime(date);
    this.ionDate.confirm(true);
  }

  clearFormProd() {
    this.productList = [];
    this.productListVisible = false;
    this.formProd.reset();
    this.formProd.patchValue({
      qty: 1,
    });
    this.totalQtyPrice = null;
  }

  async loadFavoreds(favored: string) {
    switch (this.typeUser) {
      case 'Fornecedor':
        this.loadSuppliers(favored);
        break;
      case 'Cliente':
        this.loadCustomers(favored);
        break;

      default:
        this.loadUsers(favored);
        break;
    }
  }

  loadUsers(event: any) {}
  loadSuppliers(supplier: any) {
    const params: Parametro = {
      filter: `active:true`,
      name: supplier,
      sort: 'name',
      fields: 'name',
    };
    this.suppliersService.getAll(newParams(params)).subscribe((suppliers) => {
      this.setFavoreds(suppliers);
    });
  }
  loadCustomers(event: any) {}

  setFavoreds(favoreds: any[]) {
    if (favoreds.length > 0) {
      this.favoredList = favoreds;
      this.favoredsListVisible = true;
    } else {
      this.favoredsListVisible = false;
    }
  }
  clearFavoreds() {
    this.favoredList = [];
    this.favoredsListVisible = false;
    this.formulario.patchValue({ favored: null });
  }

  loadProducts(productName: string) {
    const params: Parametro = {
      filter: `type:$in:${TypeEnum.EXPENSE},active:true`,
      name: productName,
      fields: 'name,price,expenseInfo,brand,cat',
    };
    this.productsService.getAll(newParams(params)).subscribe((products) => {
      if (products.length > 0) {
        this.productListVisible = true;
        this.productList = products;
      } else {
        this.productListVisible = false;
      }
    });
  }

  selectedFavored(favored: any) {
    this.favoredSelected = true;
    this.favoredsListVisible = false;
    this.formulario.patchValue({
      favored: favored.name,
    });
    this.favoredSelected = false;
  }

  selectedProduct(product: any) {
    this.productListVisible = false;
    this.productSelected = true;
    this.analizeInfoExpenseProd(product);
    this.productSelected = false;
  }

  async analizeInfoExpenseProd(product) {
    const expenseInfo = product.expenseInfo;
    if (expenseInfo.length > 1) {
      const modal = await this.modalController.create({
        component: SelectExpenseInfoComponent,
        componentProps: {
          expenseInfo,
        },
      });
      modal.onDidDismiss().then(({ data }) => {
        if (data) {
          product.expenseInfo = [data];
          this.setFormProd(product);
        }
      });
      return await modal.present();
    } else {
      this.setFormProd(product);
    }
  }
  async setFormProd(product: Product) {
    this.productSelected = true;
    this.formProd.patchValue({
      clas: product?.expenseInfo[0]?.clas,
      account: product?.expenseInfo[0]?.account,
      category: product.cat,
      brand: product.brand,
      name: product.name,
      price: this.currencyService.transformCurrency(product.price),
    });
    this.productSelected = false;
    this.totalQtyPrice = this.currencyService.transformCurrency(product.price);
  }

  calcTotalQtyPrice(event) {
    const qty = event.target.value;
    let price = this.formProd.value.price;
    if (qty >= 1 && price) {
      price = parseCurrencyToNumber(price);
      this.totalQtyPrice = this.currencyService.transformCurrency(price * qty);
    } else {
      this.formProd.patchValue({
        qty: 1,
      });
    }
  }

  calcTotalPriceQty(event) {
    const price = parseCurrencyToNumber(event.target.value);
    const qty = this.formProd.value.qty;
    this.totalQtyPrice = this.currencyService.transformCurrency(price * qty);
  }

  addProduct() {
    const values = this.formProd.value;
    values.price = parseCurrencyToNumber(values.price);
    const product: Prod = values;
    this.products.next([...this.products.getValue(), product]);
    this.calcTotalBill();
    this.clearFormProd();
  }

  calcTotalBill() {
    this.totalBill = this.products
      .getValue()
      .map((x) => x.price * x.qty - x.discount)
      .reduce((pre, cur) => pre + cur, 0);
  }

  async excludeProdFromList(index: number) {
    const confirm = await this.notificationsService.presentAlert(
      'Confirma a exclusão'
    );
    if (confirm) {
      this.products.next(
        this.products.getValue().filter((_, i) => i !== index)
      );
    }
  }
  async discount() {
    const modal = await this.modalController.create({
      component: DiscountModalComponent,
      componentProps: {
        items: this.products.value.map((x) => x.qty * x.price),
      },
    });
    modal.onDidDismiss().then(({ data }) => {
      if (data) {
        const prods = this.products.value;
        data.forEach((x) => {
          prods[x.i] = { ...prods[x.i], discount: x.discount };
        });
        this.products.next(prods);
        this.calcTotalBill();
      }
    });
    return await modal.present();
  }

  finalizeTransaction() {
    if (this.products.value.length === 0) {
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
    this.billIsActive = false;
    const modal = await this.modalController.create({
      component: FinalizeModalComponent,
      cssClass: 'finalizePaymentCss',
      componentProps: {
        total: this.totalBill,
        type: TypeEnum.EXPENSE,
      },
    });
    modal.onDidDismiss().then(({ data }) => {
      this.billIsActive = true;
      if (data) {
        const date = this.isModal ? new Date() : this.formulario.value.date;
        this.formulario.patchValue({
          date,
          pays: data,
          prods: this.products,
        });
        this.submit();
      }
    });
    return await modal.present();
  }
  submit() {
    const values = this.formulario.value;
    values.date = formatDateToSave(values.date);
    values.prods = this.products.value;
    console.log(values);
    if (this.isModal) {
      console.log('isModal');
      setTimeout(() => {
        this.modalController.dismiss(values);
      }, 100);
    }
    /*  this.dateInit = this.formulario.value.ionDate
    this.formulario.patchValue({
      products: this.products.getValue(),
     // payment: this.getpayment()
    })
    let order: Order = this.formulario.value
   // order.ionDate = FormatDate.dateFromInput(this.dateInit)
    this.notificationsService.showLoading()
    this.ordersService.orderBill(order).subscribe(() => {
      this.initFormOrder()
      this.notificationsService.dismisseLoading()
      this.notificationsService.presentToast('Conta salva com sucesso')
    }) */
  }

  back() {
    if (this.isModal) {
      this.modalController.dismiss();
    } else {
      this.navController.back();
    }
  }
  async clearAllList() {
    const confirm = await this.notificationsService.presentAlert(
      'Excluir todos os produtos adicionados?'
    );
    if (confirm) {
      this.products.next([]);
    }
  }
}
