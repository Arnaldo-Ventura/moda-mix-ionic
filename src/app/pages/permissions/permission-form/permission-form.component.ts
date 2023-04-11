/* eslint-disable no-underscore-dangle */
import { Component, OnInit } from '@angular/core';
import { BaseFormComponent } from 'src/app/shared/base-form.component';
import { FormBuilder, Validators } from '@angular/forms';
import { PermissionsService } from '../permissions.service';
import { NotificationsService } from 'src/app/shared/notifications.service';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { Permission } from '../models/permissions';
import { EPermission } from 'src/app/shared/enums/permission';

@Component({
  selector: 'app-permission-form',
  templateUrl: './permission-form.component.html',
  styleUrls: ['./permission-form.component.scss'],
})
export class PermissionFormComponent
  extends BaseFormComponent
  implements OnInit
{
  permissionCrud = {
    c: false,
    r: false,
    u: false,
    d: false,
  };

  constructor(
    private formBuilder: FormBuilder,
    private permissionService: PermissionsService,
    private notifications: NotificationsService,
    private activeRoute: ActivatedRoute,
    private router: Router
  ) {
    super();
  }

  ngOnInit() {
    /* this.formulario = this.formBuilder.group({
      _id: [null],
      name: [null, Validators.required],
      permission: this.formBuilder.group(this.permissionCrud),
      user: this.formBuilder.group(this.permissionCrud),
      supplier: this.formBuilder.group(this.permissionCrud),
      cus: this.formBuilder.group(this.permissionCrud),
      brand: this.formBuilder.group(this.permissionCrud),
      category: this.formBuilder.group(this.permissionCrud),
      product: this.formBuilder.group(this.permissionCrud),
      account: this.formBuilder.group(this.permissionCrud),
      car: this.formBuilder.group(this.permissionCrud),
      sal: this.formBuilder.group(this.permissionCrud),
      bil: this.formBuilder.group(this.permissionCrud),
      cco: this.formBuilder.group(this.permissionCrud),
    }); */
    this.formulario = this.formBuilder.group({
      _id: [null],
      name: [null, Validators.required],
      permissions: this.formBuilder.group(this.initForm()),
    });
    console.log(this.formulario.value);
    this.activeRoute.params.pipe(take(1)).subscribe((data) => {
      if (data.id) {
        this.permissionById(data.id);
      }
    });
  }
  initForm() {
    return Object.values(EPermission).reduce(
      (prev, cur) => ({
        ...prev,
        [cur]: this.formBuilder.group(this.permissionCrud),
      }),
      {}
    );
  }
  async submit() {
    if (this.formulario.value._id) {
      const confirm = await this.notifications.presentAlert(
        'Tem certeza que quer editar essa permissão?'
      );
      if (confirm) {
        this.notifications.showLoading();
        this.permissionService
          .edit(this.formulario.value._id, this.formulario.value)
          .subscribe(() => {
            this.notifications.dismisseLoading();
            this.notifications.presentToast('Permissão editada com sucesso');
            this.router.navigate(['/admin/permissoes']);
          });
      }
    } else {
      const confirm = await this.notifications.presentAlert(
        'Tem certeza que quer salvar essa permissão?'
      );
      if (confirm) {
        this.notifications.showLoading();
        this.permissionService.save(this.formulario.value).subscribe(() => {
          this.notifications.dismisseLoading();
          this.notifications.presentToast('Permissão cadastrada com sucesso');
          this.formulario.reset();
        });
      }
    }
  }

  permissionById(id: string) {
    this.permissionService.getById(id).subscribe((data) => {
      this.formulario.patchValue(data);
    });
  }
}
