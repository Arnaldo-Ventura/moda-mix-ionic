import * as moment from 'moment';
moment.locale('pt-BR');

export const addMonthToDate = (date: Date, qtyMonth: number): Date =>
  moment(date).add(qtyMonth, 'month').startOf('day').toDate();

export const addDayToDate = (date: Date, qtyDay: number): Date =>
  moment(date).add(qtyDay, 'days').startOf('day').toDate();

export const compareDate = (date1: Date, date2: Date) =>
  moment(date1).isSame(date2);

export const difFDate = (date: Date) => moment().diff(date, 'day');

export const getHours = (date: Date) => moment(date).format('HH:mm');

export const formatDate = (date: Date) => moment(date).format('DD MMM YYYY');

export const startDay = (date: string) =>
  moment(date, 'DD MMM YYYY').startOf('day').toDate();

export const endDay = (date: string) =>
  moment(date, 'DD MMM YYYY').endOf('day').toDate();

export const formatDateToDateTime = (date: string) =>
  moment(new Date(date)).toISOString(true);

export const formatDateToSave = (date: string) => {
  const hours = moment().hour();
  const minutes = moment().minute();
  const seconds = moment().second();
  return moment(new Date(date)).set({ hours, minutes, seconds }).format();
};
