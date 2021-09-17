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
    code: "п.7",
    suggestion: "Указание даты смерти или причины ее отсутствия - обязательно для заполнения",
    done: false,
  },
  {
    section: "2",
    code: "п.4.1",
    suggestion: "Указание серии ДУЛ умершего или причины его отсутствия - обязательно для заполнения",
    done: false,
  },
  {
    section: "2",
    code: "п.4.2",
    suggestion: "Указание номера ДУЛ умершего или причины его отсутствия - обязательно для заполнения",
    done: false,
  },
  {
    section: "2",
    code: "п.4.3",
    suggestion: "Указание органа выдавшего ДУЛ умершего или причины его отсутствия - обязательно для заполнения",
    done: false,
  },
  {
    section: "2",
    code: "п.4.4",
    suggestion: "Указание даты выдачи ДУЛ умершего или причины его отсутствия - обязательно для заполнения",
    done: false,
  },
  {
    section: "2",
    code: "п.4.5",
    suggestion: "Указание кода подразделения ДУЛ умершего или причины его отсутствия - обязательно для заполнения",
    done: false,
  },
  {
    section: "2",
    code: "п.5",
    suggestion: "Указание SNILS умершего или причины его отсутствия - обязательно для заполнения",
    done: false,
  },
  {
    section: "2",
    code: "п.6",
    suggestion: "Указание полиса ОМС или причины его отсутствия - обязательно для заполнения",
    done: false,
  },
  {
    section: "3",
    code: "п.9",
    suggestion: "Вида места жительства или причины его отсутствия - обязательно для заполнения",
    done: false,
  },
]
export const CERT_TYPE_SUG = 0
export const PERSON_NAME_SUG = 1
export const PATIENT_GENDER_SUG = 2
export const PATIENT_BIRTHDAY_SUG = 3
export const CERT_DEATH_THIME_SUG = 4
export const IDSERIES_SUG = 5
export const IDNUMBER_SUG = 6
export const IORGNAME_SUG = 7
export const IORGDATE_SUG = 8
export const IORGCODE_SUG = 9
export const SNILS_SUG = 10
export const OMS_SUG = 11
export const LIFE_AREA_SUG = 12
export const changeSuggestion = (code: string, suggestions: any[], done: boolean) => {
  const suggestion = suggestions.find((item) => item.code === code)
  if (suggestion) suggestion.done = done
}

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

export const URBAN_AREA_TYPE = 1
export const VILAGE_AREA_TYPE = 2

export const ID_CARD_TYPES = [
  { code: "1", name: "Паспорт гр. РФ", s_mask: "99 99", n_mask: "999999", c_mask: "999-999" },
  { code: "2", name: "Заграничный паспорт гр. РФ", s_mask: "99", n_mask: "9999999", c_mask: "ФМС 99999" },
  { code: "3", name: "Служебный паспорт" },
  { code: "4", name: "Врем. уд. личности(форма № 2П)" },
  { code: "6", name: "Свидетельство о рождении" },
  { code: "8", name: "Удостоверение личности военнослужащего" },
  { code: "9", name: "Военный билет" },
  { code: "10", name: "Паспорт иностранного гражданина" },
  { code: "11", name: "Вид на жительство" },
  { code: "17", name: "Разрешение на временное проживание в РФ" },
  { code: "25", name: "Справка об освобождении из места лишения свободы" },
  { code: "36", name: "Водительское удостоверение" },
  { code: "38", name: "Охотничий билет" },
]
export const PASSPORT_RF = 0
export const REGION = { code: "28", name: "Амурская область" }
