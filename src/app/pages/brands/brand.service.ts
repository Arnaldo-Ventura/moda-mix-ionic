import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from 'src/app/shared/base-service';
import { Brand } from './models/brand';

@Injectable({
  providedIn: 'root'
})
export class BrandsService extends BaseService<Brand> {

  constructor(protected http: HttpClient) {
    super(
      http,
      'brands'
    )
  }
}