/* eslint-disable no-underscore-dangle */
import { OperatorsService } from './../operators.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { take } from 'rxjs/operators';
import { BaseFormComponent } from 'src/app/shared/base-form.component';
import { payCardMethodList } from 'src/app/shared/enums/pay-method.enum';
import { NotificationsService } from 'src/app/shared/notifications.service';
import { OperationModalComponent } from '../operation-modal/operation-modal.component';
import { Cards } from '../model/operator';
import { Parametro } from 'src/app/shared/params/parametro';
import { newParams } from 'src/app/shared/params/new-params';
import { InstallmentsModalComponent } from '../installments-modal/installments-modal.component';
import { UnitsService } from 'src/app/shared/units.service';
import { Card } from '../../cards/models/card';
import { CardsService } from '../../cards/cards.service';

@Component({
  selector: 'app-operator-form',
  templateUrl: './operator-form.component.html',
  styleUrls: ['./operator-form.component.scss'],
})
export class OperatorFormComponent extends BaseFormComponent implements OnInit {
  noImage = '../../../../assets/images/no_image.png';
  methodCardList = payCardMethodList();
  existsMoreThanOneUnit = false;
  unitList: string[] = [];
  cardList: Card[];
  cards: Cards[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private unitService: UnitsService,
    private operatorService: OperatorsService,
    private cardService: CardsService,
    private notifications: NotificationsService,
    private activeRoute: ActivatedRoute,
    private navController: NavController,
    private modalController: ModalController
  ) {
    super();
  }

  ngOnInit() {
    this.initForm();
    this.loadCards();
    this.activeRoute.params.pipe(take(1)).subscribe((data) => {
      if (data.id) {
        this.operatorById(data.id);
      }
    });
  }

  initForm() {
    this.formulario = this.formBuilder.group({
      _id: [null],
      name: [null, Validators.required],
      active: [true],
      unit: [[null], Validators.required],
      cards: [[]],
    });
    this.setUnit();
  }

  setUnit() {
    this.unitService.getAll().subscribe((units) => {
      console.log(units);
      this.unitList = units.map((unit) => unit.name);
      if (units.length > 1) {
        this.existsMoreThanOneUnit = true;
      } else {
        this.existsMoreThanOneUnit = false;
        this.formulario.patchValue({
          unit: [this.unitList[0]],
        });
      }
    });
  }

  loadCards() {
    const params: Parametro = {
      filter: 'active:true',
      fields: 'name,img',
    };
    this.cardService
      .getAll(newParams(params))
      .subscribe((data) => (this.cardList = data));
  }

  async submit() {
    if (this.formulario.value._id) {
      this.edit();
    } else {
      this.save();
    }
  }

  async save() {
    const confirm = await this.notifications.presentAlert(
      'Tem certeza que quer salvar essa operadora?'
    );
    if (confirm) {
      this.notifications.showLoading();
      this.operatorService.save(this.formulario.value).subscribe((data) => {
        this.notifications.dismisseLoading();
        this.notifications.presentToast('Cartão cadastrado com sucesso');
        this.formulario.patchValue(data);
      });
    }
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: OperationModalComponent,
      cssClass: 'modal-operation',
      componentProps: {
        cardList: this.cardList,
      },
    });
    modal.onDidDismiss().then(({ data }) => {
      if (data) {
        this.addCards(data);
      }
    });
    return await modal.present();
  }

  async presentInstallmentsModal(instalments: number[]) {
    const modal = await this.modalController.create({
      component: InstallmentsModalComponent,
      componentProps: {
        instalments,
      },
    });
    return await modal.present();
  }
  getCardImage(id: string) {
    const card = this.cardList.find((x) => x._id === id);
    return card ? card.img : this.noImage;
  }

  addCards(card: Cards) {
    const cards: Cards[] = this.formulario.value.cards;
    const cardAlreadyIncludes = cards.some((x) => x.card._id === card.card._id);
    if (!cardAlreadyIncludes) {
      cards.push(card);
      this.formulario.patchValue({
        cards,
      });
    } else {
      this.notifications.presentToast(
        'Cartão já adicionado',
        'top',
        'danger',
        4000
      );
    }
  }

  async deleteCard(index: number) {
    const confirm = await this.notifications.presentAlert(
      'Confirma a exclusão do cartão?'
    );
    if (confirm) {
      const cards = this.formulario.value.cards;
      this.formulario.patchValue({
        cards: cards.filter((_, i) => i !== index),
      });
    }
  }

  async edit() {
    const confirm = await this.notifications.presentAlert(
      'Tem certeza que quer editar essa operadora?'
    );
    if (confirm) {
      this.notifications.showLoading();
      this.operatorService
        .edit(this.formulario.value._id, this.formulario.value)
        .subscribe(() => {
          this.notifications.dismisseLoading();
          this.notifications.presentToast('Operadora editada com sucesso');
          this.navController.back();
        });
    }
  }

  operatorById(id: string) {
    this.operatorService.getById(id).subscribe((data) => {
      this.formulario.patchValue(data);
    });
  }

  back() {
    this.navController.back();
  }
}
