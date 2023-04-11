import { TypeEnum } from 'src/app/shared/enums/type.enum';
import { PayInfoDto } from './pay-info-dto';

export class Prod {
  constructor(
    public name: string,
    public price: number,
    public qty: number,
    public discount?: number,
    public brand?: string,
    public category?: string,
    public clas?: string,
    public account?: string
  ) {}
}
export type CardInfo = {
  operator: string;
  card: string;
};
export class Transaction {
  constructor(
    public prods: Prod[],
    public unit: string,
    public date: Date,
    public employee: string,
    public type: TypeEnum,
    public pays: PayInfoDto,
    public favored?: string
  ) {}
}
