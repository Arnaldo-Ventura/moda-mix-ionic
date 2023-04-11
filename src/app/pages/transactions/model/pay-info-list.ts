import { NameId } from 'src/app/shared/models/name-id';
import { PayMethodEnum } from '../../../shared/enums/pay-method.enum';

export type PayInfoList = {
  method: PayMethodEnum;
  amount: number;
  cash?: number;
  change?: number;
  infoCard?: CardInfoDto;
};

export type CardInfoDto = {
  card: NameId;
  operator: NameId;
  installs?: number;
};
