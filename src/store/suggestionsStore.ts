import { autorun, makeAutoObservable } from "mobx"
import { ISuggestions } from "../models/ISuggestions"
import { DISEASE_DEADTH_KIND } from "../NSI/1.2.643.5.1.13.13.99.2.21"
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
  PARTIPICIPANT_DATE_SUG,
  PARTIPICIPANT_FIO_SUG,
  PARTIPICIPANT_IDENTITY_SUG,
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
import CertificateStore from "./certificateStore"

export default class SuggestionsStore {
  private _cStore: CertificateStore
  private _suggestions: ISuggestions[]
  private _identified: boolean
  private _fromRelatives: boolean
  disposers: (() => void)[]
  constructor(cStore: CertificateStore) {
    this._cStore = cStore
    this.disposers = []
    this._identified = true
    this._fromRelatives = false
    this._suggestions = DEFAULT_CERT_SUGGESTIONS
    makeAutoObservable(this)
    // проверки полноты заполнения свидетельства
    // работают как реакции на изменение данных
    this.disposers[0] = autorun(() => {
      this._suggestions[CERT_TYPE_SUG].done = !!this._cStore.cert.certType
    })

    this.disposers[1] = autorun(() => {
      this._suggestions[PATIENT_GENDER_SUG].done = !!this._cStore.cert.patient.gender
    })
    this.disposers[2] = autorun(() => {
      if (!this._cStore.cert) return
      const patient = this._cStore.cert.patient
      const isBirthDay =
        !patient.birth_date &&
        patient.nullFlavors.findIndex((element) => {
          return element.parent_attr === "birth_date" && !element._destroy
        }) === -1
      this._suggestions[PATIENT_BIRTHDAY_SUG].done = !isBirthDay
    })
    this.disposers[3] = autorun(() => {
      if (!this._cStore.cert) return
      const cert = this._cStore.cert
      const isDeathDay =
        !cert.deathDatetime && cert.nullFlavors.findIndex((element) => element.parent_attr === "death_datetime") === -1
      this._suggestions[CERT_DEATH_THIME_SUG].done = !isDeathDay
    })
    this.disposers[4] = autorun(() => {
      if (!this._cStore.cert) return
      const person = this._cStore.cert.patient.person
      const isSNILS =
        (!person && this._identified) ||
        (person &&
          (!person.SNILS || person.SNILS.length < 14) &&
          person.nullFlavors.findIndex((element) => element.parent_attr === "SNILS") === -1)
      this._suggestions[SNILS_SUG].done = !isSNILS
    })
    this.disposers[5] = autorun(() => {
      if (!this._cStore.cert) return
      const oms = this._cStore.cert.policyOMS
      const isOMS =
        (!oms || oms.length < 7) &&
        this._cStore.cert.nullFlavors.findIndex((element) => element.parent_attr === "policy_OMS") === -1
      this._suggestions[OMS_SUG].done = !isOMS
    })
    this.disposers[6] = autorun(() => {
      if (!this._cStore.cert) return
      const patient = this._cStore.cert.patient
      const identity = patient.identity
      const code = identity?.issueOrgCode
      const isCODE =
        (!identity && patient.nullFlavors.findIndex((element) => element.parent_attr === "identity") === -1) ||
        (identity &&
          (!code || code.length < 1) &&
          identity.nullFlavors.findIndex((element) => element.parent_attr === "issueOrgCode") === -1)
      this._suggestions[IORGCODE_SUG].done = !isCODE
    })
    this.disposers[7] = autorun(() => {
      if (!this._cStore.cert) return
      const patient = this._cStore.cert.patient
      const isIORGDate =
        (!patient.identity && patient.nullFlavors.findIndex((element) => element.parent_attr === "identity") === -1) ||
        (patient.identity && !patient.identity?.issueOrgDate)
      this._suggestions[IORGDATE_SUG].done = !isIORGDate
    })
    this.disposers[8] = autorun(() => {
      if (!this._cStore.cert) return
      const patient = this._cStore.cert.patient
      const isIORGName =
        (!patient.identity && patient.nullFlavors.findIndex((element) => element.parent_attr === "identity") === -1) ||
        (patient.identity && (!patient.identity?.issueOrgName || patient.identity.issueOrgName.length < 15))
      this._suggestions[IORGNAME_SUG].done = !isIORGName
    })
    this.disposers[9] = autorun(() => {
      if (!this._cStore.cert) return
      const patient = this._cStore.cert.patient
      const identity = patient.identity
      const series = patient.identity?.series
      const isIDSeries =
        (!identity && patient.nullFlavors.findIndex((element) => element.parent_attr === "identity") === -1) ||
        (identity &&
          (!series || series.length < 1) &&
          identity.nullFlavors.findIndex((element) => element.parent_attr === "series") === -1)
      this._suggestions[IDSERIES_SUG].done = !isIDSeries
    })
    this.disposers[10] = autorun(() => {
      if (!this._cStore.cert) return
      const patient = this._cStore.cert.patient
      const isIDNumber =
        (!patient.identity &&
          patient.nullFlavors.findIndex((element) => element.parent_attr === "identity" && !element._destroy) === -1) ||
        (patient.identity && !patient.identity.number)
      this._suggestions[IDNUMBER_SUG].done = !isIDNumber
    })
    this.disposers[11] = autorun(() => {
      const person = this._cStore.cert.patient.person
      const isLifeArea =
        (!person && this._identified) ||
        (person &&
          (!person.address ||
            !person.address.streetAddressLine ||
            person.address.streetAddressLine.split(",").length < 3) &&
          person.nullFlavors.findIndex((element) => element.parent_attr === "address") === -1)
      this._suggestions[LIFE_PLACE_SUG].done = !isLifeArea
    })
    this.disposers[12] = autorun(() => {
      const isDeathArea =
        (!this._cStore.cert.deathAddr ||
          !this._cStore.cert.deathAddr.streetAddressLine ||
          this._cStore.cert.deathAddr.streetAddressLine.split(",").length < 3) &&
        this._cStore.cert.nullFlavors.findIndex((element) => element.parent_attr === "death_addr") === -1
      this._suggestions[DEATH_PLACE_SUG].done = !isDeathArea
    })
    this.disposers[13] = autorun(() => {
      if (!this._cStore.cert) return
      const isDeathAreaType =
        this._cStore.cert.deathAreaType === undefined &&
        this._cStore.cert.nullFlavors.findIndex((element) => element.parent_attr === "death_area_type") === -1
      this._suggestions[DEATH_AREA_SUG].done = !isDeathAreaType
    })
    this.disposers[14] = autorun(() => {
      if (!this._cStore.cert) return
      const isLifeAreaType =
        this._cStore.cert.lifeAreaType === undefined &&
        this._cStore.cert.nullFlavors.findIndex((element) => element.parent_attr === "life_area_type") === -1
      this._suggestions[LIFE_AREA_SUG].done = !isLifeAreaType
    })
    this.disposers[15] = autorun(() => {
      if (!this._cStore.cert) return
      this._suggestions[DEATH_PLACE_TYPE_SUG].done = this._cStore.cert.deathPlace !== undefined
    })
    this.disposers[16] = autorun(() => {
      if (!this._cStore.cert) return
      const childInfo = this._cStore.cert.childInfo
      const isTERMS_PREGNANCY =
        childInfo === undefined ||
        childInfo.termPregnancy !== undefined ||
        childInfo.nullFlavors.findIndex((element) => element.parent_attr === "term_pregnancy") !== -1
      this._suggestions[TERMS_PREGNANCY_SUG].done = isTERMS_PREGNANCY
    })
    this.disposers[17] = autorun(() => {
      if (!this._cStore.cert) return
      const childInfo = this._cStore.cert.childInfo
      const isCHILD_WEIGHT = childInfo === undefined || childInfo.weight !== undefined
      this._suggestions[CHILD_WEIGHT_SUG].done = isCHILD_WEIGHT
    })
    this.disposers[18] = autorun(() => {
      if (!this._cStore.cert) return
      const childInfo = this._cStore.cert.childInfo
      const isNUMBER_PREGNANCY = !childInfo || !!childInfo.whichAccount
      this._suggestions[NUMBER_PREGNANCY_SUG].done = isNUMBER_PREGNANCY
    })
    this.disposers[19] = autorun(() => {
      if (!this._cStore.cert) return
      const childInfo = this._cStore.cert.childInfo
      const isMOTHER_FIO =
        !childInfo ||
        (!!childInfo.relatedSubject &&
          (childInfo.relatedSubject.nullFlavors.findIndex((item) => item.parent_attr === "person_name") !== -1 ||
            !!childInfo.relatedSubject.fio))
      this._suggestions[MOTHER_FIO_SUG].done = isMOTHER_FIO
    })
    this.disposers[20] = autorun(() => {
      if (!this._cStore.cert) return
      const childInfo = this._cStore.cert.childInfo
      const isMOTHER_BIRTHDAY =
        !childInfo ||
        (!!childInfo.relatedSubject &&
          (childInfo.relatedSubject.nullFlavors.findIndex((item) => item.parent_attr === "birthTime") !== -1 ||
            !!childInfo.relatedSubject.birthTime))
      this._suggestions[MOTHER_BIRTHDAY_SUG].done = isMOTHER_BIRTHDAY
    })
    this.disposers[21] = autorun(() => {
      if (!this._cStore.cert) return
      const childInfo = this._cStore.cert.childInfo
      const isMOTHER_ADDRESS =
        !childInfo ||
        (!!childInfo.relatedSubject &&
          (childInfo.relatedSubject.nullFlavors.findIndex((item) => item.parent_attr === "addr") !== -1 ||
            (!!childInfo.relatedSubject.addr && !!childInfo.relatedSubject.addr.houseGUID)))
      this._suggestions[MOTHER_ADDRESS_SUG].done = isMOTHER_ADDRESS
    })
    this.disposers[22] = autorun(() => {
      this._suggestions[MARITAL_STATUS_SUG].done = !!this._cStore.cert && !!this._cStore.cert.maritalStatus
    })
    this.disposers[23] = autorun(() => {
      this._suggestions[EDUCATION_LEVEL_SUG].done = !!this._cStore.cert && !!this._cStore.cert.educationLevel
    })
    this.disposers[24] = autorun(() => {
      this._suggestions[SOCIAL_STATUS_SUG].done = !!this._cStore.cert && !!this._cStore.cert.socialStatus
    })
    this.disposers[25] = autorun(() => {
      this._suggestions[DEATH_KINDS_SUG].done = !!this._cStore.cert && !!this._cStore.cert.deathKind
    })
    this.disposers[26] = autorun(() => {
      if (!this._cStore.cert) return
      this._suggestions[KIND_DEATH_REASON_SUG].done =
        (!!this._cStore.cert.deathKind && this._cStore.cert.deathKind === DISEASE_DEADTH_KIND) ||
        (!!this._cStore.cert.extReasonTime && !!this._cStore.cert.extReasonDescription)
    })
    this.disposers[27] = autorun(() => {
      if (!this._cStore.cert) return
      this._suggestions[EST_MEDIC_SUG].done = !!this._cStore.cert.establishedMedic
    })
    this.disposers[28] = autorun(() => {
      if (!this._cStore.cert) return
      this._suggestions[BASIS_DERMINING_SUG].done = !!this._cStore.cert.basisDetermining
    })
    this.disposers[29] = autorun(() => {
      if (!this._cStore.cert) return
      this._suggestions[REASON_A_SUG].done = !!this._cStore.cert.reasonA?.diagnosis
    })
    this.disposers[30] = autorun(() => {
      if (!this._cStore.cert) return
      this._suggestions[REASON_A_TIME_SUG].done =
        !!this._cStore.cert.reasonA?.effectiveTime ||
        this._cStore.cert.reasonA?.nullFlavors.findIndex(
          (item) => item.parent_attr === "effective_time" && !item._destroy
        ) !== -1
    })
    this.disposers[31] = autorun(() => {
      if (!this._cStore.cert) return
      this._suggestions[REASON_B_SUG].done =
        !!this._cStore.cert.reasonB?.diagnosis ||
        this._cStore.cert.nullFlavors.findIndex((item) => item.parent_attr === "b_reason" && !item._destroy) !== -1
    })
    this.disposers[32] = autorun(() => {
      if (!this._cStore.cert) return
      this._suggestions[REASON_B_TIME_SUG].done =
        !this._cStore.cert.reasonB ||
        !!this._cStore.cert.reasonB.effectiveTime ||
        this._cStore.cert.reasonB?.nullFlavors.findIndex(
          (item) => item.parent_attr === "effective_time" && !item._destroy
        ) !== -1
    })
    this.disposers[33] = autorun(() => {
      if (!this._cStore.cert) return
      this._suggestions[REASON_C_SUG].done =
        !!this._cStore.cert.reasonC?.diagnosis ||
        this._cStore.cert.nullFlavors.findIndex((item) => item.parent_attr === "c_reason" && !item._destroy) !== -1
    })
    this.disposers[34] = autorun(() => {
      if (!this._cStore.cert) return
      this._suggestions[REASON_C_TIME_SUG].done =
        !this._cStore.cert.reasonC ||
        !!this._cStore.cert.reasonC.effectiveTime ||
        this._cStore.cert.reasonC?.nullFlavors.findIndex(
          (item) => item.parent_attr === "effective_time" && !item._destroy
        ) !== -1
    })
    this.disposers[35] = autorun(() => {
      if (!this._cStore.cert) return
      this._suggestions[REASON_D_SUG].done =
        this._cStore.cert.reasonD?.diagnosis !== undefined ||
        this._cStore.cert.nullFlavors.findIndex((item) => item.parent_attr === "d_reason" && !item._destroy) !== -1
    })
    this.disposers[36] = autorun(() => {
      if (!this._cStore.cert) return
      this._suggestions[REASON_D_TIME_SUG].done =
        !this._cStore.cert.reasonD ||
        !!this._cStore.cert.reasonD.effectiveTime ||
        this._cStore.cert.reasonD?.nullFlavors.findIndex(
          (item) => item.parent_attr === "effective_time" && !item._destroy
        ) !== -1
    })
    this.disposers[37] = autorun(() => {
      if (!this._cStore.cert) return
      this._suggestions[TRAFFFIC_ACCIDENT_SUG].done =
        !!this._cStore.cert.trafficAccident ||
        this._cStore.cert.nullFlavors.findIndex((item) => item.parent_attr === "traffic_accident" && !item._destroy) !==
          -1
    })
    this.disposers[38] = autorun(() => {
      if (!this._cStore.cert) return
      this._suggestions[PREGNANCY_CONNECTION_SUG].done =
        !!this._cStore.cert.pregnancyConnection ||
        this._cStore.cert.nullFlavors.findIndex(
          (item) => item.parent_attr === "pregnancy_connection" && !item._destroy
        ) !== -1
    })
    this.disposers[39] = autorun(() => {
      if (!this._cStore.cert) return
      this._suggestions[AUTHOR_SUG].done = !!this._cStore.cert.author
    })
    this.disposers[40] = autorun(() => {
      if (!this._cStore.cert) return
      this._suggestions[AUTHENTICATOR_SUG].done = !!this._cStore.cert.authenticator
    })
    this.disposers[41] = autorun(() => {
      if (!this._cStore.cert) return
      this._suggestions[LEGAL_AUTHENTICATOR_SUG].done = !!this._cStore.cert.legalAuthenticator
    })
    this.disposers[42] = autorun(() => {
      this._identified =
        !!this._cStore.cert.patient.person ||
        this._cStore.cert.patient.nullFlavors.findIndex((el) => el.parent_attr === "person" && !el._destroy) === -1
    })
    this.disposers[43] = autorun(() => {
      if (!this._cStore.cert) return
      this._fromRelatives = this._identified && this._cStore.cert.patient && !this._cStore.cert.patient.identity
    })
    this.disposers[44] = autorun(() => {
      const person = this._cStore.cert.patient?.person
      const fio = person?.fio
      const isPersonNameSug =
        (!person && this._identified) ||
        (!!fio &&
          (fio.family.trim().length === 0 ||
            fio.given_1.trim().length === 0 ||
            (!!fio.given_2 && fio.given_2.trim().length === 0)))
      this._suggestions[PERSON_NAME_SUG].done = !isPersonNameSug
    })
  }
  dispose() {
    // So, to avoid subtle memory issues, always call the
    // disposers when the reactions are no longer needed.
    this.disposers.forEach((disposer) => disposer())
  }
  redSuggestionsCount() {
    return this.suggestions.reduce((result, item, index) => {
      if (
        !(
          item.done ||
          index in
            [
              EXT_REASON_SUG,
              EXT_REASON_TIME_SUG,
              PARTIPICIPANT_FIO_SUG,
              PARTIPICIPANT_DATE_SUG,
              PARTIPICIPANT_IDENTITY_SUG,
            ]
        )
      )
        ++result
      return result
    }, 0)
  }
  get identified(): boolean {
    return this._identified
  }
  set identified(value: boolean) {
    this._identified = value
  }
  get fromRelatives(): boolean {
    return this._fromRelatives
  }
  set fromRelatives(value: boolean) {
    this._fromRelatives = value
  }
  get suggestions(): ISuggestions[] {
    return this._suggestions
  }
}
