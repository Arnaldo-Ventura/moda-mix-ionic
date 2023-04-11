export enum PayMethodEnum {
  CREDITCARD = 'cc',
  DEBITCARD = 'dc',
  CASH = 'ca',
  PIX = 'px',
}

export enum PayCardMethodEnum {
  CREDITCARD = 'cc',
  DEBITCARD = 'dc',
}

export const payMethodList = () => [
  { value: 'cc', name: 'Crédito' },
  { value: 'dc', name: 'Débito' },
  { value: 'ca', name: 'Dinheiro' },
  { value: 'px', name: 'Pix' },
];

export const payCardMethodList = () => [
  { value: 'cc', name: 'Crédito' },
  { value: 'dc', name: 'Débito' },
];
