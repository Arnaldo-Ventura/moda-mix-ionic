import { HttpClient } from '@angular/common/http';
import { BaseService } from 'src/app/shared/base-service';
import { Injectable } from '@angular/core';
import { Operator } from './model/operator';

@Injectable({
  providedIn: 'root',
})
export class OperatorsService extends BaseService<Operator> {
  constructor(protected http: HttpClient) {
    super(http, 'operators');
  }
}
