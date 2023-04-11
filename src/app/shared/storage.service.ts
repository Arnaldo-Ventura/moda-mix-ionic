import { OpenCashier } from './../pages/cashier/models/open-cashier';
/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { AuthResponse } from '../pages/auth/models/authResponse';
import { RolesResponse } from '../pages/auth/models/roles-response';
import { DataRoute } from './models/data-route';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private _storage: Storage | null = null;
  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  setStorage(authResponse: AuthResponse) {
    this.storage.set('token', authResponse.token);
    this.storage.set('roles', btoa(JSON.stringify(authResponse.roles)));
  }

  async getPermissions(dataRoute?: DataRoute) {
    const roles = await this.getRoles();
    if (dataRoute) {
      const { rote, operation } = dataRoute;
      return roles.per[rote] ? roles.per[rote][operation] : false;
    }
    return roles.per;
  }

  async getUserId(): Promise<string> {
    const roles = await this.getRoles();
    if (roles && roles._id) {
      return roles._id;
    }
    return null;
  }

  async getUser(): Promise<{ _id: string; name: string }> {
    const roles = await this.getRoles();
    if (roles && roles._id && roles.name) {
      return { _id: roles._id, name: roles.name };
    }
    return null;
  }

  async getToken() {
    return await this.storage.get('token');
  }

  async logout() {
    await this.storage.clear();
  }

  async setUnitLogged(unit: string) {
    await this.storage.set('unitLoggerd', btoa(unit));
  }

  async setOpenCashier(openCashier: OpenCashier) {
    await this.storage.set('openCashier', btoa(JSON.stringify(openCashier)));
  }

  async removeOpenCashier() {
    await this.storage.remove('openCashier');
  }

  async getOpenCashier(): Promise<OpenCashier> {
    const openCashierInB64 = await this.storage.get('openCashier');
    return openCashierInB64 ? JSON.parse(atob(openCashierInB64)) : null;
  }

  async getUnitLogged(): Promise<string> {
    const unitB64 = await this.storage.get('unitLoggerd');
    return atob(unitB64);
  }
  private async getRoles(): Promise<RolesResponse> {
    const b64 = await this.storage.get('roles');
    if (b64) {
      const roles = atob(b64);
      return JSON.parse(roles);
    }
    return null;
  }
}
