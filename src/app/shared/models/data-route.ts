import { EPermission } from '../enums/permission';
import {
  EPermissionType,
  EPermissionTypeCashier,
} from '../enums/permission-type';

export class DataRoute {
  constructor(
    public rote: EPermission,
    public operation: EPermissionType | EPermissionTypeCashier
  ) {}
}
