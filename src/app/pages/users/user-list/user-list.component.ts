import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll, NavController } from '@ionic/angular';
import { FormGroup, FormControl } from '@angular/forms';
import { User } from '../models/user';
import { UsersService } from '../users.service';
import { NotificationsService } from 'src/app/shared/notifications.service';
import { map } from 'rxjs/internal/operators/map';
import { filter } from 'rxjs/internal/operators/filter';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs/internal/operators/distinctUntilChanged';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { Observable } from 'rxjs/internal/Observable';
import { Parametro } from 'src/app/shared/params/parametro';
import { newParams } from 'src/app/shared/params/new-params';
import { UserTypeEnum } from 'src/app/shared/enums/user-type.enum';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
  @ViewChild(IonInfiniteScroll, { static: true })
  infiniteScroll: IonInfiniteScroll;

  form: FormGroup;
  userList: User[];
  search: string;
  skip = 0;
  limit = 15;
  getProd = true;

  constructor(
    private userService: UsersService,
    private notifications: NotificationsService,
    private navController: NavController
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      pesq: new FormControl(),
    });

    this.form.valueChanges
      .pipe(
        map((value) => (value.pesq ? value.pesq.trim() : '')),
        filter((value) => value.length > 2),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((value) => this.loadUsers(value))
      )
      .subscribe((data) => {
        this.userList = data;
      });

    this.reloadUsers();
  }

  loadUsers(value?): Observable<User[]> {
    const params: Parametro = {
      sort: 'name',
      limit: value ? null : this.limit.toString(),
      skip: this.skip.toString(),
      filter: value
        ? `name:${value},type:${UserTypeEnum.USER}`
        : `type:${UserTypeEnum.USER}`,
      fields: 'name',
    };
    return this.userService.getAll(newParams(params));
  }

  reloadUsers() {
    this.form.patchValue({ pesq: null });
    this.loadUsers().subscribe((data) => {
      this.userList = data;
    });
  }

  onInput(event) {
    if (!event.target.value) {
      this.skip = 0;
      this.getProd = true;
      this.reloadUsers();
    }
  }

  loadScrollData() {
    this.skip += 5;
    if (this.getProd) {
      this.loadUsers().subscribe((data) => {
        if (data.length < this.limit) {
          this.getProd = false;
          this.skip = 0;
        }
        this.infiniteScroll.complete();
        this.userList = this.userList.concat(data);
      });
    } else {
      this.infiniteScroll.complete();
    }
  }

  async selecionOption(id: string) {
    const option = await this.notifications.presentActionSheet();
    if (option) {
      switch (option) {
        case 'delete':
          this.delete(id);
          break;

        case 'edit':
          this.userForm(id);
          break;
      }
    }
  }

  userForm(id?: string) {
    const route = id
      ? `/admin/funcionarios/editar/${id}`
      : '/admin/funcionarios/adicionar';
    this.navController.navigateRoot([route]);
  }

  async delete(id: string) {
    const confirm = await this.notifications.presentAlert(
      'Tem certeza que quer excluir esse funcionario?'
    );
    if (confirm) {
      this.notifications.showLoading();
      this.userService.delete(id).subscribe(() => {
        this.notifications.dismisseLoading();
        this.notifications.presentToast('Funcionario excluído com sucesso');
        this.skip = 0;
        this.reloadUsers();
      });
    }
  }
}
