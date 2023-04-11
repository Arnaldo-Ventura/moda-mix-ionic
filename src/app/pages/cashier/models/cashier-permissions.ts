import { EPermissionTypeCashier } from 'src/app/shared/enums/permission-type';

export type CashierPermissions = {
  [value in EPermissionTypeCashier]?: boolean;
};
