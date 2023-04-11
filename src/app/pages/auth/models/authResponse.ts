import { RolesResponse } from './roles-response';

export class AuthResponse {
  token: string;
  roles: RolesResponse;
}
