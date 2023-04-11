/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-underscore-dangle */
import { Component, OnInit, Input } from '@angular/core';
import { BaseFormComponent } from 'src/app/shared/base-form.component';
import { FormBuilder, Validators } from '@angular/forms';
import { CustomersService } from '../customers.service';
import { NotificationsService } from 'src/app/shared/notifications.service';
import { ActivatedRoute } from '@angular/router';
import { NavController, ModalController } from '@ionic/angular';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss'],
})
export class CustomerFormComponent extends BaseFormComponent implements OnInit {
  @Input() isModal = false;

  constructor(
    private formBuilder: FormBuilder,
    private customersService: CustomersService,
    private notifications: NotificationsService,
    private activeRoute: ActivatedRoute,
    private navController: NavController,
    private modelController: ModalController
  ) {
    super();
  }

  ngOnInit() {
    this.formulario = this.formBuilder.group({
      _id: [null],
      name: [null, Validators.required],
      active: [true],
    });

    this.activeRoute.params.pipe(take(1)).subscribe((data) => {
      if (data.id) {
        this.customerById(data.id);
      }
    });
  }

  async submit() {
    if (this.formulario.value._id) {
      const confirm = await this.notifications.presentAlert(
        'Tem certeza que quer editar esse cliente?'
      );
      if (confirm) {
        const value = this.formulario.value;
        this.notifications.showLoading();
        this.customersService
          .edit(this.formulario.value._id, value)
          .subscribe(() => {
            this.notifications.dismisseLoading();
            this.notifications.presentToast('Cliente editado com sucesso');
            this.navController.navigateRoot(['/clientes']);
          });
      }
    } else {
      const confirm = await this.notifications.presentAlert(
        'Tem certeza que quer salvar esse cliente?'
      );
      if (confirm) {
        const value = this.formulario.value;

        this.notifications.showLoading();
        this.customersService.save(value).subscribe((data) => {
          this.notifications.dismisseLoading();
          this.notifications.presentToast('Cliente cadastrado com sucesso');
          this.isModal
            ? this.onDismiss(data)
            : this.formulario.patchValue({
                name: null,
                email: null,
                phone: null,
              });
        });
      }
    }
  }

  onDismiss(customer?) {
    this.modelController.dismiss(customer);
  }

  customerById(id: string) {
    this.customersService.getById(id).subscribe((data) => {
      this.formulario.patchValue(data);
    });
  }

  /*  configureMaskPhone(phone: string): string {
    let configuredPhone = '';

    for (let index = 0; index < phone.length; index++) {
      switch (index) {
        case 0:
          configuredPhone += '(' + phone[index];
          break;

        case 2:
          configuredPhone += ') ' + phone[index];
          break;

        case 7:
          configuredPhone += '-' + phone[index];
          break;

        default:
          configuredPhone += phone[index];
          break;
      }
    }
    return configuredPhone;
  } */

  back() {
    this.navController.back();
  }
}
