import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/shared/base-service';
import { Customer } from './models/customer';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CustomersService extends BaseService<Customer> {

  constructor(
    protected http: HttpClient,

  ) {
    super(
      http,
      'customers'
    )
   }
}
