import { TypeEnum } from './../../../shared/enums/type.enum';

export class ConfirmTransaction {
  unit: string;
  type: TypeEnum;
  from: Date;
  to: Date;
}
