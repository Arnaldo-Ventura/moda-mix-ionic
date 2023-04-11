/* eslint-disable no-underscore-dangle */
import { Component, OnInit } from '@angular/core';
import { BaseFormComponent } from 'src/app/shared/base-form.component';
import { FormBuilder, Validators } from '@angular/forms';
import { AccountsService } from '../accounts.service';
import { NotificationsService } from 'src/app/shared/notifications.service';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { take } from 'rxjs/operators';
import { typeList } from 'src/app/shared/enums/type.enum';

@Component({
  selector: 'app-accounts-form',
  templateUrl: './account-form.component.html',
  styleUrls: ['./account-form.component.scss'],
})
export class AccountFormComponent extends BaseFormComponent implements OnInit {
  typeList = typeList();

  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountsService,
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
        this.accountById(data.id);
      }
    });
  }

  initForm() {
    this.formulario = this.formBuilder.group({
      _id: [null],
      name: [null, Validators.required],
      type: [null, Validators.required],
      active: [true],
    });
  }

  async submit() {
    if (this.formulario.value._id) {
      const confirm = await this.notifications.presentAlert(
        'Confirma essa edição?'
      );
      if (confirm) {
        this.notifications.showLoading();
        this.accountService
          .edit(this.formulario.value._id, this.formulario.value)
          .subscribe((data) => {
            this.back();
            this.notifications.dismisseLoading();
            this.notifications.presentToast('Conta editada com sucesso');
          });
      }
    } else {
      const confirm = await this.notifications.presentAlert(
        'Confirma esse cadastro?'
      );
      if (confirm) {
        this.notifications.showLoading();
        this.accountService.save(this.formulario.value).subscribe(() => {
          this.notifications.dismisseLoading();
          this.initForm();
          this.notifications.presentToast('Cadastrado com sucesso');
        });
      }
    }
  }

  accountById(id: string) {
    this.accountService.getById(id).subscribe((data) => {
      this.formulario.patchValue(data);
    });
  }

  back() {
    this.navController.back();
  }
}
