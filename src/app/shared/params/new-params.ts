import { Parametro } from './parametro';
import { HttpParams } from '@angular/common/http';

export const newParams = (parametro: Parametro) => {
  let params = new HttpParams();
  Object.entries(parametro).map((x) => {
    if (x[1]) {
      params = params.set(x[0], x[1]);
    }
  });
  return params;
};
