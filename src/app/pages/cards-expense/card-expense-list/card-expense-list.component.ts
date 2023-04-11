import { CardsExpenseService } from './../cards-expense.service';
import { CardExpense } from './../models/card-expense';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll, NavController } from '@ionic/angular';
import { NotificationsService } from 'src/app/shared/notifications.service';
import { Observable } from 'rxjs';
import { Parametro } from 'src/app/shared/params/parametro';
import { newParams } from 'src/app/shared/params/new-params';

@Component({
  selector: 'app-card-expense-list',
  templateUrl: './card-expense-list.component.html',
  styleUrls: ['./card-expense-list.component.scss'],
})
export class CardExpenseListComponent implements OnInit {
  @ViewChild(IonInfiniteScroll, { static: true })
  infiniteScroll: IonInfiniteScroll;
  cardExpenseList: CardExpense[];
  skip = 0;
  limit = 15;
  loadAll = true;

  constructor(
    private cardExpenseService: CardsExpenseService,
    private notifications: NotificationsService,
    private navController: NavController
  ) {}

  ngOnInit() {
    this.reloadCardsExpense();
  }

  loadCardsExpense(value?): Observable<CardExpense[]> {
    const params: Parametro = {
      sort: 'name',
      limit: value ? null : this.limit.toString(),
      skip: this.skip.toString(),
      name: value ? value : null,
    };
    return this.cardExpenseService.getAll(newParams(params));
  }

  reloadCardsExpense() {
    this.loadCardsExpense().subscribe((data) => {
      this.skip = 0;
      this.loadAll = true;
      this.cardExpenseList = data;
    });
  }

  onInput(event) {
    this.loadCardsExpense(event).subscribe((data) => {
      this.cardExpenseList = data;
    });
  }

  loadScrollData() {
    this.skip += 15;
    if (this.loadAll) {
      this.loadCardsExpense().subscribe((data) => {
        if (data.length < this.limit) {
          this.loadAll = false;
          this.skip = 0;
        }
        this.infiniteScroll.complete();
        this.cardExpenseList = this.cardExpenseList.concat(data);
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
    const route = id
      ? `/admin/cartoes-despesas/editar/${id}`
      : '/admin/cartoes-despesas/adicionar';
    this.navController.navigateRoot([route]);
  }

  async delete(id: string) {
    const confirm = await this.notifications.presentAlert(
      'Tem certeza que quer excluir esse cartão?'
    );
    if (confirm) {
      this.notifications.showLoading();
      this.cardExpenseService.delete(id).subscribe(() => {
        this.notifications.dismisseLoading();
        this.notifications.presentToast('Cartão excluído com sucesso');
        this.skip = 0;
        this.reloadCardsExpense();
      });
    }
  }
}
