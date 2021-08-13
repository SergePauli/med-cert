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

export const ROLES: IObjectKeys = {
  USER: "ПОЛЬЗОВАТЕЛЬ",
  ADMIN: "АДМИНИСТРАТОР",
  STATS: "СТАТИСТИК",
}
