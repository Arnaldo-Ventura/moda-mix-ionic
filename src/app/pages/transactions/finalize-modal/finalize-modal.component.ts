import { PayMethodEnum } from 'src/app/shared/enums/pay-method.enum';
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable no-underscore-dangle */
import { AddMethodPayModalComponent } from './../add-method-pay-modal/add-method-pay-modal.component';
import { PayInfoList } from './../model/pay-info-list';
import { NotificationsService } from './../../../shared/notifications.service';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { payMethodList } from 'src/app/shared/enums/pay-method.enum';
import { AlertModalComponent } from '../alert-modal/alert-modal.component';
import { PayInfoDto } from '../model/pay-info-dto';
import { TypeEnum } from 'src/app/shared/enums/type.enum';

@Component({
  selector: 'app-finalize-modal',
  templateUrl: './finalize-modal.component.html',
  styleUrls: ['./finalize-modal.component.scss'],
})
export class FinalizeModalComponent implements OnInit {
  finalizeIsActive = true;
  total: number;
  type: TypeEnum;
  methods = payMethodList();
  payInfoList: PayInfoList[] = [];
  payInfoDto: PayInfoDto[] = [];
  constructor(
    public modalController: ModalController,
    private notificationsService: NotificationsService
  ) {}
  @ViewChild('cash', { static: false }) cash: { setFocus: () => void };
  @ViewChild('inst', { static: false }) inst: { setFocus: () => void };
  @HostListener('document:keydown', ['$event']) onKeydownHandler(
    event: KeyboardEvent
  ) {
    const { key } = event;
    if (this.finalizeIsActive) {
      if (key === 'Enter') {
        this.confirmOperation();
        return;
      }
      if (key.toLocaleLowerCase() === 'd') {
        this.addPay(PayMethodEnum.CASH);
        return;
      }
      if (key.toLocaleLowerCase() === 'p') {
        this.addPay(PayMethodEnum.PIX);
        return;
      }
      if (key.toLocaleLowerCase() === 'c') {
        this.addPay(PayMethodEnum.CREDITCARD);
        return;
      }
      if (key.toLocaleLowerCase() === 'e') {
        this.addPay(PayMethodEnum.DEBITCARD);
        return;
      }
    }
  }

  ngOnInit() {}

  includesMethod(method = 'ca' || 'px' || 'dc' || 'cc') {
    return this.payInfoList.some((info) => info.method === method);
  }
  async addPay(method: string = 'ca' || 'px' || 'dc' || 'cc') {
    if (this.finalizeIsActive) {
      const restValue =
        this.total -
        this.payInfoList.reduce((prev, cur) => prev + cur.amount, 0);
      if (restValue > 0) {
        this.finalizeIsActive = false;
        const modal = await this.modalController.create({
          component: AddMethodPayModalComponent,
          componentProps: {
            amount: restValue,
            method,
            methodName: this.methodPayName(method),
            type: this.type,
          },
        });
        modal.onDidDismiss().then(({ data }) => {
          this.finalizeIsActive = true;
          if (data) {
            this.payInfoList.push(data);
          }
        });
        return await modal.present();
      } else {
        this.notificationsService.presentToast(
          'O valor total da compra já foi atingindo!',
          'middle',
          'danger'
        );
      }
    }
  }
  methodPayName(methodValue: string = 'cash' || 'pix' || 'debit' || 'credit') {
    return this.methods.find((x) => x.value === methodValue).name;
  }
  async confirmOperation() {
    const pays = this.getInfoPayDto();
    if (pays.length === 0) {
      this.notificationsService.presentToast(
        'Inclua uma forma de pagamento',
        'top',
        'danger'
      );
    } else {
      this.finalizeIsActive = false;
      const modal = await this.modalController.create({
        component: AlertModalComponent,
        cssClass: 'modal-alert',
        componentProps: {
          title: 'Confima o Pagamento?',
        },
      });
      modal.onDidDismiss().then(({ data }) => {
        this.finalizeIsActive = true;
        if (data) {
          this.submit(pays);
        }
      });
      return await modal.present();
    }
  }

  getInfoPayDto(): PayInfoDto[] {
    return this.payInfoList.map((payInfo) => ({
      method: payInfo.method,
      amount: payInfo.amount,
      cash: payInfo.cash,
      change: payInfo.change,
      installs: payInfo?.infoCard?.installs || 1,
      infoCard: payInfo.infoCard
        ? {
            card: payInfo.infoCard.card._id,
            operator:
              this.type === TypeEnum.INCOME
                ? payInfo.infoCard.operator._id
                : undefined,
          }
        : undefined,
    }));
  }

  submit(pays: PayInfoDto[]) {
    setTimeout(() => {
      this.modalController.dismiss(pays);
    }, 100);
  }
}
