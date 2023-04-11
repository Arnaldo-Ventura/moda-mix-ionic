import { TypeEnum } from 'src/app/shared/enums/type.enum';

export class Account {
  _id: string;
  name: string;
  type: TypeEnum[];
  active: boolean;
}
