import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IonInfiniteScroll, NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { NotificationsService } from 'src/app/shared/notifications.service';
import { newParams } from 'src/app/shared/params/new-params';
import { Parametro } from 'src/app/shared/params/parametro';
import { CardsService } from '../cards.service';
import { Card } from '../models/card';

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss'],
})
export class CardListComponent implements OnInit {
  @ViewChild(IonInfiniteScroll, { static: true })
  infiniteScroll: IonInfiniteScroll;

  form: FormGroup;
  cardList: Card[];
  search: string;
  skip = 0;
  limit = 15;
  getCat = true;

  constructor(
    private cardService: CardsService,
    private notifications: NotificationsService,
    private navController: NavController
  ) {}

  ngOnInit() {
    this.reloadCard();
  }

  loadCard(value?): Observable<Card[]> {
    const params: Parametro = {
      sort: 'name',
      limit: value ? null : this.limit.toString(),
      skip: this.skip.toString(),
      filter: value ? `name:${value}` : 'active:true',
      fields: 'name',
    };
    return this.cardService.getAll(newParams(params));
  }

  reloadCard() {
    this.loadCard().subscribe((data) => (this.cardList = data));
  }

  onInput(event) {
    this.loadCard(event).subscribe((data) => (this.cardList = data));
  }

  loadScrollData() {
    this.skip += 5;
    if (this.getCat) {
      this.loadCard().subscribe((data) => {
        if (data.length < this.limit) {
          this.getCat = false;
          this.skip = 0;
        }
        this.infiniteScroll.complete();
        this.cardList = this.cardList.concat(data);
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
      ? `/admin/cartoes/editar/${id}`
      : '/admin/cartoes/adicionar';
    this.navController.navigateRoot([route]);
  }

  async delete(id: string) {
    const confirm = await this.notifications.presentAlert(
      'Tem certeza que quer excluir esse cartão?'
    );
    if (confirm) {
      this.notifications.showLoading();
      this.cardService.delete(id).subscribe(() => {
        this.notifications.dismisseLoading();
        this.notifications.presentToast('Cartão excluído com sucesso');
        this.skip = 0;
        this.reloadCard();
      });
    }
  }
}
