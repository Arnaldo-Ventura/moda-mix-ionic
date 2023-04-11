import { BaseService } from 'src/app/shared/base-service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CardExpense } from './models/card-expense';

@Injectable({
  providedIn: 'root',
})
export class CardsExpenseService extends BaseService<CardExpense> {
  api = environment.api_url;
  constructor(protected http: HttpClient) {
    super(http, 'cards/expense');
  }
}
