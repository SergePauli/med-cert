export interface IObjectKeys {
  [key: string]: string | number | undefined
}
export const HOME_ROUTE = "/"
export const LOGIN_ROUTE = "/login"
export const REGISTRATION_ROUTE = "/registration"
export const PWD_RECOVERY_ROUTE = "/pwd_recovery"
export const MESSAGE_ROUTE = "/message"
export const ERROR_ROUTE = "/error"
export const ADMIN_ROUTE = "/admin"
export const LIST_ROUTE = "/list"
export const CERTIFICATE_ROUTE = "/cert"
export const REPORT_ROUTE = "/report"
export const DOCTORS_ROUTE = "/doctors"

export const ROLES: IObjectKeys = {
  USER: "ПОЛЬЗОВАТЕЛЬ",
  ADMIN: "АДМИНИСТРАТОР",
  STATS: "СТАТИСТИК",
}
export const CERT_TYPE = [
  { code: "1", name: "окончательное" },
  { code: "2", name: "предварительное" },
  { code: "3", name: "взамен предварительного" },
  { code: "4", name: "взамен окончательного" },
]
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
