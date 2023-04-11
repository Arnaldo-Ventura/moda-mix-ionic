import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/shared/base-service';
import { Supplier } from './models/supplier';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SuppliersService extends BaseService<Supplier> {
  constructor(protected http: HttpClient) {
    super(http, 'suppliers');
  }
}
