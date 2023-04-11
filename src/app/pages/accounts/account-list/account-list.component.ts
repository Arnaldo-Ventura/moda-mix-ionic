import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll, NavController } from '@ionic/angular';
import { FormGroup, FormControl } from '@angular/forms';
import { NotificationsService } from 'src/app/shared/notifications.service';
import { map } from 'rxjs/internal/operators/map';
import {
  filter,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  tap,
} from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Parametro } from 'src/app/shared/params/parametro';
import { newParams } from 'src/app/shared/params/new-params';
import { Account } from '../models/account';
import { AccountsService } from '../accounts.service';

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.scss'],
})
export class AccountListComponent implements OnInit {
  @ViewChild(IonInfiniteScroll, { static: true })
  infiniteScroll: IonInfiniteScroll;
  accountList: Account[];
  search: string;
  skip = 0;
  limit = 15;
  loadAll = true;
  constructor(
    private accountsService: AccountsService,
    private notifications: NotificationsService,
    private navController: NavController
  ) {}

  ngOnInit() {
    this.reloadAccounts();
  }

  loadAccounts(value?): Observable<Account[]> {
    const params: Parametro = {
      sort: 'name',
      limit: value ? null : this.limit.toString(),
      skip: this.skip.toString(),
      name: value ? value : null,
      fields: 'name,active',
    };
    return this.accountsService.getAll(newParams(params));
  }

  reloadAccounts() {
    this.loadAccounts().subscribe((data) => {
      this.skip = 0;
      this.loadAll = true;
      this.accountList = data;
    });
  }
  onInput(event) {
    this.loadAccounts(event).subscribe((data) => {
      this.accountList = data;
    });
  }

  loadScrollData() {
    this.skip += 15;
    if (this.loadAll) {
      this.loadAccounts().subscribe((data) => {
        if (data.length < this.limit) {
          this.loadAll = false;
          this.skip = 0;
        }
        this.infiniteScroll.complete();
        this.accountList = this.accountList.concat(data);
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
        this.createOrEdit(id);
      }
    }
  }

  createOrEdit(id?: string) {
    const route = id
      ? `/admin/plano-contas/editar/${id}`
      : '/admin/plano-contas/adicionar';
    this.navController.navigateRoot([route]);
  }

  async delete(id: string) {
    const confirm = await this.notifications.presentAlert(
      'Tem certeza que quer excluir essa Conta?'
    );
    if (confirm) {
      this.notifications.showLoading();
      this.accountsService.delete(id).subscribe(() => {
        this.notifications.dismisseLoading();
        this.notifications.presentToast('Conta excluída com sucesso');
        this.skip = 0;
        this.reloadAccounts();
      });
    }
  }
}
