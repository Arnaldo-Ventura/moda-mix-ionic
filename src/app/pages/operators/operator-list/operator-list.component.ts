import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll, NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { NotificationsService } from 'src/app/shared/notifications.service';
import { newParams } from 'src/app/shared/params/new-params';
import { Parametro } from 'src/app/shared/params/parametro';
import { StorageService } from 'src/app/shared/storage.service';
import { Operator } from '../model/operator';
import { OperatorsService } from '../operators.service';

@Component({
  selector: 'app-operator-list',
  templateUrl: './operator-list.component.html',
  styleUrls: ['./operator-list.component.scss'],
})
export class OperatorListComponent implements OnInit {
  @ViewChild(IonInfiniteScroll, { static: true })
  infiniteScroll: IonInfiniteScroll;
  operatorList: Operator[];
  search: string;
  skip = 0;
  limit = 15;
  loadAll = true;
  // unitId: string;

  constructor(
    private operatorService: OperatorsService,
    private notifications: NotificationsService,
    private navController: NavController,
    private storageService: StorageService
  ) {}

  ngOnInit() {
    //this.getUnitIdLogged();
    this.reloadOperators();
  }

  loadOperators(value?): Observable<Operator[]> {
    const params: Parametro = {
      limit: value ? null : this.limit.toString(),
      skip: this.skip.toString(),
      name: value ? value : null,
    };
    return this.operatorService.getAll(newParams(params));
  }
  /*  async getUnitIdLogged() {
    const { _id } = await this.storageService.getUnitLogged();
    this.unitId = _id;
  }
 */
  reloadOperators() {
    this.loadOperators().subscribe((data) => {
      this.skip = 0;
      this.loadAll = true;
      this.operatorList = data;
    });
  }

  onInput(event) {
    this.loadOperators(event).subscribe((data) => (this.operatorList = data));
  }

  loadScrollData() {
    this.skip += 15;
    if (this.loadAll) {
      this.loadOperators().subscribe((data) => {
        if (data.length < this.limit) {
          this.loadAll = false;
          this.skip = 0;
        }
        this.infiniteScroll.complete();
        this.operatorList = this.operatorList.concat(data);
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
      ? `/admin/operadoras/editar/${id}`
      : '/admin/operadoras/adicionar';
    this.navController.navigateRoot([route]);
  }

  async delete(id: string) {
    const confirm = await this.notifications.presentAlert(
      'Tem certeza que quer excluir essa operadora?'
    );
    if (confirm) {
      this.notifications.showLoading();
      this.operatorService.delete(id).subscribe(() => {
        this.notifications.dismisseLoading();
        this.notifications.presentToast('Operadora excluída com sucesso');
        this.skip = 0;
        this.reloadOperators();
      });
    }
  }
}
