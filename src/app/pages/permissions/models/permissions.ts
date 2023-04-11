import { EPermission } from 'src/app/shared/enums/permission';
import { EPermissionType } from 'src/app/shared/enums/permission-type';

export type Permission = {
  _id: string;
  name: string;
  permissions: Permissions;
};

export type Permissions = {
  [key in EPermission]: PermissionsType;
};

export type PermissionsType = {
  [key in EPermissionType]: boolean;
};
