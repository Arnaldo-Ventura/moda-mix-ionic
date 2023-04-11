import { Component, HostListener, Input, ViewChild } from '@angular/core';
import { IonInfiniteScroll, ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { EChannel } from 'src/app/shared/enums/show';
import { newParams } from 'src/app/shared/params/new-params';
import { Parametro } from 'src/app/shared/params/parametro';
import { Product } from '../../products/models/product';
import { ProductsService } from '../../products/products.service';
import { AlertModalComponent } from '../../transactions/alert-modal/alert-modal.component';

@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.scss'],
})
export class ProductSearchComponent {
  @Input() filter: string;
  @Input() fields: string;
  @ViewChild(IonInfiniteScroll, { static: true })
  infiniteScroll: IonInfiniteScroll;
  searchProductIsActive = true;
  indexItemSelected = 0;
  productList: Product[];
  search: string;
  skip = 0;
  limit = 15;
  loadAll = true;

  constructor(
    public modalController: ModalController,
    private productService: ProductsService
  ) {}
  @HostListener('document:keydown', ['$event']) onKeydownHandler(
    event: KeyboardEvent
  ) {
    const { key } = event;
    if (this.searchProductIsActive) {
      if (key === 'ArrowUp') {
        this.decrement();
        return;
      }
      if (key === 'ArrowDown') {
        this.increment();
        return;
      }
      if (key === 'Enter') {
        this.selectProduct(this.indexItemSelected);
      }
    }
  }

  loadProducts(value?: string): Observable<Product[]> {
    const params: Parametro = {
      sort: 'name',
      limit: value ? null : this.limit.toString(),
      skip: this.skip.toString(),
      name: value ? `${value}` : undefined,
      filter: this.filter,
      fields: this.fields,
    };
    return this.productService.getAll(newParams(params));
  }

  reloadProducts() {
    this.productList = [];
  }

  onInput(event) {
    this.loadProducts(event).subscribe((data) => (this.productList = data));
  }

  selectProduct(i: number) {
    this.indexItemSelected = i;
    this.confirmOperation();
  }

  increment() {
    if (this.indexItemSelected < this.productList.length - 1) {
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
      this.loadProducts().subscribe((data) => {
        if (data.length < this.limit) {
          this.loadAll = false;
          this.skip = 0;
        }
        this.infiniteScroll.complete();
        this.productList = this.productList.concat(data);
      });
    } else {
      this.infiniteScroll.complete();
    }
  }

  async confirmOperation() {
    this.searchProductIsActive = false;
    const modal = await this.modalController.create({
      component: AlertModalComponent,
      cssClass: 'modal-alert',
      componentProps: {
        title: 'Confirma a inclusão do produto?',
      },
    });
    modal.onDidDismiss().then(({ data }) => {
      if (data) {
        this.onDismiss();
      } else {
        this.searchProductIsActive = true;
      }
    });
    return await modal.present();
  }

  onDismiss() {
    setTimeout(() => {
      this.modalController.dismiss(this.productList[this.indexItemSelected]);
    }, 100);
  }
}
