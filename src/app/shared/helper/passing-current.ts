export const parseStringToNumber = (value: string): number =>
  +value.replace(/[.]/g, '').replace(',', '.');

export const parseCurrencyToNumber = (value: string): number => {
  value = value.replace('R$', '');
  return +value.replace(/[.]/g, '').replace(',', '.');
};

export const parsePercentToNumber = (value: string): number => {
  value = value.replace('%', '');
  const percent = +value.replace(/[.]/g, '').replace(',', '.');
  return percent / 100;
};
