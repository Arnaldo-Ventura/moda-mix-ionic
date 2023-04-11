/* eslint-disable no-underscore-dangle */
import { EChannel } from './../../../shared/enums/show';
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { ModalController, NavController } from '@ionic/angular';
import { BaseFormComponent } from 'src/app/shared/base-form.component';
import { typeList } from 'src/app/shared/enums/type.enum';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { ClassificationsService } from 'src/app/shared/classifications.service';
import { BrandsService } from '../../brands/brand.service';
import { AccountsService } from '../../accounts/accounts.service';
import { CategoriesService } from '../../categories/categories.service';
import { ProductsService } from '../products.service';
import { Account } from '../../accounts/models/account';
import { Classification } from 'src/app/shared/models/classification';
import { Category } from '../../categories/models/category';
import { Brand } from '../../brands/models/brand';
import { NotificationsService } from 'src/app/shared/notifications.service';
import { Product } from '../models/product';
import { parseStringToNumber } from 'src/app/shared/helper/passing-current';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
})
export class ProductFormComponent extends BaseFormComponent implements OnInit {
  @Input() readonly isModal: boolean = false;
  typeList = typeList();
  idToEdit = null;
  accountList: Account[];
  classificationList: Classification[] = [];
  categoryList: Category[];
  brandList: Brand[];

  constructor(
    private modalController: ModalController,
    private navController: NavController,
    private formBuilder: FormBuilder,
    private activeRoute: ActivatedRoute,
    private classificationService: ClassificationsService,
    private brandService: BrandsService,
    private accountService: AccountsService,
    private categoriesService: CategoriesService,
    private productService: ProductsService,
    private notifications: NotificationsService
  ) {
    super();
  }

  ngOnInit() {
    this.initForm();
    this.initEditForm();
    this.loadCategories();
    this.loadBrands();
    this.loadClassification();
    this.loadAccount();
  }

  initForm() {
    this.formulario = this.formBuilder.group({
      _id: [null],
      type: [[]],
      cat: [null],
      brand: [null],
      name: [null, [Validators.required, Validators.minLength(3)]],
      expenseInfo: this.formBuilder.array([]),
      incomeInfo: this.formBuilder.array([]),
      barCode: [null, Validators.required],
      price: [null],
      img: [null],
      active: [true],
      show: [[EChannel.pos]],
    });
    this.addExpenseInfo();
    this.addIncomeInfo();
  }
  get expenseInfo() {
    return this.formulario.controls.expenseInfo as FormArray;
  }
  get incomeInfo() {
    return this.formulario.controls.incomeInfo as FormArray;
  }

  addExpenseInfo() {
    const expenseInfo = this.formBuilder.group({
      clas: [''],
      account: [''],
    });
    this.expenseInfo.push(expenseInfo);
  }
  addIncomeInfo() {
    const incomeInfo = this.formBuilder.group({
      clas: [''],
      account: [''],
    });
    this.incomeInfo.push(incomeInfo);
  }
  initEditForm() {
    this.activeRoute.params.pipe(take(1)).subscribe((data) => {
      if (data.id) {
        this.productById(data.id);
      }
    });
  }

  loadCategories() {
    this.categoriesService
      .getAll()
      .subscribe((data) => (this.categoryList = data));
  }

  loadBrands() {
    this.brandService.getAll().subscribe((data) => (this.brandList = data));
  }

  loadClassification() {
    this.classificationService
      .getAll()
      .subscribe((data) => (this.classificationList = data));
  }

  loadAccount() {
    this.accountService.getAll().subscribe((data) => (this.accountList = data));
  }

  productById(id: string) {
    setTimeout(() => {
      this.productService.getById(id).subscribe((data) => {
        this.formulario.patchValue(data);
        console.log('fomulario', this.formulario.value);
      });
    }, 3000);
  }
  showButtonAddExpense(i: number) {
    return this.expenseInfo.length === i + 1 ? true : false;
  }
  showButtonRemoveExpense(i: number) {
    return this.expenseInfo.length !== i + 1 ? true : false;
  }
  removeExpenseInfo(i: number) {
    this.expenseInfo.removeAt(i);
  }
  filterClassification(type) {
    return this.classificationList.filter((x) => x.type.includes(type));
  }
  filterAccount(type) {
    return this.accountList.filter((x) => x.type.includes(type));
  }
  submit() {
    if (this.formulario.value._id) {
      this.editProduct();
    } else {
      this.saveProduct();
    }
  }

  async editProduct() {
    const confirm = await this.notifications.presentAlert(
      'Tem certeza que quer editar esse produto?'
    );
    if (confirm) {
      this.notifications.showLoading();
      const _id = this.formulario.value._id;
      this.productService.edit(_id, this.formulario.value).subscribe(() => {
        this.notifications.dismisseLoading();
        this.notifications.presentToast('Produto editado com sucesso');
        this.navController.back();
      });
    }
  }

  async saveProduct() {
    const confirm = await this.notifications.presentAlert(
      'Tem certeza que quer salvar esse produto?'
    );
    if (confirm) {
      this.notifications.showLoading();
      const values = this.formulario.value;
      values.price = parseStringToNumber(values.price);
      values.expenseInfo = values.expenseInfo.filter(
        (expense) => expense.account && expense.clas
      );
      values.incomeInfo = values.incomeInfo.filter(
        (expense) => expense.account && expense.clas
      );
      this.productService.save(values).subscribe(
        () => {
          this.notifications.dismisseLoading();
          this.notifications.presentToast('Produto cadastrado com sucesso');
          this.onDismiss();
          this.initForm();
        },
        (e) => {
          console.log(e);
          this.notifications.dismisseLoading();
          this.notifications.presentToast('Ocorreu um erro, tente novamente');
        }
      );
    }
  }
  onDismiss() {
    if (this.isModal) {
      this.modalController.dismiss();
    }
  }

  back() {
    this.navController.back();
  }

  /*  @Input() readonly isModal: boolean = false;
  @ViewChild('slides', { static: true }) slides: IonSlides;
  slideOpts = {
    spaceBetween: 10,
    autoplay: true,
    speed: 1000,
    slidesPerView: 1.5,
    centeredSlides: true,
  };
  idToEdit = null;
  uriImage = '../../../../assets/images/no_image.png';
  productImages: string[] = [];
  accountList: Account[];
  classificationList: Classification[] = [];
  categoryList: Category[];
  brandList: Brand[];
  priceCurrencyFormated: string;
  likes: number = null;

  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private brandService: BrandsService,
    private accountsService: AccountsService,
    private categoriesService: CategoriesService,
    private productService: ProductsService,
    private notifications: NotificationsService,
    private activeRoute: ActivatedRoute,
    private navController: NavController,
    private unitService: UnitsService
  ) {
    super();
  }

  ngOnInit() {
    this.formulario = this.formBuilder.group({
      _id: [null],
      clas: [null, Validators.required],
      subClas: [null, Validators.required],
      cat: [null, Validators.required],
      brand: [null],
      name: [null, Validators.required],
      price: [null, Validators.required],
      type: [TypeEnum.INCOME],
      active: [true],
      show: [true],
      likes: [null],
      desc: [null],
      stok: [null],
    });

    this.activeRoute.params.pipe(take(1)).subscribe((data) => {
      if (data.id) {
        this.idToEdit = data.id;
        this.loadSubClassifications();
      } else {
        this.loadSubClassifications();
        this.loadCategories();
        this.loadBrands();
      }
    });
  }

  loadSubClassifications() {
    const params: Parametro = {
      expended: 'classifications,clas,_id,clas',
      unwind: 'clas',
      sort: 'name',
      fields: 'name,clas.name,clas._id',
      refilter: 'clas.name:Receitas',
    };

    this.accountsService.getAll(newParams(params)).subscribe((data) => {
      console.log(data);
      //  this.classificationList = [data[0].clas];
      this.formulario.patchValue({
        clas: this.classificationList[0],
      });
      this.accountList = data;
      if (this.idToEdit) {
        this.loadCategories();
      }
    });
  }

  loadCategories() {
    const params: Parametro = {
      sort: 'name',
      fields: 'name',
    };
    this.categoriesService.getAll(newParams(params)).subscribe((data) => {
      this.categoryList = data;
      if (this.idToEdit) {
        this.loadBrands();
      } else {
        this.formulario.patchValue({
          clas: this.classificationList[0],
        });
      }
    });
  }

  loadBrands() {
    const params: Parametro = {
      sort: 'name',
      fields: 'name',
    };
    this.brandService.getAll(newParams(params)).subscribe((data) => {
      this.brandList = data;
      if (this.idToEdit) {
        this.productById(this.idToEdit);
      }
    });
  }

  async presentModal(uriImage) {
    const modal = await this.modalController.create({
      component: CropImageComponent,
      cssClass: 'my-custom-modal-css',
      componentProps: {
        img: uriImage,
      },
    });

    modal.onDidDismiss().then((img) => {
      if (img.data) {
        this.blob(img.data);
      }
    });
    return await modal.present();
  }

  async blob(b64) {
    const response = await fetch(b64);
    const blob = await response.blob();
    const f = new File([blob], new Date().getTime() + '.jpeg', {
      type: 'image/jpeg',
      lastModified: new Date().getTime(),
    });
    this.saveProductImage(f);
  }

  showImage(imag) {
    imag.click();
  }

  async onFileChange(event) {
    if (event.target.files && event.target.files.length) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      // eslint-disable-next-line @typescript-eslint/no-shadow
      reader.onload = async (event) => {
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        await this.presentModal((<FileReader>event.target).result);
      };
    }
  }

  activeChange() {
    setTimeout(() => {
      if (!this.formulario.value.active) {
        this.likes = null;
        this.formulario.patchValue({
          likes: null,
        });
        if (this.formulario.value.show) {
          this.formulario.patchValue({
            show: false,
          });
        }
      }
    }, 300);
  }

  showChange() {
    setTimeout(() => {
      if (this.formulario.value.show) {
        if (!this.formulario.value.active) {
          this.formulario.patchValue({
            active: true,
          });
        }
      } else {
        this.likes = null;
        this.formulario.patchValue({
          likes: null,
        });
      }
    }, 300);
  }

  inputLikes(event) {
    const likes = [];
    for (let i = 0; i < event.target.value; i++) {
      likes.push((i + 1).toString());
    }
    console.log(likes);
    this.formulario.patchValue({
      likes,
    });
  }

  async submit() {
    this.priceCurrencyFormated = this.formulario.value.price;
    this.formulario.patchValue({
      price: +this.formulario.value.price.replace(/[.]/g, '').replace(',', '.'),
    });
    console.log(this.formulario.value);
    if (this.formulario.value._id) {
      const confirm = await this.notifications.presentAlert(
        'Tem certeza que quer editar esse produto?'
      );
      if (confirm) {
        this.notifications.showLoading();
        this.productService
          .edit(this.formulario.value._id, this.formulario.value)
          .subscribe(() => {
            this.setPriceFormatedCurrency(this.formulario.value._id);
            this.notifications.dismisseLoading();
            this.notifications.presentToast('Produto editado com sucesso');
            this.navController.back();
          });
      }
    } else {
      const confirm = await this.notifications.presentAlert(
        'Tem certeza que quer salvar esse produto?'
      );
      if (confirm) {
        this.notifications.showLoading();
        this.productService.save(this.formulario.value).subscribe(
          (data: Product) => {
            console.log(data);
            this.setPriceFormatedCurrency(data._id);
            this.notifications.dismisseLoading();
            this.notifications.presentToast('Produto cadastrado com sucesso');
            this.onDismiss();
          },
          (e) => {
            this.notifications.dismisseLoading();
            this.notifications.presentToast('Ocorreu um erro, tente novamente');
          }
        );
      }
    }
  }

  setPriceFormatedCurrency(id?: string) {
    this.formulario.patchValue({
      _id: id,
      price: this.priceCurrencyFormated,
    });
  }

  productById(id: string) {
    this.productService.getById(id).subscribe((data) => {
      if (data.price.toString().includes('.')) {
        data.price = data.price.toString().replace('.', ',');
      } else {
        data.price = `${data.price},00`;
      }
      this.productImages = data.img;
      this.formulario.patchValue(data);
    });
  }

  async deleteImage() {
    const confirm = await this.notifications.presentAlert(
      'Confirma a exclusão desta imagem?'
    );
    if (confirm) {
      this.notifications.showLoading();
      const indexSlide = await this.slides.getActiveIndex();
      const urlImag = this.productImages[indexSlide];

      this.productService
        .deleteImagen(this.formulario.value._id, urlImag)
        .subscribe(() => {
          this.productImages = this.productImages.filter((i) => i !== urlImag);
          this.productImages.slice(indexSlide, 1);
          this.notifications.dismisseLoading();
          this.slides.startAutoplay();
        });
    }
  }

  saveProductImage(file: File) {
    if (this.formulario.value._id) {
      this.notifications.showLoading();
      const fd = new FormData();
      fd.append('file', file, file.name);
      this.productService
        .updateImagens(this.formulario.value._id, fd)
        .subscribe((data) => {
          this.productImages.push(data.img);
          this.slides.startAutoplay();
          this.notifications.dismisseLoading();
        });
    }
  }

  onDismiss() {
    if (this.isModal) {
      this.modalController.dismiss();
    }
  }

  back() {
    this.navController.back();
  } */
}
