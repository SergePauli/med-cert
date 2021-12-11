import { IPersonName } from "../IPersonName"
import { IUserInfo } from "./IUserInfo"

export const ACTIONS = new Map<string, IActionAttribute>([
  ["added", { title: "Добавлено:", icon: "pi pi-plus", color: "rgb(104, 159, 56)" }],
  ["updated", { title: "Изменено:", icon: "pi pi-pencil", color: "rgb(2, 136, 209)" }],
  ["removed", { title: "Удалено:", icon: "pi pi-trash", color: "rgb(251, 192, 45)" }],
  ["archived", { title: "Архивировано:", icon: "pi pi-inbox", color: "rgb(96, 125, 139)" }],
  ["commented", { title: "Комментарий:", icon: "pi pi-comment", color: "rgb(96, 125, 139)" }],
  ["imported", { title: "Импорт:", icon: "pi pi-download", color: "rgb(156, 39, 176)" }],
  ["exported", { title: "Экспорт:", icon: "pi pi-upload", color: "rgb(156, 39, 176)" }],
  ["signed_in", { title: "Подписано:", icon: "pi pi-user-edit", color: "rgb(104, 159, 56)" }],
  ["signed_out", { title: "Отозвано:", icon: "pi pi-user-minus", color: "rgb(251, 192, 45)" }],
])
export enum Severity {
  success,
  info,
  warning,
  error,
}
export interface IActionAttribute {
  title: string
  icon: string
  color: string
}

export interface ITimeEvent {
  id: number
  action: string
  severity: Severity
  detail: string
  table?: string
  summary?: string
  user: { id: number; email: string; person_name: IPersonName }
  organization: { id: number; name: string }
  created_at: string
}
