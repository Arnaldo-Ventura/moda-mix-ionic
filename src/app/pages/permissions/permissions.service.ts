import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/shared/base-service';
import { Permission } from './models/permissions';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService extends BaseService<Permission>{

  constructor(protected http: HttpClient) {
    super(
      http,
      'permissions'
    )
  }
}
