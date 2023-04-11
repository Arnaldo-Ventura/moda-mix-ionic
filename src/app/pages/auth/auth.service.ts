import { DefinePassword } from './models/define-password';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthCredentials } from './models/auth-credentials';
import { take, tap } from 'rxjs/operators';
import { AuthResponse } from './models/authResponse';
import { Observable } from 'rxjs';
import { StorageService } from 'src/app/shared/storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private api = environment.api_url;

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {}

  login(credentials: AuthCredentials): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.api}auth/login`, credentials)
      .pipe(
        tap((data) => {
          this.storageService.setStorage(data);
        }),
        take(1)
      );
  }
  definePassword(definePassWord: DefinePassword): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.api}auth/recovery/password`, definePassWord)
      .pipe(
        tap((data) => {
          this.storageService.setStorage(data);
        }),
        take(1)
      );
  }
}
