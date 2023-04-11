import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationsService } from '../notifications.service';
import { errors } from './errors';
import { ErrorAdapt } from './error-adapt';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  constructor(private notificationsService: NotificationsService) {}

  isConnected() {
    return navigator.onLine;
  }

  serverError(error: HttpErrorResponse) {
    this.notificationsService.dismisseLoading();
    if (!this.isConnected()) {
      this.notificationsService.presentToast(
        'Parece que você não está conectado(a) a internet',
        'top'
      );
    } else {
      const errorAdapt: ErrorAdapt = this.getServerMessage(error);
      this.notificationsService.presentToast(
        errorAdapt.messageView,
        'top',
        'danger',
        5000
      );
    }
  }

  getServerMessage(error: HttpErrorResponse): ErrorAdapt {
    const foundErrorAdapt = errors.find(
      (e: ErrorAdapt) =>
        e.code === error.status && e.message === error.error.error
    );
    return foundErrorAdapt
      ? foundErrorAdapt
      : {
          message: 'test',
          code: error.status,
          messageView: JSON.stringify(error.error.error),
        };
  }
}
