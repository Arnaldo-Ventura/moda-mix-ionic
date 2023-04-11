import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll, NavController } from '@ionic/angular';
import { FormGroup, FormControl } from '@angular/forms';
import { Product } from '../models/product';
import { ProductsService } from '../products.service';
import { NotificationsService } from 'src/app/shared/notifications.service';
import { Router } from '@angular/router';
import {
  map,
  filter,
  debounceTime,
  distinctUntilChanged,
  switchMap,
} from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Parametro } from 'src/app/shared/params/parametro';
import { newParams } from 'src/app/shared/params/new-params';
import { TypeEnum } from 'src/app/shared/enums/type.enum';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  @ViewChild(IonInfiniteScroll, { static: true })
  infiniteScroll: IonInfiniteScroll;

  form: FormGroup;
  productList: Product[];
  search: string;
  skip = 0;
  limit = 15;
  loadAll = true;

  constructor(
    private productService: ProductsService,
    private notifications: NotificationsService,
    private router: Router,
    private navController: NavController
  ) {}

  ngOnInit() {
    this.reloadProducts();
  }

  loadProducts(value?: string): Observable<Product[]> {
    const params: Parametro = {
      sort: 'name',
      limit: value ? null : this.limit.toString(),
      skip: this.skip.toString(),
      name: value ? `${value}` : undefined,
      fields: 'img,name',
    };
    return this.productService.getAll(newParams(params));
  }

  reloadProducts() {
    this.loadProducts().subscribe((data) => {
      this.skip = 0;
      this.loadAll = true;
      this.productList = data;
    });
  }

  onInput(event) {
    this.loadProducts(event).subscribe((data) => (this.productList = data));
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

  async selecionOption(id: string) {
    const option = await this.notifications.presentActionSheetProduct();
    if (option) {
      switch (option) {
        case 'delete':
          this.delete(id);
          break;

        case 'edit':
          this.productForm(id);
          break;

        case 'slide':
          this.slide(id);
          break;

        case 'detail':
          this.detail(id);
          break;
      }
    }
  }

  slide(id) {
    this.router.navigate([`/admin/produtos/venda/destaque/${id}`]);
  }

  detail(id) {
    this.router.navigate([`/admin/produtos/venda/detalhes/${id}`]);
  }

  productForm(id?: string) {
    const route = id
      ? `/admin/produtos/editar/${id}`
      : '/admin/produtos/adicionar';
    this.navController.navigateRoot([route]);
  }

  async delete(id: string) {
    const confirm = await this.notifications.presentAlert(
      'Tem certeza que quer excluir esse produto?'
    );
    if (confirm) {
      this.notifications.showLoading();
      this.productService.delete(id).subscribe(() => {
        this.notifications.dismisseLoading();
        this.notifications.presentToast('Produto excluído com sucesso');
        this.skip = 0;
        this.reloadProducts();
      });
    }
  }
}
