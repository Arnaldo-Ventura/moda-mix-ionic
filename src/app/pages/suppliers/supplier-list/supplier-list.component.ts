import { Component, OnInit, ViewChild } from '@angular/core';
import { SuppliersService } from '../suppliers.service';
import { IonInfiniteScroll, NavController } from '@ionic/angular';
import { Supplier } from '../models/supplier';
import { NotificationsService } from 'src/app/shared/notifications.service';
import { Observable } from 'rxjs';
import { Parametro } from 'src/app/shared/params/parametro';
import { newParams } from 'src/app/shared/params/new-params';
import { UserTypeEnum } from 'src/app/shared/enums/user-type.enum';

@Component({
  selector: 'app-supplier-list',
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.scss'],
})
export class SupplierListComponent implements OnInit {
  @ViewChild(IonInfiniteScroll, { static: true })
  infiniteScroll: IonInfiniteScroll;
  supplierList: Supplier[];
  skip = 0;
  limit = 15;
  loadAll = true;

  constructor(
    private suppliersService: SuppliersService,
    private notifications: NotificationsService,
    private navController: NavController
  ) {}

  ngOnInit() {
    this.reloadSuppliers();
  }

  loadSuppliers(value?): Observable<Supplier[]> {
    const params: Parametro = {
      sort: 'name',
      limit: value ? null : this.limit.toString(),
      skip: this.skip.toString(),
      filter: `type:${UserTypeEnum.SUPPLIER}`,
      name: value ? value : null,
    };
    return this.suppliersService.getAll(newParams(params));
  }

  reloadSuppliers() {
    this.loadSuppliers().subscribe((data) => {
      this.skip = 0;
      this.loadAll = true;
      this.supplierList = data;
    });
  }

  onInput(event) {
    this.loadSuppliers(event).subscribe((data) => {
      this.supplierList = data;
    });
  }

  loadScrollData() {
    this.skip += 15;
    if (this.loadAll) {
      this.loadSuppliers().subscribe((data) => {
        if (data.length < this.limit) {
          this.loadAll = false;
          this.skip = 0;
        }
        this.infiniteScroll.complete();
        this.supplierList = this.supplierList.concat(data);
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
        this.supplierForm(id);
      }
    }
  }

  supplierForm(id?: string) {
    const route = id
      ? `/admin/fornecedores/editar/${id}`
      : '/admin/fornecedores/adicionar';
    this.navController.navigateRoot([route]);
  }

  async delete(id: string) {
    const confirm = await this.notifications.presentAlert(
      'Tem certeza que quer excluir esse fornecedor?'
    );
    if (confirm) {
      this.notifications.showLoading();
      this.suppliersService.delete(id).subscribe(() => {
        this.notifications.dismisseLoading();
        this.notifications.presentToast('Fornecedor excluído com sucesso');
        this.skip = 0;
        this.reloadSuppliers();
      });
    }
  }
}
