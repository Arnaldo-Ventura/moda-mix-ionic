import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Classification } from './models/classification';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClassificationsService {

  api = environment.api_url

  constructor(
    protected http: HttpClient) { }

  getAll(params?: HttpParams): Observable<Classification[]> {
    return this.http.get<Classification[]>(`${this.api}classifications`, { params }).pipe(take(1))
  }
}
