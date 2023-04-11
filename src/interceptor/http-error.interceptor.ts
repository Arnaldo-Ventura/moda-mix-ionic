import { ModalController, NavController } from '@ionic/angular';
import { NotificationsService } from 'src/app/shared/notifications.service';
import { ErrorService } from 'src/app/shared/errors/errors.service';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(
    //  private router: Router,
    private navCtrl: NavController,
    private errorService: ErrorService,
    private modalController: ModalController
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      retry(1),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        if (error.status === 401 && error.statusText === 'Unauthorized') {
          this.modalController.dismiss();
          this.navCtrl.navigateRoot('/login');
        }
        this.errorService.serverError(error);
        return throwError(error);
      })
    );
  }
}
