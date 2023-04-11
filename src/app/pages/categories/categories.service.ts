import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/shared/base-service';
import { HttpClient } from '@angular/common/http';
import { Category } from './models/category';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService extends BaseService<Category> {

  constructor(protected http: HttpClient) {
    super(
      http,
      'categories'
    )
  }

  getCategoriesHome(){
    return this.http.get<Category[]>(`${this.api}categories/home`).pipe(take(1))     
  }
}
