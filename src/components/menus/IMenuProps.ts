import { MenuItem } from "primereact/menuitem"
export interface ExtMenuItem extends MenuItem {
  summary: string
  detail: number
}
export interface IMenuProps {
  id?: string
  model?: MenuItem[]
  style?: object
  className?: string
}
export interface INotificationMenuProps {
  id?: string
  model?: ExtMenuItem[]
  style?: object
  className?: string
}
