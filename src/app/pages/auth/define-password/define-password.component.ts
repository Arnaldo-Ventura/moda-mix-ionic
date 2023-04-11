import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BaseFormComponent } from 'src/app/shared/base-form.component';
import { NotificationsService } from 'src/app/shared/notifications.service';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-define-password',
  templateUrl: './define-password.component.html',
  styleUrls: ['./define-password.component.scss'],
})
export class DefinePasswordComponent
  extends BaseFormComponent
  implements OnInit
{
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private notifications: NotificationsService,
    private activeRoute: ActivatedRoute,
    private navController: NavController
  ) {
    super();
  }

  ngOnInit() {
    this.initForm();

    this.activeRoute.params.pipe(take(1)).subscribe((data) => {
      if (data.token) {
        this.formulario.patchValue({ token: data.token });
      }
    });
  }

  initForm() {
    this.formulario = this.formBuilder.group({
      token: [null],
      password: [null, Validators.required],
      confirmPassword: [null, Validators.required],
    });
  }

  async submit() {
    const confirm = await this.notifications.presentAlert(
      'Confirma esse cadastro?'
    );
    if (confirm) {
      this.notifications.showLoading();
      this.authService.definePassword(this.formulario.value).subscribe(() => {
        this.notifications.dismisseLoading();
        this.initForm();
        this.notifications.presentToast('Cadastrado com sucesso');
      });
    }
  }

  back() {
    this.navController.navigateRoot(['']);
  }
}
