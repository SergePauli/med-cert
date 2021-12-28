import { DESTROY_OPTION } from "../utils/consts"
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

//генерируем заполнители UNK автоматически,
//проверяя карту fields<имя поля, значение>
//и массив заполнителей до внесения изменений: original
export const createNullFlavors = (
  fields: Map<string, string | null | undefined>,
  original: INullFlavor[]
): INullFlavor[] => {
  let _nullFlafors = [] as INullFlavor[]
  fields.forEach((value, key) => {
    const _nullFlavor = original.find((item) => item.parent_attr === key)
    if (value && _nullFlavor) _nullFlafors.push({ ..._nullFlavor, ...DESTROY_OPTION })
    else if (!value && _nullFlavor) {
      const candidat = getCleanNullFlavor(_nullFlavor)
      if (candidat) _nullFlafors.push(candidat)
    } else if (!value && !_nullFlavor) _nullFlafors.push({ code: UNK, parent_attr: key })
  })
  return _nullFlafors
}
