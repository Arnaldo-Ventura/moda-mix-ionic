/* eslint-disable no-underscore-dangle */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { take } from 'rxjs/operators';
import { BaseFormComponent } from 'src/app/shared/base-form.component';
import { NotificationsService } from 'src/app/shared/notifications.service';
import { CardsService } from '../cards.service';

@Component({
  selector: 'app-card-form',
  templateUrl: './card-form.component.html',
  styleUrls: ['./card-form.component.scss'],
})
export class CardFormComponent extends BaseFormComponent implements OnInit {
  noImage = '../../../../assets/images/no_image.png';

  constructor(
    private formBuilder: FormBuilder,
    private cardService: CardsService,
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
        this.cardById(data.id);
      }
    });
  }

  initForm() {
    this.formulario = this.formBuilder.group({
      _id: [null],
      name: [null, [Validators.required, Validators.minLength(3)]],
      img: [null],
      active: [true],
    });
  }

  async submit() {
    if (this.formulario.value._id) {
      this.edit();
    } else {
      this.save();
    }
  }

  async save() {
    const confirm = await this.notifications.presentAlert(
      'Tem certeza que quer salvar esse cartão?'
    );
    if (confirm) {
      const { _id, img, ...res } = this.formulario.value;
      this.notifications.showLoading();
      this.cardService.save(res).subscribe((data) => {
        this.notifications.dismisseLoading();
        this.notifications.presentToast('Cartão cadastrado com sucesso');
        this.formulario.patchValue(data);
      });
    }
  }

  async edit() {
    const confirm = await this.notifications.presentAlert(
      'Tem certeza que quer editar esse cartão?'
    );
    if (confirm) {
      this.notifications.showLoading();
      this.cardService
        .edit(this.formulario.value._id, this.formulario.value)
        .subscribe(() => {
          this.notifications.dismisseLoading();
          this.notifications.presentToast('Operadora editada com sucesso');
          this.navController.back();
        });
    }
  }

  cardById(id: string) {
    this.cardService.getById(id).subscribe((data) => {
      this.formulario.patchValue(data);
    });
  }

  showImage(imag) {
    imag.click();
  }

  async onFileChange(event) {
    const file = event.target.files;
    if (file && file.length > 0) {
      if (this.formulario.value.img) {
      }
      this.saveCardImage(file[0]);
    }
  }

  saveCardImage(file: File) {
    const { _id } = this.formulario.value;
    if (_id) {
      this.notifications.showLoading();
      const fd = new FormData();
      fd.append('image', file, file.name);
      this.cardService.saveImage(_id, fd).subscribe((data) => {
        this.notifications.dismisseLoading();
        setTimeout(() => {
          this.formulario.patchValue({
            img: data.img,
          });
        }, 1000);
      });
    }
  }

  async deleteImage() {
    const confirm = await this.notifications.presentAlert(
      'Confirma a exclusão desta imagem?'
    );
    if (confirm) {
      this.notifications.showLoading();
      this.cardService.deleteImage(this.formulario.value._id).subscribe(() => {
        this.formulario.patchValue({
          img: null,
        });
        this.notifications.dismisseLoading();
      });
    }
  }

  back() {
    this.navController.back();
  }
}
