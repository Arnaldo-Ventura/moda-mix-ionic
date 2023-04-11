import { TypeEnum } from 'src/app/shared/enums/type.enum';
import { PayMethodEnum } from 'src/app/shared/enums/pay-method.enum';

export class Cashier {
  _id: string;
  amount: number;
  date: Date;
  hour: string;
  employee: string;
  favored: string;
  method: PayMethodEnum;
  type: TypeEnum;
  unit: string;
}
