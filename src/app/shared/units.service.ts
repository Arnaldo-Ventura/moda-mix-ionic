import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Unit } from './models/unit';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UnitsService {

  api = environment.api_url

  constructor(
    protected http: HttpClient) { }

  getAll(params?: HttpParams): Observable<Unit[]> {
    return this.http.get<Unit[]>(`${this.api}units`, { params }).pipe(take(1))
  }
}
