export const Base64 = {
  _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

  encode: function (input) {
    let output = ""
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4
    let i = 0

    input = Base64._utf8_encode(input)

    while (i < input.length) {
      chr1 = input.charCodeAt(i++)
      chr2 = input.charCodeAt(i++)
      chr3 = input.charCodeAt(i++)

      enc1 = chr1 >> 2
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4)
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6)
      enc4 = chr3 & 63

      if (isNaN(chr2)) {
        enc3 = enc4 = 64
      } else if (isNaN(chr3)) {
        enc4 = 64
      }

      output =
        output +
        this._keyStr.charAt(enc1) +
        this._keyStr.charAt(enc2) +
        this._keyStr.charAt(enc3) +
        this._keyStr.charAt(enc4)
    }

    return output
  },

  decode: function (input) {
    var output = ""
    var chr1, chr2, chr3
    var enc1, enc2, enc3, enc4
    var i = 0

    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "")

    while (i < input.length) {
      enc1 = this._keyStr.indexOf(input.charAt(i++))
      enc2 = this._keyStr.indexOf(input.charAt(i++))
      enc3 = this._keyStr.indexOf(input.charAt(i++))
      enc4 = this._keyStr.indexOf(input.charAt(i++))

      chr1 = (enc1 << 2) | (enc2 >> 4)
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2)
      chr3 = ((enc3 & 3) << 6) | enc4

      output = output + String.fromCharCode(chr1)

      if (enc3 !== 64) {
        output = output + String.fromCharCode(chr2)
      }
      if (enc4 !== 64) {
        output = output + String.fromCharCode(chr3)
      }
    }

    output = Base64._utf8_decode(output)

    return output
  },

  _utf8_encode: function (string) {
    string = string.replace(/\r\n/g, "\n")
    var utftext = ""

    for (var n = 0; n < string.length; n++) {
      var c = string.charCodeAt(n)

      if (c < 128) {
        utftext += String.fromCharCode(c)
      } else if (c > 127 && c < 2048) {
        utftext += String.fromCharCode((c >> 6) | 192)
        utftext += String.fromCharCode((c & 63) | 128)
      } else {
        utftext += String.fromCharCode((c >> 12) | 224)
        utftext += String.fromCharCode(((c >> 6) & 63) | 128)
        utftext += String.fromCharCode((c & 63) | 128)
      }
    }

    return utftext
  },

  _utf8_decode: function (utftext) {
    let string = ""
    let i = 0
    let c = 0
    let c2 = 0

    while (i < utftext.length) {
      c = utftext.charCodeAt(i)

      if (c < 128) {
        string += String.fromCharCode(c)
        i++
      } else if (c > 191 && c < 224) {
        c2 = utftext.charCodeAt(i + 1)
        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63))
        i += 2
      } else {
        c2 = utftext.charCodeAt(i + 1)
        let c3 = utftext.charCodeAt(i + 2)
        string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63))
        i += 3
      }
    }

    return string
  },
}
export const STATUS_OK = "Действителен"
function CertificateAdjuster() {}
CertificateAdjuster.prototype.checkQuotes = function (str) {
  var result = 0,
    i = 0
  for (i; i < str.length; i++) if (str[i] === '"') result++
  return !(result % 2)
}

CertificateAdjuster.prototype.extract = function (from, what) {
  let certName = ""

  var begin = from.indexOf(what)

  if (begin >= 0) {
    var end = from.indexOf(", ", begin)
    while (end > 0) {
      if (this.checkQuotes(from.substr(begin, end - begin))) break
      end = from.indexOf(", ", end + 1)
    }
    certName = end < 0 ? from.substr(begin) : from.substr(begin, end - begin)
  }

  return certName
}

CertificateAdjuster.prototype.Print2Digit = function (digit) {
  return digit < 10 ? "0" + digit : digit
}

CertificateAdjuster.prototype.GetCertDate = function (paramDate) {
  var certDate = new Date(paramDate)
  return (
    this.Print2Digit(certDate.getUTCDate()) +
    "." +
    this.Print2Digit(certDate.getUTCMonth() + 1) +
    "." +
    certDate.getFullYear() +
    " " +
    this.Print2Digit(certDate.getUTCHours()) +
    ":" +
    this.Print2Digit(certDate.getUTCMinutes()) +
    ":" +
    this.Print2Digit(certDate.getUTCSeconds())
  )
}

CertificateAdjuster.prototype.GetCertName = function (certSubjectName) {
  return this.extract(certSubjectName, "CN=")
}

CertificateAdjuster.prototype.GetIssuer = function (certIssuerName) {
  return this.extract(certIssuerName, "CN=")
}

CertificateAdjuster.prototype.GetCertInfoString = function (certSubjectName, certFromDate) {
  return this.extract(certSubjectName, "CN=") + "; Выдан: " + this.GetCertDate(certFromDate)
}

// Получаем ИНФУ о ЭЦП Browser plug-in и версии Криптопровайдера
export async function CheckForPlugIn() {
  let result = {
    PlugInEnabled: false,
    PlugInEnabledTxt: "ЭЦП Browser plug-in - не загружен",
    CspEnabled: false,
    CspEnabledTxt: "Криптопровайдер - не загружен",
  }
  async function getVersion(ObjectVersion) {
    if (typeof ObjectVersion == "string") return result
    return await window.cadesplugin.async_spawn(function* () {
      try {
        result.PlugInVersionTxt = "Версия плагина: " + (yield ObjectVersion.toString())
        result.PlugInEnabled = true
        var oAbout = yield window.cadesplugin.CreateObjectAsync("CAdESCOM.About")
        var ver = yield oAbout.CSPVersion("", 80)
        var ret = (yield ver.MajorVersion) + "." + (yield ver.MinorVersion) + "." + (yield ver.BuildVersion)
        if (ret) result.CSPVersionTxt = "Версия криптопровайдера: " + ret
        var sCSPName = yield oAbout.CSPName(80)
        result.CspEnabled = true
        result.CspEnabledTxt = "Криптопровайдер - загружен"
        result.CSPNameTxt = "Криптопровайдер: " + sCSPName
      } catch (err) {
        result.CspEnabledTxt = "Криптопровайдер - не загружен: " + err.message
      }
      return result
    }, result)
  }
  return await window.cadesplugin.async_spawn(function* () {
    const oAbout = yield window.cadesplugin.CreateObjectAsync("CAdESCOM.About")
    if (oAbout) {
      result.PlugInEnabledTxt = "ЭЦП Browser plug-in - загружен"
      const CurrentPluginVersion = yield oAbout.PluginVersion
      result = yield getVersion(CurrentPluginVersion)
    }
    return result
  }, result)
}

// function onCertificateSelected(event) {
//   cadesplugin.async_spawn(function* (args) {
//     var selectedCertID = args[0][args[0].selectedIndex].value
//     var certificate = global_selectbox_container[selectedCertID]
//     FillCertInfo_Async(certificate, event.target.boxId, global_isFromCont[selectedCertID])
//   }, event.target) //cadesplugin.async_spawn
// }
const CertStatusEmoji = (isValid) => (isValid ? "\u2705" : "\u274C")
// получаем сертификаты из хранилища

async function getESCertInfo(cert) {
  return await window.cadesplugin.async_spawn(function* () {
    let oOpt = {}
    const Now = Date.now()
    const ValidFromDate = new Date(yield cert.ValidFromDate)
    const ValidToDate = new Date(yield cert.ValidToDate)
    const hasPrivateKey = yield cert.HasPrivateKey()
    let IsValid = true
    try {
      const Validator = yield cert.IsValid()
      IsValid = yield Validator.Result
    } catch (ex) {
      alert("Ошибка при чтении сертификата ЭЦП: " + window.cadesplugin.getLastError(ex))
    }
    if (Now < ValidFromDate.getTime()) {
      oOpt.status = "Срок действия не наступил"
    } else if (Now > ValidToDate.getTime()) {
      oOpt.status = "Срок действия истек"
    } else if (!hasPrivateKey) {
      oOpt.status = "Нет привязки к закрытому ключу"
    } else if (!IsValid) {
      oOpt.status =
        "Ошибка при проверке цепочки сертификатов. Возможно на компьютере не установлены сертификаты УЦ, выдавшего ваш сертификат"
    } else {
      oOpt.status = STATUS_OK
    }
    try {
      const emoji = CertStatusEmoji(IsValid)
      oOpt.text = emoji + new CertificateAdjuster().GetCertInfoString(yield cert.SubjectName, ValidFromDate)
      oOpt.serialNumber = yield cert.SerialNumber
    } catch (ex) {
      alert("Ошибка при чтении сертификата ЭЦП: " + window.cadesplugin.getLastError(ex))
    }
    return oOpt
  })
}
export async function FillCAdESList() {
  return await window.cadesplugin.async_spawn(function* () {
    var MyStoreExists = true
    try {
      var oStore = yield window.cadesplugin.CreateObjectAsync("CAdESCOM.Store")
      if (!oStore) {
        alert("Ошибка доступа к хранилищу сертификатов ЭЦП")
        return false
      }
      yield oStore.Open()
    } catch (ex) {
      alert("Ошибка открытия хранилища сертификатов ЭЦП")
      MyStoreExists = false
    }
    let result = {
      certsList: [],
      infoList: [],
    }
    let certs = undefined
    let certCnt = 0
    if (MyStoreExists) {
      try {
        certs = yield oStore.Certificates
        certCnt = yield certs.Count
      } catch (ex) {
        result.err = "Ошибка при получении связки ЭЦП-сертификатов или их числа: " + window.cadesplugin.getLastError(ex)
      }
      for (var i = 1; i <= certCnt; i++) {
        try {
          const cert = yield certs.Item(i)
          result.certsList.push(cert)
        } catch (ex) {
          result.err = "Ошибка при перечислении ЭЦП-сертификатов хранилища: " + window.cadesplugin.getLastError(ex)
        }
      }
      yield oStore.Close()
    }

    //В версии плагина 2.0.13292+ есть возможность получить сертификаты из
    //закрытых ключей и не установленных в хранилище
    try {
      yield oStore.Open(window.cadesplugin.CADESCOM_CONTAINER_STORE)
      const certsEXT = yield oStore.Certificates
      for (var k = 1; k < certsEXT.length; k++) {
        const cert = yield certsEXT.Item(k)
        //Проверяем не добавляли ли мы такой сертификат уже?
        let found = false
        for (var j = 0; j < certs.length; j++) {
          if ((yield certs[j].SerialNumber) === (yield cert.SerialNumber)) {
            found = true
            break
          }
        }
        if (found) continue
        result.certsList.push(cert)
      }
      for (i = 0; i < result.certsList.length; i++) {
        try {
          //const cert = yield
          const option_info = yield getESCertInfo(result.certsList[i])
          if (option_info) result.infoList.push({ ...option_info })
        } catch (ex) {
          result.err = "Ошибка при чтении списка ЭЦП-сертификатов: " + window.cadesplugin.getLastError(ex)
        }
      }
      yield oStore.Close()
      return result
    } catch (ex) {
      alert("Ошибка при перечислении ЭЦП-сертификатов контенера")
    }
  })
}

export async function SignCadesXML(certificate, dataToSign) {
  let result = {}
  return await window.cadesplugin.async_spawn(
    function* (arg) {
      try {
        let errormes = ""
        try {
          var oSigner = yield window.cadesplugin.CreateObjectAsync("CAdESCOM.CPSigner")
        } catch (err) {
          errormes = "Failed to create CAdESCOM.CPSigner: " + err.number
          throw errormes
        }
        if (oSigner) {
          yield oSigner.propset_Certificate(certificate)
        } else {
          errormes = "Failed to create CAdESCOM.CPSigner"
          throw errormes
        }
        var oSignedXML = yield window.cadesplugin.CreateObjectAsync("CAdESCOM.SignedXML")

        var signMethod = ""
        var digestMethod = ""

        var pubKey = yield certificate.PublicKey()
        var algo = yield pubKey.Algorithm
        var algoOid = yield algo.Value
        if (algoOid === "1.2.643.7.1.1.1.1") {
          // алгоритм подписи ГОСТ Р 34.10-2012 с ключом 256 бит
          signMethod = "urn:ietf:params:xml:ns:cpxmlsec:algorithms:gostr34102012-gostr34112012-256"
          digestMethod = "urn:ietf:params:xml:ns:cpxmlsec:algorithms:gostr34112012-256"
        } else if (algoOid === "1.2.643.7.1.1.1.2") {
          // алгоритм подписи ГОСТ Р 34.10-2012 с ключом 512 бит
          signMethod = "urn:ietf:params:xml:ns:cpxmlsec:algorithms:gostr34102012-gostr34112012-512"
          digestMethod = "urn:ietf:params:xml:ns:cpxmlsec:algorithms:gostr34112012-512"
        } else if (algoOid === "1.2.643.2.2.19") {
          // алгоритм ГОСТ Р 34.10-2001
          signMethod = "urn:ietf:params:xml:ns:cpxmlsec:algorithms:gostr34102001-gostr3411"
          digestMethod = "urn:ietf:params:xml:ns:cpxmlsec:algorithms:gostr3411"
        } else {
          errormes =
            "Данная демо страница поддерживает XML подпись сертификатами с алгоритмом ГОСТ Р 34.10-2012, ГОСТ Р 34.10-2001"
          throw errormes
        }
        const CADESCOM_XML_SIGNATURE_TYPE_ENVELOPED = window.cadesplugin.CADESCOM_XMLDSIG_TYPE
        if (dataToSign) {
          // Данные на подпись ввели
          yield oSignedXML.propset_Content(dataToSign)
        }
        yield oSignedXML.propset_SignatureType(CADESCOM_XML_SIGNATURE_TYPE_ENVELOPED)
        yield oSignedXML.propset_SignatureMethod(signMethod)
        yield oSignedXML.propset_DigestMethod(digestMethod)
        try {
          result.signature = yield oSignedXML.Sign(oSigner)
        } catch (err) {
          errormes = "Не удалось создать подпись из-за ошибки: " + window.cadesplugin.getLastError(err)
          throw errormes
        }

        result.signatureTxt = "Подпись сформирована успешно:"
      } catch (err) {
        result.signatureTxt = "Возникла ошибка:" + err
      }
      return result
    },
    certificate,
    dataToSign
  ) //cadesplugin.async_spawn
}
export async function SignCadesBES(certificate, dataToSign, setDisplayData) {
  const cadesplugin = window.cadesplugin
  let result = {}
  return await cadesplugin.async_spawn(function* (arg) {
    const data = Base64.encode(dataToSign)
    try {
      //FillCertInfo_Async(certificate);
      try {
        const oSigner = yield cadesplugin.CreateObjectAsync("CAdESCOM.CPSigner")
        const oSigningTimeAttr = yield cadesplugin.CreateObjectAsync("CADESCOM.CPAttribute")
        yield oSigningTimeAttr.propset_Name(cadesplugin.CAPICOM_AUTHENTICATED_ATTRIBUTE_SIGNING_TIME)
        const oTimeNow = new Date()
        yield oSigningTimeAttr.propset_Value(oTimeNow)
        const attr = yield oSigner.AuthenticatedAttributes2
        yield attr.Add(oSigningTimeAttr)
        const oDocumentNameAttr = yield cadesplugin.CreateObjectAsync("CADESCOM.CPAttribute")
        yield oDocumentNameAttr.propset_Name(cadesplugin.CADESCOM_AUTHENTICATED_ATTRIBUTE_DOCUMENT_NAME)
        yield oDocumentNameAttr.propset_Value("Document Name")
        yield attr.Add(oDocumentNameAttr)
        if (oSigner) {
          yield oSigner.propset_Certificate(certificate)
        } else {
          result.errormes = "Failed to create CAdESCOM.CPSigner"
          return result
        }
        const oSignedData = yield cadesplugin.CreateObjectAsync("CAdESCOM.CadesSignedData")
        if (data) {
          // Данные на подпись ввели
          yield oSignedData.propset_ContentEncoding(cadesplugin.CADESCOM_BASE64_TO_BINARY) //
          yield oSignedData.propset_Content(data)
        }
        yield oSigner.propset_Options(cadesplugin.CAPICOM_CERTIFICATE_INCLUDE_WHOLE_CHAIN)
        if (setDisplayData) {
          //Set display data flag flag for devices like Rutoken PinPad
          yield oSignedData.propset_DisplayData(1)
        }
        try {
          result.signature = yield oSignedData.SignCades(oSigner, cadesplugin.CADESCOM_CADES_BES)
          result.signatureTxt = "Подпись сформирована успешно"
        } catch (err) {
          result.errormes = "Не удалось создать подпись из-за ошибки: " + cadesplugin.getLastError(err)
          return result
        }
      } catch (err) {
        result.errormes = `Возникла ошибка: ${err}`
        return result
      }
    } catch (err) {
      result.errormes = "Failed to create CAdESCOM.CPSigner: " + err.number
      return result
    }
    return result
  }, certificate) //cadesplugin.async_spawn
}
