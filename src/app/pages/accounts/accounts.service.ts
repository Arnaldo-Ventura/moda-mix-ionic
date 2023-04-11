import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/shared/base-service';
import { HttpClient } from '@angular/common/http';
import { Account } from './models/account';

@Injectable({
  providedIn: 'root',
})
export class AccountsService extends BaseService<Account> {
  constructor(protected http: HttpClient) {
    super(http, 'accounts');
  }
}
