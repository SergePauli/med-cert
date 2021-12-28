export const HOME_REGION_CODE = "28"
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
    code: "п.8",
    suggestion: "Место жительства или причина его отсутствия - обязательны для заполнения",
    done: false,
  },
  {
    section: "3",
    code: "п.9",
    suggestion: "Вид места жительства или причина его отсутствия - обязательны для заполнения",
    done: false,
  },
  {
    section: "4",
    code: "п.10",
    suggestion: "Вид места смерти или причина его отсутствия - обязательны для заполнения",
    done: false,
  },
  {
    section: "4",
    code: "п.11",
    suggestion: "Вид места смерти или причина его отсутствия - обязательны для заполнения",
    done: false,
  },
  {
    section: "5",
    code: "п.12",
    suggestion: "Выбор места наступления смерти - обязателен для заполнения",
    done: false,
  },
  {
    section: "5",
    code: "п.13",
    suggestion: "Выбор срока береммености для детей от 168 ч до 1месяца  - обязателен для заполнения",
    done: true,
  },
  {
    section: "5",
    code: "п.14.1",
    suggestion: "Внесение весса для детей от 168 ч до года  - обязательно для заполнения",
    done: true,
  },
  {
    section: "5",
    code: "п.14.2",
    suggestion:
      "Внесение порядкового номера беременности матери для детей от 168 ч до года  - обязательно для заполнения",
    done: true,
  },
  {
    section: "5",
    code: "п.14.3",
    suggestion: "Внесение ФИО матери для детей от 168 ч до года  - обязательно для заполнения",
    done: true,
  },
  {
    section: "5",
    code: "п.14.4",
    suggestion: "Внесение даты рождения матери для детей от 168 ч до года  - обязательно для заполнения",
    done: true,
  },
  {
    section: "5",
    code: "п.14.5",
    suggestion: "Внесение адреса жительства матери для детей от 168 ч до года  - обязательно для заполнения",
    done: true,
  },
  {
    section: "5",
    code: "п.15",
    suggestion: "Указание семейного положения - обязательно для заполнения",
    done: false,
  },
  {
    section: "5",
    code: "п.16",
    suggestion: "Указание образования - обязательно для заполнения",
    done: false,
  },
  {
    section: "5",
    code: "п.17",
    suggestion: "Указание занятости - обязательно для заполнения",
    done: false,
  },
  {
    section: "6",
    code: "п.18",
    suggestion: "Указание рода причины смерти - обязательно для заполнения",
    done: false,
  },
  {
    section: "6",
    code: "п.19",
    suggestion:
      "Указание указать дату, время и обстоятельства травмы (отравления), в случае смерти не от заболевания - обязательно для заполнения",
    done: false,
  },
  {
    section: "6",
    code: "п.20",
    suggestion: "Указание типа медицинского работника, установившего причины смерти - обязательно для заполнения",
    done: false,
  },
  {
    section: "6",
    code: "п.21",
    suggestion: "Указание основание установления причины смерти - обязательно для заполнения",
    done: false,
  },
  {
    section: "7",
    code: "п.22.a)",
    suggestion: "Указание причины а) - обязательно для заполнения",
    done: false,
  },
  {
    section: "7",
    code: "п.22.a)т",
    suggestion: "Период времени между началом патол. состояния и смертью в причине а) - обязателен для заполнения",
    done: false,
  },
  {
    section: "7",
    code: "п.22.б)",
    suggestion: "Указание причины б) или ее отсутствия - обязательно для заполнения",
    done: false,
  },
  {
    section: "7",
    code: "п.22.б)т",
    suggestion:
      "Период времени между началом патол. состояния и смертью в причине б) или его отсутствие - обязательно для заполнения",
    done: false,
  },
  {
    section: "7",
    code: "п.22.в)",
    suggestion: "Указание причины в) или ее отсутствия - обязательно для заполнения",
    done: false,
  },
  {
    section: "7",
    code: "п.22.в)т",
    suggestion:
      "Период времени между началом патол. состояния и смертью в причине в) или его отсутствие - обязательно для заполнения",
    done: false,
  },
  {
    section: "7",
    code: "п.22.г)",
    suggestion: "Указание причины г) или ее отсутствия - обязательно для заполнения",
    done: false,
  },
  {
    section: "7",
    code: "п.22.г)т",
    suggestion:
      "Период времени между началом патол. состояния и смертью в причине г) или его отсутствие - обязательно для заполнения",
    done: false,
  },
  {
    section: "8",
    code: "п.22.II.1",
    suggestion: "Указание кода прочего состояния или причины его отсутствия - обязательно для заполнения",
    done: true,
  },
  {
    section: "8",
    code: "п.22.II.2",
    suggestion:
      "Указание периода времени между началом патол. состояния и смертью или причины его отсутствия - обязательно для заполнения",
    done: true,
  },
  {
    section: "9",
    code: "п.23",
    suggestion: "Указание периода наступления смерти в случае ДТП  - обязательно для заполнения",
    done: false,
  },
  {
    section: "9",
    code: "п.24",
    suggestion: "Указание срока в случае наступления смерти при беременности  - обязательно для заполнения",
    done: false,
  },
  {
    section: "9",
    code: "п.25.1",
    suggestion:
      "Указание данных о враче (судебно-медицинском эксперте, фельдшере, акушерке), заполнившем свидетельство - обязательно для заполнения",
    done: false,
  },
  {
    section: "9",
    code: "п.25.2",
    suggestion: "Указание данных о руководителе медицинской организации - обязательно для заполнения",
    done: false,
  },
  {
    section: "9",
    code: "п.26",
    suggestion:
      "Указание данных об ответственном за проверку медицинских свидетельств лице - обязательно для заполнения",
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
export const LIFE_AREA_SUG = 13
export const LIFE_PLACE_SUG = 12
export const DEATH_PLACE_SUG = 14
export const DEATH_AREA_SUG = 15
export const DEATH_PLACE_TYPE_SUG = 16
export const TERMS_PREGNANCY_SUG = 17
export const CHILD_WEIGHT_SUG = 18
export const NUMBER_PREGNANCY_SUG = 19
export const MOTHER_FIO_SUG = 20
export const MOTHER_BIRTHDAY_SUG = 21
export const MOTHER_ADDRESS_SUG = 22
export const MARITAL_STATUS_SUG = 23
export const EDUCATION_LEVEL_SUG = 24
export const SOCIAL_STATUS_SUG = 25
export const DEATH_KINDS_SUG = 26
export const KIND_DEATH_REASON_SUG = 27
export const EST_MEDIC_SUG = 28
export const BASIS_DERMINING_SUG = 29
export const REASON_A_SUG = 30
export const REASON_A_TIME_SUG = 31
export const REASON_B_SUG = 32
export const REASON_B_TIME_SUG = 33
export const REASON_C_SUG = 34
export const REASON_C_TIME_SUG = 35
export const REASON_D_SUG = 36
export const REASON_D_TIME_SUG = 37
export const EXT_REASON_SUG = 38
export const EXT_REASON_TIME_SUG = 39
export const TRAFFFIC_ACCIDENT_SUG = 40
export const PREGNANCY_CONNECTION_SUG = 41
export const AUTHOR_SUG = 42
export const AUTHENTICATOR_SUG = 44
export const LEGAL_AUTHENTICATOR_SUG = 43

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
export const DEFAULT_ERROR_TOAST = {
  severity: "error",
  summary: "Сбой",
  detail: "Что-то пошло не так, по-пробуйте позднее",
  life: 3000,
  baseZIndex: 999,
}
