import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { take } from 'rxjs/operators';
import { Observable } from 'rxjs';

export abstract class BaseService<T> {
  api = environment.api_url;

  constructor(protected http: HttpClient, private readonly endpoint: string) {}

  getAll(params?: HttpParams): Observable<T[]> {
    return this.http
      .get<T[]>(`${this.api}${this.endpoint}`, { params })
      .pipe(take(1));
  }

  getById(id: string) {
    return this.http.get<T>(`${this.api}${this.endpoint}/${id}`).pipe(take(1));
  }

  save(model: T) {
    return this.http.post(`${this.api}${this.endpoint}`, model).pipe(take(1));
  }

  edit(id: string, model: T | T[]) {
    return this.http
      .put(`${this.api}${this.endpoint}/${id}`, model)
      .pipe(take(1));
  }

  delete(id: string, params?) {
    return this.http
      .delete(`${this.api}${this.endpoint}/${id}`, { params })
      .pipe(take(1));
  }
}
