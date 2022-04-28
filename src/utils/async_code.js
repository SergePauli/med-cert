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

// Получаем ИНФУ о плагине и версии КриптоПро CSP
export function CheckForPlugIn() {
  let result = {
    PlugInEnabled: true,
    PlugInEnabledTxt: "Плагин загружен",
    CspEnabled: false,
    CspEnabledTxt: "КриптоПро CSP не загружен",
  }
  function getVersion_Async(ObjectVersion, rFunction) {
    if (typeof ObjectVersion == "string") return -1
    window.cadesplugin.async_spawn(function* () {
      result.PlugInVersionTxt = "Версия плагина: " + (yield ObjectVersion.toString())
      var oAbout = yield window.cadesplugin.CreateObjectAsync("CAdESCOM.About")
      var ver = yield oAbout.CSPVersion("", 80)
      var ret = (yield ver.MajorVersion) + "." + (yield ver.MinorVersion) + "." + (yield ver.BuildVersion)
      if (ret) result.CSPVersionTxt = "Версия криптопровайдера: " + ret
      try {
        var sCSPName = yield oAbout.CSPName(80)
        result.CspEnabled = true
        result.CspEnabledTxt = "Криптопровайдер загружен"
        result.CSPNameTxt = "Криптопровайдер: " + sCSPName
      } catch (err) {}
    })
  }
  window.cadesplugin.async_spawn(function* () {
    const oAbout = yield window.cadesplugin.CreateObjectAsync("CAdESCOM.About")
    if (oAbout) {
      const CurrentPluginVersion = yield oAbout.PluginVersion
      getVersion_Async(CurrentPluginVersion)
      return result
    } else return false
  }, result)
  return result
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
export const getESCertInfo = (cert) => {
  let oOpt = {}
  try {
    const ValidFromDate = new Date(cert.ValidFromDate)
    const ValidToDate = new Date(cert.ValidToDate)
    const IsValid = ValidToDate > Date.now()
    const emoji = CertStatusEmoji(IsValid)
    oOpt.text = emoji + new CertificateAdjuster().GetCertInfoString(cert.SubjectName, ValidFromDate)
    oOpt.value = cert.Thumbprint
    return oOpt
  } catch (ex) {
    alert("Ошибка при получении свойства SubjectName: " + window.cadesplugin.getLastError(ex))
  }
}
export function FillCertList_Async() {
  window.cadesplugin.async_spawn(function* () {
    var MyStoreExists = true
    try {
      var oStore = yield window.cadesplugin.CreateObjectAsync("CAdESCOM.Store")
      if (!oStore) {
        alert("Create store failed")
        return false
      }
      yield oStore.Open()
    } catch (ex) {
      MyStoreExists = false
    }
    let result = undefined
    let certs = undefined
    if (MyStoreExists) {
      try {
        certs = yield oStore.Certificates
      } catch (ex) {
        alert("Ошибка при получении EDSCertificates или Count: " + window.cadesplugin.getLastError(ex))
        return false
      }
      for (var i = 1; i <= certs.length; i++) {
        try {
          const cert = yield certs.Item(i)
          result.push(cert)
        } catch (ex) {
          alert("Ошибка при перечислении ЭЦП-сертификатов: " + window.cadesplugin.getLastError(ex))
          return false
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
          if ((yield certs[j].Thumbprint) === (yield cert.Thumbprint)) {
            found = true
            break
          }
        }
        if (found) continue
        result.push(cert)
      }
      yield oStore.Close()
    } catch (ex) {
      alert("Ошибка при перечислении ЭЦП-сертификатов контенера")
    }
    return result
  })
}

export function SignCadesXML_Async(certificate, dataToSign, signatureType) {
  let result = {}
  window.cadesplugin.async_spawn(
    function* (arg) {
      if (!certificate) {
        alert("Select certificate")
        return false
      }

      try {
        //FillCertInfo_Async(certificate);
        var errormes = ""
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

        var CADESCOM_XML_SIGNATURE_TYPE_ENVELOPED = 0 | arg[1] //arg[1] = signatureType
        if (arg[1] > window.cadesplugin.CADESCOM_XADES_BES) {
          var tspService = document.getElementById("TSPServiceTxtBox").value
          yield oSigner.propset_TSAAddress(tspService)
        }
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
    dataToSign,
    signatureType
  ) //cadesplugin.async_spawn
}

export function FillCertInfo_Async(certificate, certBoxId, isFromContainer) {
  var BoxId
  var field_prefix
  if (typeof certBoxId == "undefined" || certBoxId === "CertListBox") {
    BoxId = "cert_info"
    field_prefix = ""
  } else if (certBoxId === "CertListBox1") {
    BoxId = "cert_info1"
    field_prefix = "cert_info1"
  } else if (certBoxId === "CertListBox2") {
    BoxId = "cert_info2"
    field_prefix = "cert_info2"
  } else {
    BoxId = certBoxId
    field_prefix = certBoxId
  }
  window.cadesplugin.async_spawn(
    function* (args) {
      var Adjust = new CertificateAdjuster()

      var ValidToDate = new Date(yield args[0].ValidToDate)
      var ValidFromDate = new Date(yield args[0].ValidFromDate)
      var Validator
      var IsValid = false
      //если попадется сертификат с неизвестным алгоритмом
      //тут будет исключение. В таком сертификате просто пропускаем такое поле
      try {
        Validator = yield args[0].IsValid()
        IsValid = yield Validator.Result
      } catch (e) {}
      var hasPrivateKey = yield args[0].HasPrivateKey()
      var Now = new Date()

      document.getElementById(args[1]).style.display = ""
      document.getElementById(args[2] + "subject").innerHTML =
        "Владелец: <b>" + Adjust.GetCertName(yield args[0].SubjectName) + "<b>"
      document.getElementById(args[2] + "issuer").innerHTML =
        "Издатель: <b>" + Adjust.GetIssuer(yield args[0].IssuerName) + "<b>"
      document.getElementById(args[2] + "from").innerHTML = "Выдан: <b>" + Adjust.GetCertDate(ValidFromDate) + " UTC<b>"
      document.getElementById(args[2] + "till").innerHTML =
        "Действителен до: <b>" + Adjust.GetCertDate(ValidToDate) + " UTC<b>"
      var pubKey = yield args[0].PublicKey()
      var algo = yield pubKey.Algorithm
      var fAlgoName = yield algo.FriendlyName
      document.getElementById(args[2] + "algorithm").innerHTML = "Алгоритм ключа: <b>" + fAlgoName + "<b>"
      if (hasPrivateKey) {
        var oPrivateKey = yield args[0].PrivateKey
        var sProviderName = yield oPrivateKey.ProviderName
        document.getElementById(args[2] + "provname").innerHTML = "Криптопровайдер: <b>" + sProviderName + "<b>"
        try {
          var sPrivateKeyLink = yield oPrivateKey.UniqueContainerName
          document.getElementById(args[2] + "privateKeyLink").innerHTML =
            "Ссылка на закрытый ключ: <b>" + sPrivateKeyLink + "<b>"
        } catch (e) {
          document.getElementById(args[2] + "privateKeyLink").innerHTML =
            "Ссылка на закрытый ключ: <b>" + e.message + "<b>"
        }
      } else {
        document.getElementById(args[2] + "provname").innerHTML = "Криптопровайдер:<b>"
        document.getElementById(args[2] + "privateKeyLink").innerHTML = "Ссылка на закрытый ключ:<b>"
      }
      if (Now < ValidFromDate) {
        document.getElementById(args[2] + "status").innerHTML =
          'Статус: <span style="color:red; font-weight:bold; font-size:16px"><b>Срок действия не наступил</b></span>'
      } else if (Now > ValidToDate) {
        document.getElementById(args[2] + "status").innerHTML =
          'Статус: <span style="color:red; font-weight:bold; font-size:16px"><b>Срок действия истек</b></span>'
      } else if (!hasPrivateKey) {
        document.getElementById(args[2] + "status").innerHTML =
          'Статус: <span style="color:red; font-weight:bold; font-size:16px"><b>Нет привязки к закрытому ключу</b></span>'
      } else if (!IsValid) {
        document.getElementById(args[2] + "status").innerHTML =
          'Статус: <span style="color:red; font-weight:bold; font-size:16px"><b>Ошибка при проверке цепочки сертификатов. Возможно на компьютере не установлены сертификаты УЦ, выдавшего ваш сертификат</b></span>'
      } else {
        document.getElementById(args[2] + "status").innerHTML = "Статус: <b> Действителен<b>"
      }

      if (args[3]) {
        document.getElementById(field_prefix + "location").innerHTML = "Установлен в хранилище: <b>Нет</b>"
      } else {
        document.getElementById(field_prefix + "location").innerHTML = "Установлен в хранилище: <b>Да</b>"
      }
    },
    certificate,
    BoxId,
    field_prefix,
    isFromContainer
  ) //cadesplugin.async_spawn
}
