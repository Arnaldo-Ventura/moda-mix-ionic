import { PayMethodEnum } from '../../../shared/enums/pay-method.enum';

export type PayInfoDto = {
  method: PayMethodEnum;
  amount: number;
  cash?: number;
  change?: number;
  installs: number;
  infoCard?: CardInfoDto;
};

export type CardInfoDto = {
  card: string;
  operator: string;
};
