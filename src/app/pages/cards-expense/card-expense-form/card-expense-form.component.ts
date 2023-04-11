/* eslint-disable no-underscore-dangle */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { take } from 'rxjs/operators';
import { BaseFormComponent } from 'src/app/shared/base-form.component';
import { NotificationsService } from 'src/app/shared/notifications.service';
import { CardsExpenseService } from '../cards-expense.service';

@Component({
  selector: 'app-card-expense-form',
  templateUrl: './card-expense-form.component.html',
  styleUrls: ['./card-expense-form.component.scss'],
})
export class CardExpenseFormComponent
  extends BaseFormComponent
  implements OnInit
{
  dueDays: number[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private cardService: CardsExpenseService,
    private notifications: NotificationsService,
    private activeRoute: ActivatedRoute,
    private navController: NavController
  ) {
    super();
  }

  ngOnInit() {
    this.initDaysOfMouth();
    this.initForm();

    this.activeRoute.params.pipe(take(1)).subscribe((data) => {
      if (data.id) {
        this.cardById(data.id);
      }
    });
  }
  initDaysOfMouth() {
    for (let i = 1; i < 32; i++) {
      this.dueDays.push(i);
    }
  }
  initForm() {
    this.formulario = this.formBuilder.group({
      _id: [null],
      name: [null, [Validators.required, Validators.minLength(3)]],
      dueDate: [null, Validators.required],
      active: [true],
      invoiceClosing: [null, Validators.required],
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
      this.notifications.showLoading();
      this.cardService.save(this.formulario.value).subscribe((data) => {
        this.notifications.dismisseLoading();
        this.notifications.presentToast('Cartão cadastrado com sucesso');
        this.formulario.reset();
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
          this.notifications.presentToast('Cartão editado com sucesso');
          this.navController.back();
        });
    }
  }

  cardById(id: string) {
    this.cardService.getById(id).subscribe((data) => {
      this.formulario.patchValue(data);
    });
  }

  back() {
    this.navController.back();
  }
}
