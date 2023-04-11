/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import {
  ToastController,
  LoadingController,
  AlertController,
  ActionSheetController,
} from '@ionic/angular';
import { RadioOrCheck } from './enums/radio-or-check.enum';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  private loading = this.loadController.create({
    message: 'Carregando',
  });
  constructor(
    private toastController: ToastController,
    private loadController: LoadingController,
    private alertController: AlertController,
    private actionSheetController: ActionSheetController
  ) {}

  async presentToast(
    message: string,
    position: 'top' | 'bottom' | 'middle' = 'bottom',
    color: 'danger' | 'success' | 'dark' = 'dark',
    duration = 2000
  ) {
    const toast = await this.toastController.create({
      message,
      duration,
      color,
      position,
    });
    toast.present();
  }

  async showLoading() {
    const loading = await this.loading;
    loading.present();
  }
  async dismisseLoading() {
    (await this.loading).dismiss();
    this.loading = this.loadController.create({
      message: 'Carregando',
    });
  }

  async presentAlert(message: string): Promise<boolean> {
    return new Promise(async (resolve) => {
      const alert = await this.alertController.create({
        header: 'Confirme',
        message,
        buttons: [
          {
            text: 'Cancelar',
            handler: () => {
              resolve(false);
            },
          },
          {
            text: 'Sim',
            handler: () => {
              resolve(true);
            },
          },
        ],
      });

      await alert.present();
    });
  }

  async presentActionSheet(): Promise<any> {
    return new Promise(async (resolve) => {
      const actionSheet = await this.actionSheetController.create({
        header: 'Selecione uma opção',
        buttons: [
          {
            text: 'Editar',
            icon: 'pencil-sharp',
            handler: () => {
              resolve('edit');
            },
          },
          {
            text: 'Excluir',
            role: 'destructive',
            icon: 'trash',
            handler: () => {
              resolve('delete');
            },
          },
          {
            text: 'Cancelar',
            icon: 'close',
            role: 'cancel',
            handler: () => {
              resolve(false);
            },
          },
        ],
      });
      await actionSheet.present();
    });
  }

  async presentActionSheetProduct(): Promise<any> {
    return new Promise(async (resolve) => {
      const actionSheet = await this.actionSheetController.create({
        header: 'Selecione uma opção',
        buttons: [
          {
            text: 'Editar',
            icon: 'pencil-sharp',
            handler: () => {
              resolve('edit');
            },
          },
          {
            text: 'Detalhes',
            icon: 'ellipsis-horizontal-sharp',
            handler: () => {
              resolve('detail');
            },
          },
          {
            text: 'Destacar',
            icon: 'map-sharp',
            handler: () => {
              resolve('slide');
            },
          },
          {
            text: 'Excluir',
            role: 'destructive',
            icon: 'trash',
            handler: () => {
              resolve('delete');
            },
          },
          {
            text: 'Cancelar',
            icon: 'close',
            role: 'cancel',
            handler: () => {
              resolve(false);
            },
          },
        ],
      });
      await actionSheet.present();
    });
  }

  async presentAlertRadioOrCheck(
    radioOrCheck: RadioOrCheck,
    inputs: any[],
    legend?: string
  ) {
    inputs = inputs.map((x) => ({
      type: radioOrCheck,
      label: x.name,
      value: x._id,
      handler: () => {
        if (radioOrCheck === RadioOrCheck.RADIO) {
          alert.dismiss(x);
        }
      },
    }));

    const buttons = [
      {
        text: 'Cancelar',
        cssClass: 'secondary',
        handler: () => {},
      },
      {
        text: 'Ok',
        handler: (data) => data,
      },
    ];
    const alert = await this.alertController.create({
      header: legend ? legend : 'Selecione',
      inputs,
      buttons: radioOrCheck === RadioOrCheck.CKECKBOX ? buttons : [buttons[0]],
    });
    await alert.present();
    return await alert.onDidDismiss();
  }
}
