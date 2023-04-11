import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from 'src/app/shared/base-service';
import { Card } from './models/card';
import { environment } from 'src/environments/environment';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CardsService extends BaseService<Card> {
  api = environment.api_url;
  endPoit = 'cards';
  constructor(protected http: HttpClient) {
    super(http, 'cards');
  }
  saveImage(_id: string, formData: FormData) {
    return this.http
      .put<Card>(`${this.api}${this.endPoit}/image/add/${_id}`, formData)
      .pipe(take(1));
  }
  deleteImage(_id: string) {
    return this.http
      .delete(`${this.api}${this.endPoit}/image/delete/${_id}`)
      .pipe(take(1));
  }
}
