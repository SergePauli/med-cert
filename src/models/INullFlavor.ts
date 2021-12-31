import { UNK } from "../utils/defaults"
import { IDestroyble } from "./IDestroyble"

export interface INullFlavor extends IDestroyble {
  id?: number
  parent_guid?: string
  parent_attr: string
  code: number
}

//получаем чистый NullFlavor без метки удаления
export const getCleanNullFlavor = (old: INullFlavor): INullFlavor | undefined => {
  if (old === undefined) return
  let _new = { code: old.code, parent_attr: old.parent_attr } as INullFlavor
  if (old.id) _new.id = old.id
  if (old.parent_guid) _new.parent_guid = old.parent_guid
  return _new
}

//генерируем заполнитель UNK автоматически,
//проверяя значение field
//и массив заполнителей до внесения изменений: original
export const checkFieldNullFlavor = (
  key: string,
  field: any | null | undefined,
  nullFlavors: INullFlavor[],
  code = UNK
) => {
  const idx = nullFlavors.findIndex((item) => item.parent_attr === key)
  if (field && idx !== -1) nullFlavors[idx]._destroy = "1"
  else if (!field && idx !== -1 && nullFlavors[idx]._destroy === "1") {
    nullFlavors[idx] = { ...getCleanNullFlavor(nullFlavors[idx]) } as INullFlavor
  } else if (!field && idx === -1) nullFlavors.push({ code: code, parent_attr: key })
}

//генерируем заполнители UNK автоматически,
//проверяя карту fields<имя поля, значение>
//и массив заполнителей до внесения изменений: original
export const createNullFlavors = (fields: Map<string, any | null | undefined>, original: INullFlavor[]) => {
  fields.forEach((value, key) => {
    checkFieldNullFlavor(key, value, original)
  })
}
