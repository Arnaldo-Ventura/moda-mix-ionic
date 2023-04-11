/* eslint-disable @typescript-eslint/naming-convention */
export enum EPermissionType {
  CREATE = 'c',
  READ = 'r',
  UPDATE = 'u',
  DELETE = 'd',
}

export enum EPermissionTypeCashier {
  READ = 'r',
  DELETE = 'd',
  DETAIL = 'detail',
  FILTER = 'filter',
  FILTER_BY_DATE = 'filterByDate',
  FILTER_BY_EMPLOYEE = 'filterByEmployee',
  FILTER_BY_TYPE = 'filterByType',
  FILTER_BY_METHOD = 'filterByMethod',
  FILTER_BY_UNIT = 'filterByUnit',
  CREATE_INCOME = 'createIncome',
  CREATE_EXPENSE = 'createExpense',
}
