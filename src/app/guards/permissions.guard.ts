import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable, from } from 'rxjs';
import { StorageService } from '../shared/storage.service';
import { tap } from 'rxjs/operators';
import { NotificationsService } from '../shared/notifications.service';
import { DataRoute } from '../shared/models/data-route';
import { Route } from '@angular/compiler/src/core';

@Injectable({
  providedIn: 'root',
})
export class PermissionsGuard implements CanActivate {
  constructor(
    private storageService: StorageService,
    private notificationsService: NotificationsService,
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const { rote, operation } = next.data;
    const dataRoute = new DataRoute(rote, operation);

    return from(this.storageService.getPermissions(dataRoute)).pipe(
      tap((allowed) => {
        if (!allowed) {
          this.notificationsService.presentToast('Permissão Negada', 'top');
        }
      })
    );
  }
}
