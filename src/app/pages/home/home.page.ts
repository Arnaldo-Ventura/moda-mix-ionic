import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../products/products.service';
import { Parametro } from 'src/app/shared/params/parametro';
import { newParams } from 'src/app/shared/params/new-params';
import { Router } from '@angular/router';
import { CategoriesService } from '../categories/categories.service';
import { Category } from '../categories/models/category';
import { Product } from '../products/models/product';
import { CartService } from '../cart/cart.service';
import { ModalController } from '@ionic/angular';
import { ProductDetailComponent } from '../products/product-detail/product-detail.component';
import { CartPage } from '../cart/cart.page';
import { StorageService } from 'src/app/shared/storage.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  idUserAuthenticated: string = null
  slideBannerOpts = {
    spaceBetween: 5,
    autoplay: true,
    speed: 1000,
    slidesPerView: 1.1,
    centeredSlides: true,
  }
  slideCategoriesOpts = {
    slidesPerView: 1.4,
  }
  cart: number
  bannersProducts = []
  categories: Category[] = []
  cards: Product[] = []

  constructor(
    private productService: ProductsService,
    private storageService: StorageService,
    private router: Router,
    private categoryService: CategoriesService,
    private cartService: CartService,
    private modalController: ModalController,

  ) { }

  ngOnInit() {

    //this.storageService.IsAuthenticated.pipe(
      switchMap(() => this.storageService.getUserId().then(userId => this.idUserAuthenticated = userId))
    ).subscribe()
    this.cartService.amoutProduts.subscribe(amout => this.cart = amout)
    this.loadProducts()
    this.loadcategories()
  }

  loadProducts() {
    this.productService.getProductsHome().subscribe((data: Product[]) => {
      this.bannersProducts = data.filter(x => x.imgSlide).map((x: Product) => ({ imgSlide: x.imgSlide, _id: x._id }))
      this.cards = data
    })
  }

  bannerClick(id) {
    this.productDetail(id)
  }

  categoryClick(id) {
    console.log(id)
  }

  loadcategories() {
    this.categoryService.getCategoriesHome().subscribe(data => {
      console.log(data)
      this.categories = data
    })
  }

  clickLike(id) {
    if (!this.idUserAuthenticated) {
      this.router.navigate(['/auth/login'])
    } else {
      this.productService.productLike(id, this.idUserAuthenticated).subscribe(() => {
        this.cards.map(x => {
          if (x._id == id) {
            x.likes.push(this.idUserAuthenticated)
          }
        })
      })
    }
  }

  clickDislike(id) {
    if (!this.idUserAuthenticated) {
      this.router.navigate(['/auth/login'])
    } else {
      this.productService.productDislike(id, this.idUserAuthenticated).subscribe(() => {
        this.cards.map(x => {
          if (x._id == id) {
            x.likes = x.likes.filter(x => x != this.idUserAuthenticated)
          }
        })
      })
    }
  }

  async productDetail(id: string) {
    const modal = await this.modalController.create({
      component: ProductDetailComponent,
      cssClass: 'my-custom-modal-css',
      componentProps: {
        productId: id
      }
    })
    return await modal.present()
  }

  async modalCart() {
    const modal = await this.modalController.create({
      component: CartPage,
      cssClass: 'my-custom-modal-css',
    })
    return await modal.present()
  }

  async logout() {
    const logout = await this.storageService.logout()
  }
}