import { CurrencyPipe } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  constructor(private currencyPipe: CurrencyPipe) {}

  transformCurrency(value: number) {
    return this.currencyPipe.transform(value);
  }

  retransformCurrency(value: string | number) {
    const onlyNumbers = this.clearValue(value);
    const newValue = this.includeDecimal(onlyNumbers);
    return this.transformCurrency(newValue);
  }

  private clearValue(value: any) {
    if (!value) {
      return '000';
    }
    value = value.toString();
    let clearValue = '';
    for (const i of value) {
      if (!isNaN(i)) {
        clearValue = clearValue + i;
      }
    }
    return clearValue;
  }

  private includeDecimal(value: any) {
    const length = value.length;
    if (length === 1) {
      return +`0.0${value}`;
    }
    if (length === 2) {
      return +`0.${value}`;
    }
    let valueWithPoint = '';
    for (let i = 0; i < length; i++) {
      if (i === length - 2) {
        valueWithPoint = valueWithPoint + '.' + value[i];
      } else {
        valueWithPoint = valueWithPoint + value[i];
      }
    }
    return +valueWithPoint;
  }
}
