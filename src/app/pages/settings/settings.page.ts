import { NotificationsService } from './../../shared/notifications.service';
import { Settings, SettingsMail } from './model/settings';
import { BaseFormComponent } from 'src/app/shared/base-form.component';
import { SettingsService } from './settings.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage extends BaseFormComponent implements OnInit {
  settings: Settings;

  constructor(
    private formBuilder: FormBuilder,
    private settingsService: SettingsService,
    private notificationsService: NotificationsService
  ) {
    super();
  }

  ngOnInit() {
    this.initForm();
    this.loadSettings();
  }

  formBuildCardProd() {
    return this.formBuilder.group({
      name: [null, Validators.required],
      clas: [null, Validators.required],
      account: [null, Validators.required],
    });
  }
  initForm() {
    this.formulario = this.formBuilder.group({
      _id: [null],
      card: this.formBuilder.group({
        creditCardProd: this.formBuildCardProd(),
        debitCardProd: this.formBuildCardProd(),
        creditCardAntProd: this.formBuildCardProd(),
      }),
      mail: this.formBuilder.group({
        address: this.formBuilder.group({
          email: [null, Validators.required],
          name: [null, Validators.required],
        }),
        configMail: this.formBuilder.group({
          host: [null, Validators.required],
          port: [null, Validators.required],
          secure: [false, Validators.required],
          auth: this.formBuilder.group({
            user: [null, Validators.required],
            pass: [null, Validators.required],
          }),
        }),
      }),
    });
  }
  loadSettings() {
    this.settingsService.getSettings().subscribe(([settings]) => {
      this.settings = settings;
      this.formulario.patchValue(settings);
      console.log('formulário', this.formulario.value);
    });
  }
  prodCreditCardCancel() {
    this.formulario.patchValue({
      card: {
        creditCardProd: { name: this.settings.card.creditCardProd.name },
      },
    });
  }
  async prodCreditCardRename() {
    const confirm = await this.notificationsService.presentAlert(
      'Confirma a alteração?'
    );
    if (confirm) {
      this.notificationsService.showLoading();
      const {
        _id,
        card: { creditCardProd },
      } = this.formulario.value;
      this.settingsService
        .renameCreditCardProduct(_id, {
          name: creditCardProd.name,
        })
        .subscribe(() => {
          this.formulario.patchValue({
            card: {
              creditCardProd: { name: creditCardProd.name },
            },
          });
          this.settings.card.creditCardProd.name = creditCardProd.name;
          this.notificationsService.dismisseLoading();
          this.notificationsService.presentToast(
            'Cadastro alterado com sucesso!',
            'top'
          );
        });
    }
  }
  prodCreditCardAntecipationCancel() {
    this.formulario.patchValue({
      card: {
        creditCardAntProd: { name: this.settings.card.creditCardAntProd.name },
      },
    });
  }
  async prodCreditCardAntecipationRename() {
    const confirm = await this.notificationsService.presentAlert(
      'Confirma a alteração?'
    );
    if (confirm) {
      this.notificationsService.showLoading();
      const {
        _id,
        card: { creditCardAntProd },
      } = this.formulario.value;
      this.settingsService
        .renameCreditCardAntProduct(_id, {
          name: creditCardAntProd.name,
        })
        .subscribe(() => {
          this.formulario.patchValue({
            card: {
              creditCardAntProd: { name: creditCardAntProd.name },
            },
          });
          this.settings.card.creditCardAntProd.name = creditCardAntProd.name;
          this.notificationsService.dismisseLoading();
          this.notificationsService.presentToast(
            'Cadastro alterado com sucesso!',
            'top'
          );
        });
    }
  }
  prodDebitCardCancel() {
    this.formulario.patchValue({
      card: {
        debitCardProd: { name: this.settings.card.debitCardProd.name },
      },
    });
  }
  async prodDebitCardRename() {
    const confirm = await this.notificationsService.presentAlert(
      'Confirma a alteração?'
    );
    if (confirm) {
      this.notificationsService.showLoading();
      const {
        _id,
        card: { debitCardProd },
      } = this.formulario.value;
      this.settingsService
        .renameDebitCardProduct(_id, {
          name: debitCardProd.name,
        })
        .subscribe(() => {
          this.formulario.patchValue({
            card: {
              debitCardProd: { name: debitCardProd.name },
            },
          });
          this.settings.card.debitCardProd.name = debitCardProd.name;
          this.notificationsService.dismisseLoading();
          this.notificationsService.presentToast(
            'Cadastro alterado com sucesso!',
            'top'
          );
        });
    }
  }

  mailCancel() {
    this.formulario.patchValue(this.settings.mail);
  }

  async configMail() {
    const confirm = await this.notificationsService.presentAlert(
      'Confirma a alteração?'
    );
    if (confirm) {
      this.notificationsService.showLoading();
      const { _id, mail } = this.formulario.value;
      this.settingsService.configMail(_id, mail).subscribe(() => {
        this.settings.mail = mail;
        this.notificationsService.dismisseLoading();
        this.notificationsService.presentToast(
          'Cadastro alterado com sucesso!',
          'top'
        );
      });
    }
  }
  submit() {
    throw new Error('Method not implemented.');
  }
}
