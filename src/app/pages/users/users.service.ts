import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/shared/base-service';
import { User } from './models/user';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UsersService extends BaseService<User> {
  constructor(protected http: HttpClient) {
    super(http, 'employees');
  }
}
