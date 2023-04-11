import { TypeEnum } from 'src/app/shared/enums/type.enum';

export class Product {
  _id: string;
  name: string;
  img: string[];
  imgSlide: string;
  expenseInfo: IncomeExpenseInfo[];
  incomeInfo: IncomeExpenseInfo[];
  clas: string;
  account: string;
  cat: string[];
  brand: string;
  likes: string[];
  stok: number;
  price: any;
  type: TypeEnum;
  active: boolean;
  info: string;
}

export class IncomeExpenseInfo {
  clas: string;
  account: string;
}
