import { autorun, configure, makeAutoObservable } from "mobx"
import Certificate from "../models/FormsData/Certificate"
import { IPatient } from "../models/IPatient"
import { ISuggestions } from "../models/ISuggestions"
import { ICertificate } from "../models/responses/ICertificate"
import { IUserInfo } from "../models/responses/IUserInfo"
import { DISEASE_DEADTH_KIND } from "../NSI/1.2.643.5.1.13.13.99.2.21"
import CertificateService from "../services/CertificateService"
import {
  AUTHENTICATOR_SUG,
  AUTHOR_SUG,
  BASIS_DERMINING_SUG,
  CERT_DEATH_THIME_SUG,
  CERT_TYPE_SUG,
  CHILD_WEIGHT_SUG,
  DEATH_AREA_SUG,
  DEATH_KINDS_SUG,
  DEATH_PLACE_SUG,
  DEATH_PLACE_TYPE_SUG,
  DEFAULT_CERT_SUGGESTIONS,
  EDUCATION_LEVEL_SUG,
  EST_MEDIC_SUG,
  EXT_REASON_SUG,
  EXT_REASON_TIME_SUG,
  IDNUMBER_SUG,
  IDSERIES_SUG,
  ID_CARD_TYPES,
  IORGCODE_SUG,
  IORGDATE_SUG,
  IORGNAME_SUG,
  KIND_DEATH_REASON_SUG,
  LEGAL_AUTHENTICATOR_SUG,
  LIFE_AREA_SUG,
  LIFE_PLACE_SUG,
  MARITAL_STATUS_SUG,
  MOTHER_ADDRESS_SUG,
  MOTHER_BIRTHDAY_SUG,
  MOTHER_FIO_SUG,
  NUMBER_PREGNANCY_SUG,
  OMS_SUG,
  PASSPORT_RF,
  PATIENT_BIRTHDAY_SUG,
  PATIENT_GENDER_SUG,
  PERSON_NAME_SUG,
  PREGNANCY_CONNECTION_SUG,
  REASON_A_SUG,
  REASON_A_TIME_SUG,
  REASON_B_SUG,
  REASON_B_TIME_SUG,
  REASON_C_SUG,
  REASON_C_TIME_SUG,
  REASON_D_SUG,
  REASON_D_TIME_SUG,
  SNILS_SUG,
  SOCIAL_STATUS_SUG,
  TERMS_PREGNANCY_SUG,
  TRAFFFIC_ACCIDENT_SUG,
} from "../utils/defaults"
configure({
  enforceActions: "never",
})
export default class CertificateStore {
  private _cert: Certificate
  private _suggestions: ISuggestions[]
  private _identified: boolean
  private _fromRelatives: boolean
  private _submitted: boolean
  private _userInfo?: IUserInfo | undefined
  private _certs: ICertificate[]
  private _selected: number
  disposers: (() => void)[]
  constructor() {
    this._submitted = false
    this.disposers = []
    this._certs = []
    this._cert = new Certificate({
      custodian: this._userInfo?.organization,
      patient: {
        organization_id: this._userInfo?.organization.id,
        identity: {
          identity_card_type_id: ID_CARD_TYPES[PASSPORT_RF].code,
        },
        person: { person_name: { family: "", given_1: "", given_2: "" } },
      } as IPatient,
    } as ICertificate)
    this._identified = true
    this._fromRelatives = false
    this._suggestions = DEFAULT_CERT_SUGGESTIONS
    this._selected = 0
    makeAutoObservable(this)

    // проверки полноты заполнения свидетельства
    // работают как реакции на изменение данных
    this.disposers[0] = autorun(() => {})

    this.disposers[1] = autorun(() => {
      this._suggestions[CERT_TYPE_SUG].done = !!this._cert.certType
    })

    this.disposers[2] = autorun(() => {
      this._suggestions[PATIENT_GENDER_SUG].done = !!this._cert.patient.gender
    })
    this.disposers[3] = autorun(() => {
      if (!this._cert) return
      const patient = this._cert.patient
      const isBirthDay =
        !patient.birth_date && patient.nullFlavors.findIndex((element) => element.parent_attr === "birth_date") === -1
      this._suggestions[PATIENT_BIRTHDAY_SUG].done = !isBirthDay
    })
    this.disposers[4] = autorun(() => {
      if (!this._cert) return
      const cert = this._cert
      const isDeathDay =
        !cert.deathDatetime && cert.nullFlavors.findIndex((element) => element.parent_attr === "death_datetime") === -1
      this._suggestions[CERT_DEATH_THIME_SUG].done = !isDeathDay
    })
    this.disposers[5] = autorun(() => {
      if (!this._cert) return
      const person = this._cert.patient.person
      const isSNILS =
        !person ||
        ((!person.SNILS || person.SNILS.length < 14) &&
          person.nullFlavors.findIndex((element) => element.parent_attr === "SNILS") === -1)
      this._suggestions[SNILS_SUG].done = !isSNILS
    })
    this.disposers[6] = autorun(() => {
      if (!this._cert) return
      const oms = this._cert.policyOMS
      const isOMS =
        (!oms || oms.length < 7) &&
        this._cert.nullFlavors.findIndex((element) => element.parent_attr === "policy_OMS") === -1
      this._suggestions[OMS_SUG].done = !isOMS
    })
    this.disposers[7] = autorun(() => {
      if (!this._cert) return
      const patient = this._cert.patient
      const identity = patient.identity
      const code = identity?.issueOrgCode
      const isCODE =
        (!identity && patient.nullFlavors.findIndex((element) => element.parent_attr === "identity") === -1) ||
        (identity &&
          (!code || code.length < 1) &&
          identity.nullFlavors.findIndex((element) => element.parent_attr === "issueOrgCode") === -1)
      this._suggestions[IORGCODE_SUG].done = !isCODE
    })
    this.disposers[8] = autorun(() => {
      if (!this._cert) return
      const patient = this._cert.patient
      const isIORGDate =
        (!patient.identity && patient.nullFlavors.findIndex((element) => element.parent_attr === "identity") === -1) ||
        (patient.identity && !patient.identity?.issueOrgDate)
      this._suggestions[IORGDATE_SUG].done = !isIORGDate
    })
    this.disposers[9] = autorun(() => {
      if (!this._cert) return
      const patient = this._cert.patient
      const isIORGName =
        (!patient.identity && patient.nullFlavors.findIndex((element) => element.parent_attr === "identity") === -1) ||
        (patient.identity && (!patient.identity?.issueOrgName || patient.identity.issueOrgName.length < 15))
      this._suggestions[IORGNAME_SUG].done = !isIORGName
    })
    this.disposers[10] = autorun(() => {
      if (!this._cert) return
      const patient = this._cert.patient
      const identity = patient.identity
      const series = patient.identity?.series
      const isIDSeries =
        (!identity && patient.nullFlavors.findIndex((element) => element.parent_attr === "identity") === -1) ||
        (identity &&
          (!series || series.length < 1) &&
          identity.nullFlavors.findIndex((element) => element.parent_attr === "series") === -1)
      this._suggestions[IDSERIES_SUG].done = !isIDSeries
    })
    this.disposers[11] = autorun(() => {
      if (!this._cert) return
      const patient = this._cert.patient
      const isIDNumber =
        (!patient.identity && patient.nullFlavors.findIndex((element) => element.parent_attr === "identity") === -1) ||
        (patient.identity && !patient.identity?.number)
      this._suggestions[IDNUMBER_SUG].done = !isIDNumber
    })
    this.disposers[12] = autorun(() => {
      const person = this._cert.patient.person
      const isLifeArea =
        !person ||
        ((!person.address ||
          !person.address.streetAddressLine ||
          person.address.streetAddressLine.split(",").length < 3) &&
          person.nullFlavors.findIndex((element) => element.parent_attr === "address") === -1)
      this._suggestions[LIFE_PLACE_SUG].done = !isLifeArea
    })
    this.disposers[13] = autorun(() => {
      const isDeathArea =
        (!this._cert.deathAddr ||
          !this._cert.deathAddr.streetAddressLine ||
          this._cert.deathAddr.streetAddressLine.split(",").length < 3) &&
        this._cert.nullFlavors.findIndex((element) => element.parent_attr === "death_addr") === -1
      this._suggestions[DEATH_PLACE_SUG].done = !isDeathArea
    })
    this.disposers[14] = autorun(() => {
      if (!this._cert) return
      const isDeathAreaType =
        this._cert.deathAreaType === undefined &&
        this._cert.nullFlavors.findIndex((element) => element.parent_attr === "death_area_type") === -1
      this._suggestions[DEATH_AREA_SUG].done = !isDeathAreaType
    })
    this.disposers[15] = autorun(() => {
      if (!this._cert) return
      const isLifeAreaType =
        this._cert.lifeAreaType === undefined &&
        this._cert.nullFlavors.findIndex((element) => element.parent_attr === "life_area_type") === -1
      this._suggestions[LIFE_AREA_SUG].done = !isLifeAreaType
    })
    this.disposers[16] = autorun(() => {
      if (!this._cert) return
      this._suggestions[DEATH_PLACE_TYPE_SUG].done = this._cert.deathPlace !== undefined
    })
    this.disposers[17] = autorun(() => {
      if (!this._cert) return
      const childInfo = this._cert.childInfo
      const isTERMS_PREGNANCY =
        childInfo === undefined ||
        childInfo.termPregnancy !== undefined ||
        childInfo.nullFlavors.findIndex((element) => element.parent_attr === "term_pregnancy") !== -1
      this._suggestions[TERMS_PREGNANCY_SUG].done = isTERMS_PREGNANCY
    })
    this.disposers[18] = autorun(() => {
      if (!this._cert) return
      const childInfo = this._cert.childInfo
      const isCHILD_WEIGHT = childInfo === undefined || childInfo.weight !== undefined
      this._suggestions[CHILD_WEIGHT_SUG].done = isCHILD_WEIGHT
    })
    this.disposers[19] = autorun(() => {
      if (!this._cert) return
      const childInfo = this._cert.childInfo
      const isNUMBER_PREGNANCY = !childInfo || !!childInfo.whichAccount
      this._suggestions[NUMBER_PREGNANCY_SUG].done = isNUMBER_PREGNANCY
    })
    this.disposers[20] = autorun(() => {
      if (!this._cert) return
      const childInfo = this._cert.childInfo
      const isMOTHER_FIO =
        !childInfo ||
        (!!childInfo.relatedSubject &&
          (childInfo.relatedSubject.nullFlavors.findIndex((item) => item.parent_attr === "person_name") !== -1 ||
            !!childInfo.relatedSubject.fio))
      this._suggestions[MOTHER_FIO_SUG].done = isMOTHER_FIO
    })
    this.disposers[21] = autorun(() => {
      if (!this._cert) return
      const childInfo = this._cert.childInfo
      const isMOTHER_BIRTHDAY =
        !childInfo ||
        (!!childInfo.relatedSubject &&
          (childInfo.relatedSubject.nullFlavors.findIndex((item) => item.parent_attr === "birthTime") !== -1 ||
            !!childInfo.relatedSubject.birthTime))
      this._suggestions[MOTHER_BIRTHDAY_SUG].done = isMOTHER_BIRTHDAY
    })
    this.disposers[22] = autorun(() => {
      if (!this._cert) return
      const childInfo = this._cert.childInfo
      const isMOTHER_ADDRESS =
        !childInfo ||
        (!!childInfo.relatedSubject &&
          (childInfo.relatedSubject.nullFlavors.findIndex((item) => item.parent_attr === "addr") !== -1 ||
            (!!childInfo.relatedSubject.addr && !!childInfo.relatedSubject.addr.houseGUID)))
      this._suggestions[MOTHER_ADDRESS_SUG].done = isMOTHER_ADDRESS
    })
    this.disposers[23] = autorun(() => {
      this._suggestions[MARITAL_STATUS_SUG].done = !!this._cert && !!this._cert.maritalStatus
    })
    this.disposers[24] = autorun(() => {
      this._suggestions[EDUCATION_LEVEL_SUG].done = !!this._cert && !!this._cert.educationLevel
    })
    this.disposers[25] = autorun(() => {
      this._suggestions[SOCIAL_STATUS_SUG].done = !!this._cert && !!this._cert.socialStatus
    })
    this.disposers[26] = autorun(() => {
      this._suggestions[DEATH_KINDS_SUG].done = !!this._cert && !!this._cert.deathKind
    })
    this.disposers[27] = autorun(() => {
      if (!this._cert) return
      this._suggestions[KIND_DEATH_REASON_SUG].done =
        (!!this._cert.deathKind && this._cert.deathKind === DISEASE_DEADTH_KIND) ||
        (!!this._cert.extReasonTime && !!this._cert.extReasonDescription)
    })
    this.disposers[28] = autorun(() => {
      if (!this._cert) return
      this._suggestions[EST_MEDIC_SUG].done = !!this._cert.establishedMedic
    })
    this.disposers[29] = autorun(() => {
      if (!this._cert) return
      this._suggestions[BASIS_DERMINING_SUG].done = !!this._cert.basisDetermining
    })
    this.disposers[30] = autorun(() => {
      if (!this._cert) return
      this._suggestions[REASON_A_SUG].done = !!this._cert.reasonA?.diagnosis
    })
    this.disposers[31] = autorun(() => {
      if (!this._cert) return
      this._suggestions[REASON_A_TIME_SUG].done = !!this._cert.reasonA?.effectiveTime
    })
    this.disposers[32] = autorun(() => {
      if (!this._cert) return
      this._suggestions[REASON_B_SUG].done =
        !!this._cert.reasonB?.diagnosis ||
        this._cert.nullFlavors.findIndex((item) => item.parent_attr === "b_reason" && !item._destroy) !== -1
    })
    this.disposers[33] = autorun(() => {
      if (!this._cert) return
      this._suggestions[REASON_B_TIME_SUG].done =
        !this._cert.reasonB ||
        !!this._cert.reasonB.effectiveTime ||
        this._cert.reasonB?.nullFlavors.findIndex((item) => item.parent_attr === "effective_time" && !item._destroy) !==
          -1
    })
    this.disposers[34] = autorun(() => {
      if (!this._cert) return
      this._suggestions[REASON_C_SUG].done =
        !!this._cert.reasonC?.diagnosis ||
        this._cert.nullFlavors.findIndex((item) => item.parent_attr === "c_reason" && !item._destroy) !== -1
    })
    this.disposers[35] = autorun(() => {
      if (!this._cert) return
      this._suggestions[REASON_C_TIME_SUG].done =
        !this._cert.reasonC ||
        !!this._cert.reasonC.effectiveTime ||
        this._cert.reasonC?.nullFlavors.findIndex((item) => item.parent_attr === "effective_time" && !item._destroy) !==
          -1
    })
    this.disposers[36] = autorun(() => {
      if (!this._cert) return
      this._suggestions[REASON_D_SUG].done =
        this._cert.reasonD?.diagnosis !== undefined ||
        this._cert.nullFlavors.findIndex((item) => item.parent_attr === "d_reason" && !item._destroy) !== -1
    })
    this.disposers[37] = autorun(() => {
      if (!this._cert) return
      this._suggestions[REASON_D_TIME_SUG].done =
        !this._cert.reasonD ||
        !!this._cert.reasonD.effectiveTime ||
        this._cert.reasonD?.nullFlavors.findIndex((item) => item.parent_attr === "effective_time" && !item._destroy) !==
          -1
    })
    this.disposers[38] = autorun(() => {
      if (!this._cert) return
      this._suggestions[TRAFFFIC_ACCIDENT_SUG].done =
        !!this._cert.trafficAccident ||
        this._cert.nullFlavors.findIndex((item) => item.parent_attr === "traffic_accident" && !item._destroy) !== -1
    })
    this.disposers[39] = autorun(() => {
      if (!this._cert) return
      this._suggestions[PREGNANCY_CONNECTION_SUG].done =
        !!this._cert.pregnancyConnection ||
        this._cert.nullFlavors.findIndex((item) => item.parent_attr === "pregnancy_connection" && !item._destroy) !== -1
    })
    this.disposers[40] = autorun(() => {
      if (!this._cert) return
      this._suggestions[AUTHOR_SUG].done = !!this._cert.author
    })
    this.disposers[41] = autorun(() => {
      if (!this._cert) return
      this._suggestions[AUTHENTICATOR_SUG].done = !!this._cert.authenticator
    })
    this.disposers[42] = autorun(() => {
      if (!this._cert) return
      this._suggestions[LEGAL_AUTHENTICATOR_SUG].done = !!this._cert.legalAuthenticator
    })
    this.disposers[43] = autorun(() => {
      if (!this._cert) return
      this._identified = !!this._cert.patient.person
    })
    this.disposers[44] = autorun(() => {
      if (!this._cert) return
      this._fromRelatives = this._identified && this._cert.patient && !this._cert.patient.identity
    })
    this.disposers[45] = autorun(() => {
      const person = this._cert.patient?.person
      const fio = person?.fio
      const isPersonNameSug =
        !person ||
        (!!fio &&
          (fio.family.trim().length === 0 ||
            fio.given_1.trim().length === 0 ||
            (!!fio.given_2 && fio.given_2.trim().length === 0)))
      this._suggestions[PERSON_NAME_SUG].done = !isPersonNameSug
    })
  }

  get cert() {
    return this._cert
  }
  set cert(value: Certificate) {
    this._cert = value
  }
  get identified() {
    return this._identified
  }
  set identified(identified: boolean) {
    this._identified = identified
  }

  get fromRelatives() {
    return this._fromRelatives
  }

  set fromRelatives(value: boolean) {
    this._fromRelatives = value
    if (value) this.identified = true
  }

  get suggestions() {
    return this._suggestions
  }

  set suggestions(suggestions: ISuggestions[]) {
    this._suggestions = suggestions
  }

  get submitted(): boolean {
    return this._submitted
  }
  set submitted(value: boolean) {
    this._submitted = value
  }
  get certs(): ICertificate[] {
    return this._certs
  }
  // genSeries(userInfo: IUserInfo) {
  //   const today = new Date().toLocaleDateString()
  //   // номер версии системы у текуще - 3
  //   const version = "3"
  //   // последние 2 цифры года
  //   const yearNum = today.slice(-2)
  //   // 2 цифры месяца
  //   const monthNum = today.slice(3, 5)
  //   // 2 цифры номера рабочего места
  //   const userNum = userInfo.id.toString().padStart(4, "0")
  //   // Create series
  //   this.cert.series = `${version}${yearNum}${monthNum}${userNum}`
  // }
  redSuggestionsCount() {
    return this.suggestions.reduce((result, item, index) => {
      if (!(item.done || index === EXT_REASON_SUG || index === EXT_REASON_TIME_SUG)) ++result
      return result
    }, 0)
  }
  get userInfo(): IUserInfo | undefined {
    return this._userInfo
  }
  set userInfo(value: IUserInfo | undefined) {
    this._userInfo = value
  }
  createNew() {
    this._cert = new Certificate({
      custodian: this._userInfo?.organization,
      patient: {
        organization_id: this._userInfo?.organization.id,
        identity: {
          identity_card_type_id: ID_CARD_TYPES[PASSPORT_RF].code,
        },
        person: { person_name: { family: "", given_1: "", given_2: "" } },
      } as IPatient,
    } as ICertificate)
  }
  save() {
    if (!this._userInfo) return false
    if (!this._cert.patient.provider_organization)
      this._cert.patient.provider_organization = this.userInfo?.organization.id
    const request = this._cert.getAttributes()
    console.log("request", request)
    return !request.id
      ? CertificateService.addCertificate(request)
      : CertificateService.updateCertificate({ Certificate: request })
  }
  delete() {
    if (this._cert.id === -1) return false
    else return CertificateService.removeCertificate(this._cert.id)
  }

  clean(num = this._selected) {
    try {
      this._certs.splice(num)
    } catch {
      throw Error("Not valid certificate number")
    }
  }

  select(number = 0) {
    if (this._certs.length > 0) this._cert = new Certificate(this._certs[number])
    else this.createNew()
  }

  getList(doAfter?: () => void) {
    if (!this._userInfo) return false
    CertificateService.getCertificates({ q: { custudian_id_eq: this._userInfo.organization.id } })
      .then((response) => {
        this._certs = response.data
        console.log("response.data", response.data)
        this.select()
      })
      .catch((err) => console.log(err))
      .finally(() => {
        if (doAfter) doAfter()
      })
  }

  findById(certificate_id: number, doAfter?: () => void) {
    if (!this._userInfo) return false
    CertificateService.getCertificates({
      q: { custudian_id_eq: this._userInfo.organization.id, id_eq: certificate_id },
    })
      .then((response) => {
        if (response.data && response.data.length > 0) this._cert = new Certificate(response.data[0])
        console.log("response.data", response.data)
        this.certs.push(response.data[0])
      })
      .catch((err) => console.log(err))
      .finally(() => {
        if (doAfter) doAfter()
      })
  }
  dispose() {
    // So, to avoid subtle memory issues, always call the
    // disposers when the reactions are no longer needed.
    this.disposers.forEach((disposer) => disposer())
  }
}
