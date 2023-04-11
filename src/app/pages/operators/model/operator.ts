export class Operator {
  _id: string;
  name: string;
  unit: string[];
  active: boolean;
  cards: Cards[];
}
export class Cards {
  card: OperatorCard;
  debit?: Operation;
  credit?: Operation;
}
export class OperatorCard {
  _id: string;
  name: string;
  img: string;
}
export class Operation {
  rate: number;
  expected: number;
  minValue?: number;
  ant?: Antecipation;
  roundFirstInt?: boolean;
}
export type Antecipation = {
  auto: boolean;
  expected: number;
  inst: number[];
};
