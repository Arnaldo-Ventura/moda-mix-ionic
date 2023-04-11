/* eslint-disable no-underscore-dangle */
import { Component, OnInit } from '@angular/core';
import { BaseFormComponent } from 'src/app/shared/base-form.component';
import { FormBuilder, Validators } from '@angular/forms';
import { UsersService } from '../users.service';
import { NotificationsService } from 'src/app/shared/notifications.service';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { UnitsService } from 'src/app/shared/units.service';
import { PermissionsService } from '../../permissions/permissions.service';
import { take } from 'rxjs/operators';
import { Unit } from 'src/app/shared/models/unit';
import { Permission } from '../../permissions/models/permissions';
import { UserTypeEnum } from 'src/app/shared/enums/user-type.enum';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent extends BaseFormComponent implements OnInit {
  unitList: Unit[] = [];
  permissionList: Observable<Permission[]>;
  idEdit: string = null;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UsersService,
    private unitService: UnitsService,
    private permissionService: PermissionsService,
    private notifications: NotificationsService,
    private activeRoute: ActivatedRoute,
    private navController: NavController
  ) {
    super();
  }

  ngOnInit() {
    this.initForm();

    this.activeRoute.params.pipe(take(1)).subscribe((data) => {
      if (data.id) {
        this.idEdit = data.id;
        this.loadPermissions();
        this.loadUnits();
      } else {
        this.loadUnits();
        this.loadPermissions();
      }
    });
  }

  initForm() {
    this.formulario = this.formBuilder.group({
      _id: [null],
      name: [null, Validators.required],
      email: [null, Validators.required],
      per: [null, Validators.required],
      type: UserTypeEnum.USER,
      active: [true, Validators.required],
      unit: [null, Validators.required],
    });
  }
  loadUnits() {
    this.unitService.getAll().subscribe((data) => {
      this.unitList = data;
      console.log(data);
      if (data.length === 1) {
        this.formulario.patchValue({
          unit: [data[0]._id],
        });
      }
      if (this.idEdit) {
        this.userById(this.idEdit);
      }
    });
  }

  loadPermissions() {
    this.permissionList = this.permissionService.getAll();
  }

  async submit() {
    if (this.formulario.value._id) {
      const confirm = await this.notifications.presentAlert(
        'Tem certeza que quer editar esse funcionário?'
      );
      if (confirm) {
        this.notifications.showLoading();
        this.userService
          .edit(this.formulario.value._id, this.formulario.value)
          .subscribe(() => {
            this.notifications.dismisseLoading();
            this.notifications.presentToast('Funcionário editado com sucesso');
            this.navController.navigateRoot(['/funcionarios']);
          });
      }
    } else {
      const confirm = await this.notifications.presentAlert(
        'Tem certeza que quer salvar esse funcionário?'
      );
      if (confirm) {
        const user = this.formulario.value;
        delete user._id;
        this.notifications.showLoading();
        this.userService.save(user).subscribe(() => {
          this.notifications.dismisseLoading();
          this.notifications.presentToast('Funcionário cadastrado com sucesso');
          this.initForm();
        });
      }
    }
  }

  userById(id: string) {
    this.userService.getById(id).subscribe((data) => {
      this.formulario.patchValue(data);
    });
  }

  back() {
    this.navController.back();
  }
}
