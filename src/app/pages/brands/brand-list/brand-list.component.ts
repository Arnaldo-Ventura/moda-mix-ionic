import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { Parametro } from 'src/app/shared/params/parametro';
import {
  map,
  filter,
  debounceTime,
  distinctUntilChanged,
  switchMap,
} from 'rxjs/operators';
import { IonInfiniteScroll, NavController } from '@ionic/angular';
import { FormGroup, FormControl } from '@angular/forms';
import { BrandsService } from '../brand.service';
import { NotificationsService } from 'src/app/shared/notifications.service';
import { newParams } from 'src/app/shared/params/new-params';
import { Brand } from '../models/brand';

@Component({
  selector: 'app-brand-list',
  templateUrl: './brand-list.component.html',
  styleUrls: ['./brand-list.component.scss'],
})
export class BrandListComponent implements OnInit {
  @ViewChild(IonInfiniteScroll, { static: true })
  infiniteScroll: IonInfiniteScroll;
  brandList: Brand[];
  search: string;
  skip = 0;
  limit = 15;
  loadAll = true;

  constructor(
    private brandService: BrandsService,
    private notifications: NotificationsService,
    private navController: NavController
  ) {}

  ngOnInit() {
    this.reloadMarca();
  }

  loadMarca(value?): Observable<Brand[]> {
    const params: Parametro = {
      sort: 'name',
      limit: value ? null : this.limit.toString(),
      skip: this.skip.toString(),
      name: value ? value : null,
    };
    return this.brandService.getAll(newParams(params));
  }

  reloadMarca() {
    this.loadMarca().subscribe((data) => {
      this.skip = 0;
      this.loadAll = true;
      this.brandList = data;
    });
  }

  onInput(event) {
    this.loadMarca(event).subscribe((data) => (this.brandList = data));
  }

  loadScrollData() {
    this.skip += 15;
    if (this.loadAll) {
      this.loadMarca().subscribe((data) => {
        if (data.length < this.limit) {
          this.loadAll = false;
          this.skip = 0;
        }
        this.infiniteScroll.complete();
        this.brandList = this.brandList.concat(data);
      });
    } else {
      this.infiniteScroll.complete();
    }
  }

  async selecionOption(id: string) {
    const option = await this.notifications.presentActionSheet();
    if (option) {
      if (option === 'delete') {
        this.delete(id);
      } else {
        this.navegationForm(id);
      }
    }
  }

  navegationForm(id?: string) {
    const route = id ? `/admin/marcas/editar/${id}` : '/admin/marcas/adicionar';
    this.navController.navigateRoot([route]);
  }

  async delete(id: string) {
    const confirm = await this.notifications.presentAlert(
      'Tem certeza que quer excluir essa maarca?'
    );
    if (confirm) {
      this.notifications.showLoading();
      this.brandService.delete(id).subscribe(() => {
        this.notifications.dismisseLoading();
        this.notifications.presentToast('brand excluída com sucesso');
        this.skip = 0;
        this.reloadMarca();
      });
    }
  }
}
