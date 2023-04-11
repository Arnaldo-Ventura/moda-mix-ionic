import { Component, OnInit } from '@angular/core';
import { BaseFormComponent } from 'src/app/shared/base-form.component';
import { FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { NotificationsService } from 'src/app/shared/notifications.service';
import { ModalController } from '@ionic/angular';
import { TypeEnum } from 'src/app/shared/enums/type.enum';
import { ActivatedRoute } from '@angular/router';
import { Rote } from 'src/app/shared/enums/permissions.enum';
import { Product } from '../products/models/product';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.page.html',
  styleUrls: ['./sales.page.scss'],
})
export class SalesPage extends BaseFormComponent implements OnInit {
  routes = {
    [Rote.SALE]: TypeEnum.INCOME,
    [Rote.BILL]: TypeEnum.EXPENSE,
  };
  title: string = null;
  type: TypeEnum = null;
  products: BehaviorSubject<any[]> = new BehaviorSubject([]);
  totalProd: number;
  stokProductSelected: number = null;

  constructor(
    private formBuilder: FormBuilder,
    private notificationService: NotificationsService,
    public modalController: ModalController,
    private activedroute: ActivatedRoute
  ) {
    super();
  }

  ngOnInit() {
    this.type = this.routes[this.activedroute.snapshot.data.rote];
    this.title = this.type === TypeEnum.INCOME ? 'Venda' : 'Despesa';
    this.initForm();
  }

  initForm() {
    this.formulario = this.formBuilder.group({
      clas: [null, Validators.required],
      subClas: [null, Validators.required],
      prod: this.formBuilder.group({
        _id: [null, Validators.required],
        name: [null, Validators.required],
        qty: [null, Validators.required],
        price: [null, Validators.required],
      }),
    });
  }

  async submit() {
    this.presentModalCustomer();
  }

  prepareToPay(customer) {
    const products: any[] = this.products.getValue();
    this.pay(products, customer, this.type);
  }

  async presentModalProducts() {
    /* const modal = await this.modalController.create({
      component: SelectProductComponent,
      componentProps: {
        type: this.type,
      },
    });

    modal.onDidDismiss().then((prod) => {
      const product: Product = prod.data;
      if (product) {
        console.log('selected prod', product);
        this.formulario.patchValue({
          clas: product.clas,
          account: product.account,
          prod: {
            name: product.name,
            price: this.formatCurrency(product.price),
            qty: 1,
          },
        });
        console.log('form', this.formulario.value);
        this.stokProductSelected = product.stok;
        this.totalProd = this.formatCurrency(product.price);
      }
    });
    return await modal.present(); */
  }

  async presentModalCustomer() {
    /*  const modal = await this.modalController.create({
      component: SelectCustomerComponent,
      componentProps: {
        isModal: true,
        type: this.type,
      },
    });
    modal.onDidDismiss().then((customer) => {
      const { data } = customer;
      console.log(data);
      if (data) {
        this.prepareToPay(data);
      }
    });
    return await modal.present(); */
  }

  calculateTotalProd(event) {
    let { price } = this.formulario.value.prod;
    const qty = event.target.value;
    if (qty > this.stokProductSelected && this.type === TypeEnum.INCOME) {
      this.addQty(this.stokProductSelected);
      this.notificationService.presentToast(
        `Só há ${this.stokProductSelected} unidade(s) deste produto em estoque`,
        'top'
      );
      return;
    }
    if (qty < 1) {
      this.addQty(1);
      return;
    }

    if (price) {
      price = +price.replace(',', '.');
      this.totalProd = this.formatCurrency(qty * price);
    }
  }

  calculateTotalInputPrice(event) {
    const { qty } = this.formulario.value.prod;
    let price = event.target.value;
    if (price <= 0) {
      this.formulario.patchValue({
        price: 0,
      });
      this.totalProd = null;
    }
    if (price) {
      price = +price.replace(',', '.');
      this.totalProd = this.formatCurrency(qty * price);
      console.log(this.totalProd);
    }
  }

  addQty(qty: number) {
    this.formulario.patchValue({
      prod: { qty },
    });
  }

  formatCurrency(price) {
    if (!price) {
      return;
    }
    if (price.toString().includes('.')) {
      price = price.toString().replace('.', ',');
    } else {
      price = `${price},00`;
    }
    return price;
  }

  addProductToList() {
    const product = this.formulario.value;
    product.prod.price = +product.prod.price.replace(',', '.');

    this.products.next([...this.products.getValue(), product]);
    this.clearFormProd();
  }

  clearFormProd() {
    this.formulario.reset();
    this.totalProd = null;
    console.log(this.formulario.value);
  }

  totalOrder() {
    return this.products
      .getValue()
      .map((x) => x.prod.price * x.prod.qty)
      .reduce((pre, cur) => pre + cur, 0);
  }

  async deleteProdFromList(index: number) {
    const confirm = await this.notificationService.presentAlert(
      'Confirma a exclusão'
    );
    if (confirm) {
      this.products.next(
        this.products.getValue().filter((data, i) => i !== index)
      );
    }
  }

  clearOrder() {
    this.products.next([]);
    this.totalProd = null;
  }

  async pay(products: any[], customer: any, type: TypeEnum) {
    /* console.log(products, customer, type);
    console.log(this.totalProd);
    const finalizePayment = await this.modalController.create({
      component: FinalizePaymentComponent,
      componentProps: {
        products,
        favored: customer,
        type,
        amount: this.totalOrder(),
      },
    });

    finalizePayment.onDidDismiss().then((data) => {
      if (data.data) {
        this.clearOrder();
      }
    });

    return await finalizePayment.present(); */
  }
}
