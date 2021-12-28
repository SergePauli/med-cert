import { IDestroyble } from "./IDestroyble"

export interface INullFlavor extends IDestroyble {
  id?: number
  parent_guid?: string
  parent_attr: string
  code: number
}
export const getCleanNullFlavor = (old: INullFlavor) => {
  if (old === undefined) return
  let _new = { code: old.code, parent_attr: old.parent_attr } as INullFlavor
  if (old.id) _new.id = old.id
  if (old.parent_guid) _new.parent_guid = old.parent_guid
  return _new
}
