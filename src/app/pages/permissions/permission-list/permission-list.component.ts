import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll, NavController } from '@ionic/angular';
import { Permission } from '../models/permissions';
import { PermissionsService } from '../permissions.service';
import { NotificationsService } from 'src/app/shared/notifications.service';
import { Observable } from 'rxjs';
import { Parametro } from 'src/app/shared/params/parametro';
import { newParams } from 'src/app/shared/params/new-params';

@Component({
  selector: 'app-permission-list',
  templateUrl: './permission-list.component.html',
  styleUrls: ['./permission-list.component.scss'],
})
export class PermissionListComponent implements OnInit {
  @ViewChild(IonInfiniteScroll, { static: true })
  infiniteScroll: IonInfiniteScroll;
  permissionList: Permission[];
  skip = 0;
  limit = 15;
  loadAll = true;

  constructor(
    private permissionService: PermissionsService,
    private notifications: NotificationsService,
    private navController: NavController
  ) {}

  ngOnInit() {
    this.reloadPermissions();
  }

  loadPermissions(value?): Observable<Permission[]> {
    const params: Parametro = {
      sort: 'name',
      limit: value ? null : this.limit.toString(),
      skip: this.skip.toString(),
      filter: value ? `name:${value}` : null,
    };
    return this.permissionService.getAll(newParams(params));
  }

  reloadPermissions() {
    this.loadPermissions().subscribe((data) => {
      this.skip = 0;
      this.loadAll = true;
      this.permissionList = data;
    });
  }

  onInput(event) {
    this.loadPermissions(event).subscribe(
      (data) => (this.permissionList = data)
    );
  }

  loadScrollData() {
    this.skip += 15;
    if (this.loadAll) {
      this.loadPermissions().subscribe((data) => {
        if (data.length < this.limit) {
          this.loadAll = false;
          this.skip = 0;
        }
        this.infiniteScroll.complete();
        this.permissionList = this.permissionList.concat(data);
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
        this.permissionForm(id);
      }
    }
  }

  permissionForm(id?: string) {
    const route = id
      ? `/admin/permissoes/editar/${id}`
      : '/admin/permissoes/adicionar';
    this.navController.navigateRoot([route]);
  }

  async delete(id: string) {
    const confirm = await this.notifications.presentAlert(
      'Tem certeza que quer excluir essa permissão?'
    );
    if (confirm) {
      this.notifications.showLoading();
      this.permissionService.delete(id).subscribe(() => {
        this.notifications.dismisseLoading();
        this.notifications.presentToast('Permissão excluída com sucesso');
        this.skip = 0;
        this.reloadPermissions();
      });
    }
  }
}
