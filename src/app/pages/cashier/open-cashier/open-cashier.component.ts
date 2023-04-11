import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { BaseFormComponent } from 'src/app/shared/base-form.component';
import { parseCurrencyToNumber } from 'src/app/shared/helper/passing-current';
import { NotificationsService } from 'src/app/shared/notifications.service';
import { StorageService } from 'src/app/shared/storage.service';
import { CashierService } from '../cashier.service';

@Component({
  selector: 'app-open-cashier',
  templateUrl: './open-cashier.component.html',
  styleUrls: ['./open-cashier.component.scss'],
})
export class OpenCashierComponent extends BaseFormComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private cashierService: CashierService,
    private notifications: NotificationsService,
    private modalController: ModalController,
    private storageService: StorageService
  ) {
    super();
  }

  ngOnInit() {
    this.initForm();
  }
  initForm() {
    this.formulario = this.formBuilder.group({
      date: [new Date(), Validators.required],
      initial: [null, Validators.required],
      unit: [null, Validators.required],
      employee: [null, Validators.required],
    });
    this.setUnitEmployee();
  }

  async setUnitEmployee() {
    const unit = await this.storageService.getUnitLogged();
    const employee = await this.storageService.getUser();
    this.formulario.patchValue({
      unit,
      employee: employee.name,
    });
  }
  async submit() {
    const values = this.formulario.value;
    values.initial = parseCurrencyToNumber(values.initial);
    values.date = new Date();
    this.cashierService.openCashier(values).subscribe(() => {
      this.notifications.presentToast(
        'Caixa aberto com sucesso',
        'top',
        'success'
      );
      this.storageService.setOpenCashier(values);

      this.onDismissis(true);
    });
  }
  onDismissis(opened?: boolean) {
    this.modalController.dismiss(opened);
  }
}
