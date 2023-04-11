import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Settings, ConfigMail, SettingsMail } from './model/settings';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private api = `${environment.api_url}/settings`;

  constructor(private http: HttpClient) {}

  getSettings() {
    return this.http.get<Settings[]>(`${this.api}`).pipe(take(1));
  }

  renameCreditCardProduct(_id: string, rename: { name: string }) {
    return this.http
      .put(`${this.api}/credit-card-product-name/${_id}`, rename)
      .pipe(take(1));
  }
  renameCreditCardAntProduct(_id: string, rename: { name: string }) {
    return this.http
      .put(`${this.api}/credit-card-ant-product-name/${_id}`, rename)
      .pipe(take(1));
  }
  renameDebitCardProduct(_id: string, rename: { name: string }) {
    return this.http
      .put(`${this.api}/debit-card-product-name/${_id}`, rename)
      .pipe(take(1));
  }
  configMail(_id: string, mail: SettingsMail) {
    return this.http.put(`${this.api}/mail/${_id}`, { mail }).pipe(take(1));
  }
}
