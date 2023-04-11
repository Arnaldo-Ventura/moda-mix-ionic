import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SuppliersService } from '../suppliers.service';
import { NotificationsService } from 'src/app/shared/notifications.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseFormComponent } from 'src/app/shared/base-form.component';
import { UserTypeEnum } from 'src/app/shared/enums/user-type.enum';
import { take } from 'rxjs/operators';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-supplier-form',
  templateUrl: './supplier-form.component.html',
  styleUrls: ['./supplier-form.component.scss'],
})
export class SupplierFormComponent extends BaseFormComponent implements OnInit {

  @Input() readonly isModal: boolean = false
  
  constructor(
    private formBuilder: FormBuilder,
    private suppliersService: SuppliersService,
    private notifications: NotificationsService,
    private activeRoute: ActivatedRoute,
    private router: Router,    
    public modalController: ModalController,
  ) {
    super()
  }

  ngOnInit() {
    this.initForm()
    
    this.activeRoute.params
      .pipe(
        take(1)
      ).subscribe(data => {
        if (data.id) {
          this.supplierById(data.id)
        }
      })
  }

  initForm() {
    this.formulario = this.formBuilder.group({
      _id: [null],
      name: [null, Validators.required],
      active: [true],
      type: [UserTypeEnum.SUPPLIER, Validators.required]
    })
  }

  async submit() {

    if (this.formulario.value._id) {
      const confirm = await this.notifications.presentAlert('Tem certeza que quer editar esse fornecedor?')
      if (confirm) {
        this.notifications.showLoading()
        this.suppliersService.edit(this.formulario.value._id, this.formulario.value).subscribe(() => {
          this.notifications.dismisseLoading()
          this.notifications.presentToast('Fornecedor editado com sucesso')
          this.router.navigate(['/admin/fornecedores'])
        })
      }
    } else {
      const confirm = await this.notifications.presentAlert('Tem certeza que quer salvar esse fornecedor?')
      if (confirm) {
        this.notifications.showLoading()
        this.suppliersService.save(this.formulario.value).subscribe(() => {
          this.initForm()
          this.notifications.dismisseLoading()
          this.notifications.presentToast('Fornecedor cadastrado com sucesso')
          this.onDismiss()
        })
      }
    }
  }

  supplierById(id: string) {
    this.suppliersService.getById(id).subscribe(data => {
      this.formulario.patchValue(data)
    })
  }

  onDismiss() {
    if (this.isModal) this.modalController.dismiss()
  }
}
