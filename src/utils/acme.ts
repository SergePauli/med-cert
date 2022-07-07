import Certificate from "../models/FormsData/Certificate"
import ACMEService from "../services/ACME_Service"

/**
 * Преобразование массива причин в строку заданного формата: Позиции
 * соответствуют кодам МКБ-10 причин смерти, записанных без точки (4
 * знакоместа) и разделенные знаком / внутри раздела 1 пункта 22 нашего
 * свидетельства о смерти, знаком * между разделами, пробелом внутри раздела
 * 2 и с размещением кода внешней причины (первые 3 знака) в конце
 * кодограммы с добавленным знаком & впереди.
 *
 * @return результирующая строка
 */
const codogram = (
  reason_a: string,
  reason_b: string | undefined,
  reason_c: string | undefined,
  ext_reason: string | undefined,
  reasons: Array<string | undefined>
): string => {
  let _result = ""
  let _part_2 = ""
  reasons.forEach((code) => {
    if (!!code) _part_2 += " " + code
  })
  if (!reason_b && !ext_reason && !reasons[0]) {
    _result = reason_a
  } else if (!!reason_b && !reason_c && !ext_reason && !reasons[0]) {
    _result = reason_a + "/" + reason_b
  } else if (!!reason_b && !!reason_c && !ext_reason && !reasons[0]) {
    _result = reason_a + "/" + reason_b + "/" + reason_c
  } else if (!reason_b && !ext_reason && !!reasons[0]) {
    _result = reason_a + "*" + _part_2
  } else if (!!reason_b && !reason_c && !ext_reason && !!reasons[0]) {
    _result = reason_a + "/" + reason_b + "*" + _part_2
  } else if (!!reason_b && !!reason_c && !ext_reason && !!reasons[0]) {
    _result = reason_a + "/" + reason_b + "/" + reason_c + "*" + _part_2
  } else if (!reason_b && !!ext_reason && !reasons[0]) {
    _result = reason_a + " " + ext_reason
  } else if (!!reason_b && !reason_c && !!ext_reason && !reasons[0]) {
    _result = reason_a + "/" + reason_b + " " + ext_reason
  } else if (!!reason_b && !!reason_c && !!ext_reason && !reasons[0]) {
    _result = reason_a + "/" + reason_b + "/" + reason_c + " " + ext_reason
  } else if (!reason_b && !!ext_reason && !!reasons[0]) {
    _result = reason_a + "*" + _part_2 + " " + ext_reason
  } else if (!!reason_b && !reason_c && !!ext_reason && !!reasons[0]) {
    _result = reason_a + "/" + reason_b + "*" + _part_2 + " " + ext_reason
  } else if (!!reason_b && !!reason_c && !!ext_reason && !!reasons[0]) {
    _result = reason_a + "/" + reason_b + "/" + reason_c + "*" + _part_2 + " " + ext_reason
  }
  return _result.padEnd(120, " ")
}

/**
 * экспорт массива причин в строку
 *
 * @param withOtherReasons определяет есть ли прочие причины
 * @return входную кодограмму для внешнего модуля АСМЕ
 * (файл с расширением ain)
 */
const ACME_AIN = (withOtherReasons: boolean, certificate: Certificate) => {
  const deathDatetime = certificate.deathDatetime?.toDateString()
  const deathDate = certificate.deathDatetime?.toLocaleDateString()
  //Позиции 1-4 соответствуют году смерти
  const X1X4 = !deathDatetime ? "0000" : deathDatetime.slice(-4)
  //Позиции 5-6 соответствуют месту смерти, которая обозначена NC

  //Позиции 7-12 соответствуют номеру сертификата, вместо которого для
  //идентификации записи после ее возврата от АСМЕ
  //заполнены левой частью форматированного до 10 знаков незначащими нулями
  //значения счетчика (6 знакомест)
  const X7X12 = certificate.number?.slice(-4).padStart(6, "0") || "000000"

  //Позиция 13 соответствует номеру кодировщика, который обозначен как 1

  //Позиции 14-17 соответствуют лоту, вместо которого для идентификации записи после
  //ее возврата от АСМЕ заполнены правой частью форматированного до 10 знаков
  //незначащими нулями значения счетчика (4 знакоместа)
  const X14X17 = withOtherReasons ? "0000" : "0001"

  //Позиция 18 соответствует номеру секции, который обозначен как 1
  //Позиции 19-21 соответствуют первым трем буквам месяца смерти
  const X19X21 = !deathDatetime ? "000" : deathDatetime.slice(4, 7)
  //Позиции 22-23 соответствуют месяцу смерти
  const X22X23 = !deathDate ? "  " : deathDate.slice(3, 5)
  //Позиции 24-25 соответствуют дню смерти
  const X24X25 = !deathDate ? "  " : deathDate.slice(0, 2)
  // Позиции 26-29 соответствуют Х26Х29 (году смерти), отсутствие заполняется пробелами
  const X26X29 = !deathDate ? "    " : deathDate.slice(-4)
  // Позиции 30-33 соответствуют году версии программы SuperMICAR
  // Позиции 34-37 соответствуют году версии программы MICAR200
  const birthDay = certificate.patient.birth_date
  const deathDay = certificate.deathDatetime
  //Позиция 38 соответствует: 1 - год, 2 - месяц, 4 - день
  //Позиции 39 - 41 числу годов или месяцев или дней (в зависимости от позиции 38)
  let XYMD = "9"
  let X39X41 = "999"
  if (deathDay && birthDay) {
    let _diff = deathDay.getFullYear() - birthDay.getFullYear()
    if (_diff > 1) {
      XYMD = "1"
      X39X41 = _diff.toString().padStart(3, "0")
    } else if (_diff === 1) {
      _diff = deathDay.getMonth() - birthDay.getMonth()
      if (_diff > 0) {
        XYMD = "1"
        X39X41 = "001"
      } else {
        XYMD = "2"
        _diff = deathDay.getMonth() + 12 - birthDay.getMonth()
        X39X41 = _diff.toString().padStart(3, "0")
      }
    } else {
      _diff = deathDay.getMonth() - birthDay.getMonth()
      if (_diff > 1) {
        XYMD = "2"
        X39X41 = _diff.toString().padStart(3, "0")
      } else if (_diff === 1) {
        _diff = deathDay.getDate() - birthDay.getDate()
        if (_diff > 0) {
          XYMD = "1"
          X39X41 = "001"
        } else {
          XYMD = "3"
          _diff = deathDay.getDate() + 30 - birthDay.getDate()
          X39X41 = _diff.toString().padStart(3, "0")
        }
      } else {
        _diff = deathDay.getDate() - birthDay.getDate()
        if (_diff > 0) {
          XYMD = "3"
          X39X41 = _diff.toString().padStart(3, "0")
        } else {
          XYMD = "3"
          X39X41 = "000"
        }
      }
    }
  }
  //Позиция 42 соответствует пункту 14 нашего свидетельства: от чего умер.
  //Значению deathKind=1 (заболевание) соответствует в АСМЕ код N
  //Значению deathKind=2 или 3 (несчастный случай) соответствует в АСМЕ код A
  //Значению deathKind=4 (убийство) соответствует в АСМЕ код H
  //Значению deathKind=5 (самоубийство) соответствует в АСМЕ код S
  //Значению deathKind=6 (в ходе военных действий) соответствует в АСМЕ код A
  //Значению deathKind=7 (в ходе террористических действий) соответствует в АСМЕ код A
  //Значению deathKind=8 (род смерти не установлен) соответствует в АСМЕ код C
  let X42 = " "
  if (!!certificate.deathKind && certificate.deathKind > 0)
    X42 = ["N", "A", "A", "H", "S", "A", "A", "C"][certificate.deathKind - 1]
  //Позиция 43 соответствует одному пробелу (" ")
  //Позиция 44 - кем отвергнута запись (принимается пробел, т.е. не отвергнута)

  //X45 - четвертый знак кода четвертой строки при условии, что он
  //находится в пределах W00-Y34.X, кроме Y06._ и Y07._
  let X45 = certificate.reasonD?.diagnosis?.ICD10
  X45 =
    !X45 ||
    !(X45 >= "W00" && X45 <= "Y34.X") ||
    X45.lastIndexOf("X") > 1 ||
    X45.includes("Y06.") ||
    X45.includes("Y07.") ||
    X45.length < 4
      ? " "
      : X45.substring(4, 5)

  //Позиции 51-170 соответствуют кодам МКБ-10 причин смерти, записанных
  //без точки (4 знакоместа) и разделенные знаком / внутри раздела 1
  //пункта 18 нашего свидетельства о смерти, знаком * между разделами,
  //пробелом внутри раздела 2 и с размещением кода внешней причины (первые 3 знака) в конце
  //кодограммы с добавленным знаком & впереди.
  let reasonA = certificate.reasonA?.diagnosis?.ICD10
  reasonA = reasonA && reasonA.replace(".", "").padEnd(4, " ")
  let reasonB = certificate.reasonB?.diagnosis?.ICD10
  reasonB = reasonB && reasonB.replace(".", "").padEnd(4, " ")
  let reasonC = certificate.reasonC?.diagnosis?.ICD10
  reasonC = reasonC && reasonC.replace(".", "").padEnd(4, " ")
  let reasonD = certificate.reasonD?.diagnosis?.ICD10
  reasonD = reasonD && reasonD.replace(".", "")
  if (X45 !== " " && !!reasonD) {
    reasonD = "&" + reasonD
    if (reasonD.length > 4) reasonD = reasonD.slice(0, 4)
  } else if (!!reasonD && X45 === " ") reasonD = ("&" + reasonD).padEnd(5, " ")
  if (reasonD && reasonD.length < 4) reasonD = reasonD.padEnd(4, " ")
  const reasons = []
  reasons[0] =
    certificate.deathReasons.length < 1 || !withOtherReasons
      ? undefined
      : certificate.deathReasons[0].diagnosis?.ICD10.replace(".", "").padEnd(4, " ")
  reasons[1] =
    certificate.deathReasons.length < 2 || !withOtherReasons
      ? undefined
      : certificate.deathReasons[1].diagnosis?.ICD10.replace(".", "").padEnd(4, " ")
  reasons[2] =
    certificate.deathReasons.length < 3 || !withOtherReasons
      ? undefined
      : certificate.deathReasons[2].diagnosis?.ICD10.replace(".", "").padEnd(4, " ")
  reasons[3] =
    certificate.deathReasons.length < 4 || !withOtherReasons
      ? undefined
      : certificate.deathReasons[3].diagnosis?.ICD10.replace(".", "").padEnd(4, " ")

  reasonA = reasonA && reasonA.lastIndexOf("X") > 1 ? reasonA.slice(0, 3) + " " : reasonA
  reasonB = reasonB && reasonB.lastIndexOf("X") > 1 ? reasonB.slice(0, 3) + " " : reasonB
  reasonC = reasonC && reasonC.lastIndexOf("X") > 1 ? reasonC.slice(0, 3) + " " : reasonC

  const reasons_in = reasons.map((reason) => {
    return reason && reason.lastIndexOf("X") > 1 ? reason.substring(0, 3) + " " : reason
  })

  //Далее позиции 90 - 170 заняты пробелами, т.е. Space(81)

  //Позиция 171 - вскрытие (Y - да, N - нет, U - поле не заполнено)
  //В базе код вскрытия 4, а не 1!!!!!!

  const X171 = !certificate.basisDetermining ? "U" : certificate.basisDetermining === 4 ? "Y" : "N"
  //Позиции 172-173 заняты пробелами
  //Позиция 174 в случае смерти беременной (21п.)
  let X174 = "3"
  if (certificate.pregnancyConnection) X174 = ["9", "3", "4", "1"][certificate.pregnancyConnection]

  //Позиция 175 занята пробелом
  //Позиции 176-177 - месяц даты травмы (пункт 15 нашего свитетельства), отсутствие обозначено 99
  const extReasonTime = certificate.extReasonTime?.toLocaleString()
  const X176X177 = !extReasonTime ? "99" : extReasonTime.substring(3, 5)
  //Позиции 178-179 - день даты травмы (пункт 15 нашего свитетельства), отсутствие обозначено 99
  const X178X179 = !extReasonTime ? "99" : extReasonTime.substring(0, 2)
  //Позиции 180-183 - год даты травмы (пункт 15 нашего свитетельства), отсутствие обозначено 9999
  const X180X183 = !extReasonTime ? "9999" : extReasonTime.substring(6, 10)

  //Позиции 184-187 (время травмы) заполнены 9999
  //Позиция 188 (смерть от травмирования)

  const X188 = !certificate.deathKind || certificate.deathKind !== 3 ? " " : "Y"

  //Позиции 189 - 218 заполнены 30 пробелами, т.е. Space(30)
  //Позиция 219 соответствует пятому знаку кода внешней причины (не считая точки)
  let X219 = certificate.reasonD?.diagnosis?.ICD10
  X219 = X219 && X219.length > 5 ? X219.substring(5, 6) : " "
  //Позиции 220 - 231 могут быть заполнены кодом территории (п.7 свидетельства - республика, область, край)
  let X220X231 = certificate.patient.person?.address?.state
  X220X231 = !X220X231 ? "            " : X220X231.padStart(12, " ")

  //Позиции 232 - 261 для дополнительной информации заполнены пробелами, т.е. Space(30) с буквой q на конце
  //ACMEAIN - объединяющая строка, формирующая входную кодограмму для внешнего модуля АСМЕ (файл с расширением ain)
  const ACMEAIN =
    X1X4 +
    "NC" +
    X7X12 +
    "1" +
    X14X17 +
    "1" +
    X19X21 +
    X22X23 +
    X24X25 +
    X26X29 +
    "20042004" +
    XYMD +
    X39X41 +
    X42 +
    "  " +
    X45 +
    "     " +
    codogram(reasonA || "    ", reasonB, reasonC, reasonD, reasons_in) +
    X171 +
    "  " +
    X174 +
    " " +
    X176X177 +
    X178X179 +
    X180X183 +
    "9999" +
    X188 +
    "                              " +
    X219 +
    X220X231
  return ACMEAIN.padEnd(260, " ") + "q"
}
/**
 * Достаем первоначальную причину смерти из кодограммы ACME Во входной
 * кодограмме позиции 51-54 соответствуют первоначальной причине смерти, а
 * позиция 45 - четвертому знаку внешней причины. При отсутствии четвертого
 * знака добавляется знак Х.
 *
 * @param xACME - входная кодограмма из файла *.TIN
 * @return первоначальную причину смерти или пустую строку
 */
const parse_ACME_TIN = (xACME: string) => {
  let _sb = ""
  const x45 = xACME.substring(44, 45)
  const x54 = xACME.substring(53, 54)
  const x51_53 = xACME.substring(50, 53)
  const spX45 = " " === x45
  const spX54 = " " === x54
  const spX51_53 = "   " === x51_53
  if (spX45 && !spX54) _sb = `${x51_53}.${x54}`
  else if (spX45 && spX54 && !spX51_53) _sb = `${x51_53}.X`
  else if (!spX45 && !spX51_53 && "V01" < x51_53 && "Y98.X" >= x51_53) _sb = `${x51_53}.${x45}`
  else if (!spX45 && !spX51_53 && "V" > x51_53) _sb = `${x51_53}.${x54}`
  return _sb
}

/**
 * экспорт массива причин в строку АСМЕAIN запрос сервиса ACME
 * чтение парсинг результата АСМЕTIN и его обработка.
 *
 * @return код результата операции
 */
export const doACME = (
  certificate: Certificate,
  onSucccess: (result: string) => void,
  onError: (message: string) => void
) => {
  let _result = -1
  try {
    // Получаем строку входных параметров для внешнего модуля АСМЕ
    const strACMEAIN1 = ACME_AIN(true, certificate)
    _result = -2
    const isReasonD = !!certificate.reasonD && !!certificate.reasonD.diagnosis && !!certificate.reasonD.diagnosis.ICD10
    // Получаем дополнительную строку входных параметров
    // без прочих причин на входе, если внешняя причина определена
    const strACMEAIN2 = isReasonD ? ACME_AIN(false, certificate) : ""
    _result = -3
    // делаем запрос к сервису АСМЕ
    ACMEService.runACME(strACMEAIN1 + strACMEAIN2)
      .then((response) => {
        if (response.data && response.data.length < 120) {
          //Длина менее 120, что-то пошло не так
          onError(`Сбой операции: получен некорректный ответ от АСМЕ: ${response.data}`)
        } else {
          // сервис вернул корректный результат
          const TINs = (response.data as any).data_TIN.split("\r\n")
          console.log("response.data", response.data)
          if (!isReasonD) onSucccess(parse_ACME_TIN(TINs[0]))
          else {
            let _res = ""
            let _alter = ""
            if (Number.parseInt(TINs[0].slice(6, 12) + TINs[0].slice(13, 17)) === 1) {
              _res = parse_ACME_TIN(TINs[0])
              _alter = parse_ACME_TIN(TINs[1])
            } else {
              _res = parse_ACME_TIN(TINs[1])
              _alter = parse_ACME_TIN(TINs[0])
            }
            if (_res < "V00" || _res > "Y99.X") _res = ""
            if ("" === _res) _res = _alter
            onSucccess(_res)
          }
        }
      })
      .catch((reason) => {
        onError(`Сбой операции: код завершения - 0, подробности: ${reason.message}`)
      })
    _result = 0
  } catch (error) {
    onError(`Сбой операции: код завершения ${_result}, подробности: ${error}`)
  }
}
