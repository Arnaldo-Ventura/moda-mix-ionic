import { Permission } from '../../permissions/models/permissions';
import { Unit } from 'src/app/shared/models/unit';

export class RolesResponse {
  per: Permission;
  _id: string;
  name: string;
  units: Unit[];
}
