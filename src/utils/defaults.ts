export const DEFAULT_CERT_SUGGESTIONS = [
  { section: "0", code: "0", suggestion: "Необходимо выбрать тип свидетельства", done: false },
  {
    section: "1",
    code: "п.1",
    suggestion: "Поля ФИО должны быть заполнены, если умерший идентифицирован",
    done: false,
  },
  { section: "1", code: "п.2", suggestion: "Указание пола умершего является обязательным для заполнения", done: false },
  {
    section: "1",
    code: "п.3",
    suggestion: "Указание даты рождения или причины ее отсутствия - обязательно для заполнения",
    done: false,
  },
  {
    section: "1",
    code: "п.4",
    suggestion: "Указание даты смерти или причины ее отсутствия - обязательно для заполнения",
    done: false,
  },
]
export const CERT_TYPE_SUG = 0
export const PERSON_NAME_SUG = 1
export const PATIENT_GENDER_SUG = 2
export const PATIENT_BIRTHDAY_SUG = 3
export const CERT_DEATH_THIME_SUG = 4

export const NULL_FLAVORS = [
  { code: "NI", name: "Нет информации" },
  { code: "INV", name: "Недопустимое значение" },
  { code: "DER", name: "Извлекаемое значение" },
  { code: "OTH", name: "Другое" },
  { code: "NINF", name: "Минус бесконечность" },
  { code: "PINF", name: "Плюс бесконечность" },
  { code: "UNC", name: "Кодирование не проводилось" },
  { code: "MSK", name: "Скрыто" },
  { code: "NA", name: "Неприменимо" },
  { code: "UNK", name: "Неизвестно" },
  { code: "ASKU", name: "Запрошено, но неизвестно" },
  { code: "NAV", name: "Временно недоступно" },
  { code: "NASK", name: "Не запрашивалось" },
  { code: "QS", name: "Достаточное количество" },
  { code: "TRC", name: "Трудноразличимо" },
]
export const ASKU = 10
export const NA = 8
export const UNK = 9

export const MALE = 1
export const FEMALE = 2
export const NOGENDER = 4
