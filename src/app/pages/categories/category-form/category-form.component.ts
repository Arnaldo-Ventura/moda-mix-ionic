/* eslint-disable no-underscore-dangle */
import { Component, OnInit } from '@angular/core';
import { BaseFormComponent } from 'src/app/shared/base-form.component';
import { FormBuilder, Validators } from '@angular/forms';
import { CategoriesService } from '../categories.service';
import { NotificationsService } from 'src/app/shared/notifications.service';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss'],
})
export class CategoryFormComponent extends BaseFormComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private categoryService: CategoriesService,
    private notifications: NotificationsService,
    private activeRoute: ActivatedRoute,
    private router: Router
  ) {
    super();
  }

  ngOnInit() {
    this.initForm();

    this.activeRoute.params.pipe(take(1)).subscribe((data) => {
      if (data.id) {
        this.categoryById(data.id);
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
      'Tem certeza que quer salvar essa categoria?'
    );
    if (confirm) {
      this.notifications.showLoading();
      this.categoryService.save(this.formulario.value).subscribe(() => {
        this.notifications.dismisseLoading();
        this.notifications.presentToast('Categoria cadastrada com sucesso');
        this.initForm();
      });
    }
  }
  async update() {
    const confirm = await this.notifications.presentAlert(
      'Tem certeza que quer editar essa categoria?'
    );
    if (confirm) {
      this.notifications.showLoading();
      this.categoryService
        .edit(this.formulario.value._id, this.formulario.value)
        .subscribe(() => {
          this.notifications.dismisseLoading();
          this.notifications.presentToast('Categoria editada com sucesso');
          this.router.navigate(['/admin/categorias']);
        });
    }
  }
  categoryById(id: string) {
    this.categoryService.getById(id).subscribe((data) => {
      this.formulario.patchValue(data);
    });
  }
}
