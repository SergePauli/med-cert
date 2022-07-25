export interface IObjectKeys {
  [key: string]: string | number | undefined
}
export const HOME_ROUTE = "/"
export const LOGIN_ROUTE = "/login"
export const REGISTRATION_ROUTE = "/registration"
export const PWD_RECOVERY_ROUTE = "/pass_renew"
export const MESSAGE_ROUTE = "/message"
export const ERROR_ROUTE = "/error"
export const ADMIN_ROUTE = "/admin"
export const LIST_ROUTE = "/list"
export const CERTIFICATE_ROUTE = "/cert"
export const REPORT_ROUTE = "/report"
export const DOCTORS_ROUTE = "/doctors"
export const USER_ROUTE = "/user"
export const MO_SETTINGS_ROUTE = "/organization"
export const DIRECTION = ["desc", "asc"]
export const ROLES: IObjectKeys = {
  USER: "ПОЛЬЗОВАТЕЛЬ",
  ADMIN: "АДМИНИСТРАТОР",
  STATS: "СТАТИСТИК",
}
export const RunsackFilterMatchMode = {
  startsWith: "_start",
  contains: "_cont",
  notContains: "_not_cont",
  endsWith: "_end",
  equals: "_eq",
  notEquals: "_not_eq",
  in: "_in",
  lt: "_lt",
  lte: "lteq",
  gt: "_gt",
  gte: "_gteq",
  between: "",
  dateIs: "_eq",
  dateIsNot: "_not_eq",
  dateBefore: "_lt",
  dateAfter: "_gt",
  custom: "",
}
// маркер удаления для использования в запросах на обновление
// destroy-marker for using in nested_attributes
export const DESTROY_OPTION = { _destroy: "1" }

//формат дата & время
export const TIME_FORMAT = {
  year: "2-digit",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
} as Intl.DateTimeFormatOptions

// формат даты
export const DATE_FORMAT = { year: "2-digit", month: "short", day: "2-digit" } as Intl.DateTimeFormatOptions
