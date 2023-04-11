import { OpenCashier } from './models/open-cashier';
import { Transaction } from './../transactions/model/transaction';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Cashier } from './models/cashier';
import { take } from 'rxjs/operators';
import { CloseCashier } from './models/close-cashier';

@Injectable({
  providedIn: 'root',
})
export class CashierService {
  private api = `${environment.api_url}cashier`;

  constructor(private http: HttpClient) {}

  getCashierIsOpen(unit: string) {
    return this.http
      .get<OpenCashier[]>(`${this.api}/is-open/${unit}`)
      .pipe(take(1));
  }
  openCashier(openCashier: OpenCashier) {
    return this.http.post(`${this.api}/open/`, openCashier).pipe(take(1));
  }
  closeCashier(closeCashier: CloseCashier) {
    console.log({ closeCashier });
    return this.http.post(`${this.api}/close/`, closeCashier).pipe(take(1));
  }
  getCashierOpened(unit: string) {
    return this.http.get<Cashier[]>(`${this.api}/opened/${unit}`).pipe(take(1));
  }
  getCashierByDate(from: Date, to: Date) {
    return this.http.get<Cashier[]>(`${this.api}/${from}/${to}`).pipe(take(1));
  }

  cashierCreateExpense(transaction: Transaction) {
    return this.http.post(`${this.api}/expense`, transaction).pipe(take(1));
  }
}
