import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/shared/base-service';
import { Product } from './models/product';
import { HttpClient, HttpParams } from '@angular/common/http';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProductsService extends BaseService<Product> {
  constructor(protected http: HttpClient) {
    super(http, 'products');
  }

  createProductExpense(product: Product) {
    return this.http.post(`${this.api}products/expense`, product).pipe(take(1));
  }

  editProductExpense(id: string, product: Product) {
    return this.http
      .put(`${this.api}products/expense/${id}`, product)
      .pipe(take(1));
  }

  deleteProductExpense(id: string) {
    return this.http.delete(`${this.api}products/expense/${id}`).pipe(take(1));
  }

  getAllProductsExpense(params?: HttpParams) {
    return this.http
      .get<Product[]>(`${this.api}products/expense`, { params })
      .pipe(take(1));
  }

  getByIdProductsExpense(id: string) {
    return this.http
      .get<Product>(`${this.api}products/expense/${id}`)
      .pipe(take(1));
  }

  updateImagens(id: string, image: FormData) {
    return this.http
      .put<{ img: string }>(`${this.api}products/sale/image/add/${id}`, image)
      .pipe(take(1));
  }

  deleteImagen(id, img) {
    return this.http
      .put(`${this.api}products/sale/image/delete/${id}`, { img })
      .pipe(take(1));
  }

  updateImageSlide(id: string, image: FormData) {
    return this.http
      .put<{ imgSlide: string }>(`${this.api}products/sale/slide/${id}`, image)
      .pipe(take(1));
  }

  deleteImageSlide(id, img) {
    return this.http
      .put(`${this.api}products/sale/slide/delete/${id}`, { img })
      .pipe(take(1));
  }

  getProductsHome() {
    return this.http.get<Product[]>(`${this.api}products/home`).pipe(take(1));
  }

  getProductsHomeById(id: string) {
    return this.http
      .get<Product>(`${this.api}products/home/${id}`)
      .pipe(take(1));
  }

  productLike(productId: string, userId: string) {
    return this.http
      .put(`${this.api}products/like/${productId}`, { _id: userId })
      .pipe(take(1));
  }

  productDislike(productId: string, userId: string) {
    return this.http
      .put(`${this.api}products/dislike/${productId}`, { _id: userId })
      .pipe(take(1));
  }
}
