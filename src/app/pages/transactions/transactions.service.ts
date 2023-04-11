import { ConfirmTransaction } from './model/confirm-transaction';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Transaction } from './model/transaction';

@Injectable({
  providedIn: 'root',
})
export class TransactionsService {
  private api = `${environment.api_url}/transactions`;

  constructor(private http: HttpClient) {}

  transactionIncomeCashier(transaction: Transaction) {
    return this.http
      .post(`${this.api}/cashier/income`, transaction)
      .pipe(take(1));
  }

  transactionExpectedPay(transaction: ConfirmTransaction) {
    return this.http
      .post(`${this.api}/expected-pay`, transaction)
      .pipe(take(1));
  }
}
