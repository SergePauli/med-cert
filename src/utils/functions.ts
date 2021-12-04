const SEC_IN_WEEK = 604800
const SEC_IN_DAY = 86400
export interface ITimeDiff {
  years: number | undefined
  months: number | undefined
  weeks: number | undefined
  days: number | undefined
  hours: number | undefined
  minutes: number | undefined
}
export const timeDiff = (d1: Date, d2: Date) => {
  if (d2 < d1) throw Error("invalid dates d1 > d2")
  let latest = d2
  let yearDiff = d2.getFullYear() - d1.getFullYear()
  const years = yearDiff > 0 ? yearDiff : undefined
  if (years) {
    latest = new Date(d1.getFullYear(), latest.getMonth(), latest.getDate(), latest.getHours(), latest.getMinutes())
    if (d1 > latest)
      latest = new Date(
        d1.getFullYear() + 1,
        latest.getMonth(),
        latest.getDate(),
        latest.getHours(),
        latest.getMinutes()
      )
  }

  const months =
    latest.getMonth() < d1.getMonth() ? 12 + latest.getMonth() - d1.getMonth() : latest.getMonth() - d1.getMonth()
  if (months > 0) {
    latest = new Date(d1.getFullYear(), d1.getMonth(), latest.getDate(), latest.getHours(), latest.getMinutes())
    if (d1 > latest) {
      if (d1.getMonth() === 12) {
        latest = new Date(d1.getFullYear() + 1, 1, latest.getDate(), latest.getHours(), latest.getMinutes())
      } else
        latest = new Date(d1.getFullYear(), d1.getMonth() + 1, latest.getDate(), latest.getHours(), latest.getMinutes())
    }
  }
  let diff = (latest.getTime() - d1.getTime()) / 1000
  diff = Math.floor(diff)
  const weeks = Math.floor(diff / SEC_IN_WEEK)
  diff = diff - weeks * SEC_IN_WEEK
  const days = Math.floor(diff / SEC_IN_DAY)
  diff = diff - days * SEC_IN_DAY
  const hours = Math.floor(diff / 3600)
  diff = diff - hours * 3600
  const minutes = Math.floor(diff / 60)
  return {
    years,
    months,
    weeks,
    days,
    hours,
    minutes,
  } as ITimeDiff
}
// for API request params objects
// to remove the indefined items from nested objects as well, using a recursive
// используем рекурсивную функцию очистки объектов от undefined свойств
export const removeEmpty = (obj: any) => {
  let newObj = {} as any
  Object.keys(obj).forEach((key) => {
    if (obj[key] === Object(obj[key])) newObj[key] = removeEmpty(obj[key])
    else if (obj[key] !== undefined) newObj[key] = obj[key]
  })
  return newObj
}
