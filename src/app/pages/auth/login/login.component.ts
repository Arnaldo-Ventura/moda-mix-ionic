import { StorageService } from 'src/app/shared/storage.service';
import { newParams } from './../../../shared/params/new-params';
import { Parametro } from './../../../shared/params/parametro';
import { UnitsService } from './../../../shared/units.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { BaseFormComponent } from 'src/app/shared/base-form.component';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { NotificationsService } from 'src/app/shared/notifications.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent extends BaseFormComponent implements OnInit {
  units: string[] = [];
  showUnits: boolean;

  constructor(
    private unitService: UnitsService,
    private authService: AuthService,
    private formBuild: FormBuilder,
    private storageService: StorageService,
    private navController: NavController,
    private notificationsService: NotificationsService
  ) {
    super();
  }

  ngOnInit() {
    this.initForm();
    this.loadUnits();
  }
  initForm() {
    this.formulario = this.formBuild.group({
      unit: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required],
    });
  }
  loadUnits() {
    const params: Parametro = {
      filter: 'active:true',
      fields: 'name,-_id',
    };
    this.unitService.getAll(newParams(params)).subscribe((units) => {
      this.units = units.map((unit) => unit.name);
      if (this.units.length > 1) {
        this.showUnits = true;
      } else {
        this.formulario.patchValue({
          unit: this.units[0],
        });
      }
    });
  }
  submit() {
    this.notificationsService.showLoading();
    this.authService.login(this.formulario.value).subscribe(async () => {
      this.storageService.setUnitLogged(this.formulario.value.unit);
      this.notificationsService.dismisseLoading();
      this.navController.navigateRoot(['/admin/sistema']);
    });
  }
}
