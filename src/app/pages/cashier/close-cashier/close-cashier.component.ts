import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { BaseFormComponent } from 'src/app/shared/base-form.component';
import { CurrencyService } from 'src/app/shared/currency.service';
import { parseCurrencyToNumber } from 'src/app/shared/helper/passing-current';
import { NotificationsService } from 'src/app/shared/notifications.service';
import { StorageService } from 'src/app/shared/storage.service';
import { CashierService } from '../cashier.service';

@Component({
  selector: 'app-close-cashier',
  templateUrl: './close-cashier.component.html',
  styleUrls: ['./close-cashier.component.scss'],
})
export class CloseCashierComponent extends BaseFormComponent implements OnInit {
  balance = 0;

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
      final: [null, Validators.required],
      unit: [null, Validators.required],
    });
    this.setUnit();
  }

  async setUnit() {
    const unit = await this.storageService.getUnitLogged();
    this.formulario.patchValue({
      unit,
    });
  }

  async inputFinal() {
    const finalValue = this.formulario.value.final;
    if (finalValue) {
      const { initial } = await this.storageService.getOpenCashier();
      const final = parseCurrencyToNumber(finalValue);
      this.balance = final - initial <= 0 ? 0 : final - initial;
    }
  }
  async submit() {
    const values = this.formulario.value;
    values.final = parseCurrencyToNumber(values.final);
    this.storageService.removeOpenCashier();
    this.cashierService.closeCashier(values).subscribe(() => {
      this.notifications.presentToast(
        'Caixa fechado com sucesso',
        'top',
        'success'
      );
    });
    this.onDismissis(true);
  }

  onDismissis(closed?: boolean) {
    this.modalController.dismiss(closed);
  }
}
