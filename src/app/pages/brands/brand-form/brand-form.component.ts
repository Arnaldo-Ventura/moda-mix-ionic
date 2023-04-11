/* eslint-disable no-underscore-dangle */
import { Component, OnInit } from '@angular/core';
import { BaseFormComponent } from 'src/app/shared/base-form.component';
import { FormBuilder, Validators } from '@angular/forms';
import { NotificationsService } from 'src/app/shared/notifications.service';
import { BrandsService } from '../brand.service';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-brand-form',
  templateUrl: './brand-form.component.html',
  styleUrls: ['./brand-form.component.scss'],
})
export class BrandFormComponent extends BaseFormComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private brandService: BrandsService,
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
        this.brandById(data.id);
      }
    });
  }
  initForm() {
    this.formulario = this.formBuilder.group({
      _id: [null],
      name: [null, Validators.required],
      active: [true],
    });
  }
  async submit() {
    if (this.formulario.value._id) {
      this.update();
    } else {
      this.save();
    }
  }

  async save() {
    const confirm = await this.notifications.presentAlert(
      'Tem certeza que quer salvar essa marca?'
    );
    if (confirm) {
      this.notifications.showLoading();
      this.brandService.save(this.formulario.value).subscribe(() => {
        this.notifications.dismisseLoading();
        this.notifications.presentToast('Marca cadastrada com sucesso');
        this.initForm();
      });
    }
  }
  async update() {
    const confirm = await this.notifications.presentAlert(
      'Tem certeza que quer editar essa marca?'
    );
    if (confirm) {
      this.notifications.showLoading();
      this.brandService
        .edit(this.formulario.value._id, this.formulario.value)
        .subscribe(() => {
          this.notifications.dismisseLoading();
          this.notifications.presentToast('Marca editada com sucesso');
          this.navController.back();
        });
    }
  }
  brandById(id: string) {
    this.brandService.getById(id).subscribe((data) => {
      this.formulario.patchValue(data);
    });
  }
}
