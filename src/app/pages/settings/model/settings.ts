export class Settings {
  _id?: string;
  card: {
    creditCardProd: CardProd;
    debitCardProd: CardProd;
    creditCardAntProd: CardProd;
  };
  mail: SettingsMail;
}

export class CardProd {
  name: string;
  clas: string;
  account: string;
}

export class SettingsMail {
  address: Address;
  configMail: ConfigMail;
}

export class Address {
  email: string;
  name: string;
}

export class ConfigMail {
  host: string;
  port: number;
  secure: boolean;
  auth: AuthMail;
}

export class AuthMail {
  user: string;
  pass: string;
}
