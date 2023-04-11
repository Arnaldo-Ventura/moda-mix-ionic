import { Component, OnInit, ViewChild } from '@angular/core';
import { CategoriesService } from '../categories.service';
import { Observable } from 'rxjs';
import { NotificationsService } from 'src/app/shared/notifications.service';
import { FormGroup, FormControl } from '@angular/forms';
import {
  map,
  filter,
  debounceTime,
  distinctUntilChanged,
  switchMap,
} from 'rxjs/operators';
import { Parametro } from 'src/app/shared/params/parametro';
import { newParams } from 'src/app/shared/params/new-params';
import { IonInfiniteScroll, NavController } from '@ionic/angular';
import { Category } from '../models/category';

@Component({
  selector: 'app-categoria-list',
  templateUrl: './categoria-list.component.html',
  styleUrls: ['./categoria-list.component.scss'],
})
export class CategoryListComponent implements OnInit {
  @ViewChild(IonInfiniteScroll, { static: true })
  infiniteScroll: IonInfiniteScroll;
  categoryList: Category[];
  search: string;
  skip = 0;
  limit = 15;
  loadAll = true;

  constructor(
    private categoryService: CategoriesService,
    private notifications: NotificationsService,
    private navController: NavController
  ) {}

  ngOnInit() {
    this.reloadCategories();
  }

  loadCategories(value?): Observable<Category[]> {
    const params: Parametro = {
      sort: 'name',
      limit: value ? null : this.limit.toString(),
      skip: this.skip.toString(),
      name: value ? value : null,
    };
    return this.categoryService.getAll(newParams(params));
  }

  reloadCategories() {
    this.loadCategories().subscribe((data) => {
      this.skip = 0;
      this.loadAll = true;
      this.categoryList = data;
    });
  }

  onInput(event) {
    this.loadCategories(event).subscribe((data) => (this.categoryList = data));
  }

  loadScrollData() {
    this.skip += 15;
    if (this.loadAll) {
      this.loadCategories().subscribe((data) => {
        if (data.length < this.limit) {
          this.loadAll = false;
          this.skip = 0;
        }
        this.infiniteScroll.complete();
        this.categoryList = this.categoryList.concat(data);
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
        this.categoryForm(id);
      }
    }
  }

  categoryForm(id?: string) {
    const route = id
      ? `/admin/categorias/editar/${id}`
      : '/admin/categorias/adicionar';
    this.navController.navigateRoot([route]);
  }

  async delete(id: string) {
    const confirm = await this.notifications.presentAlert(
      'Tem certeza que quer excluir essa categoria?'
    );
    if (confirm) {
      this.notifications.showLoading();
      this.categoryService.delete(id).subscribe(() => {
        this.notifications.dismisseLoading();
        this.notifications.presentToast('Categorias excluída com sucesso');
        this.skip = 0;
        this.reloadCategories();
      });
    }
  }
}
