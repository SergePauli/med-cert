export interface IPersonName {
  id?: number
  family: string // фамилия
  given_1: string // имя
  given_2?: string // отчество
}
export const getOneLinePersonName = (person_name: IPersonName | undefined | null): string => {
  if (!person_name) return ""
  else return `${person_name.family} ${person_name.given_1} ${person_name.given_2 ? person_name.given_2 : ""}`.trim()
}
