import { makeAutoObservable } from "mobx"
import Certificate from "../models/FormsData/Certificate"
import { INullFlavor } from "../models/INullFlavor"
import { IPatient } from "../models/IPatient"
import { IReference } from "../models/IReference"
import { ISuggestions } from "../models/ISuggestions"
import { ICertificateResponse } from "../models/responses/ICertificateResponse"
import {
  CERT_DEATH_THIME_SUG,
  CERT_TYPE_SUG,
  DEFAULT_CERT_SUGGESTIONS,
  IDNUMBER_SUG,
  IDSERIES_SUG,
  ID_CARD_TYPES,
  IORGCODE_SUG,
  IORGDATE_SUG,
  IORGNAME_SUG,
  LIFE_AREA_SUG,
  NA,
  OMS_SUG,
  PASSPORT_RF,
  PATIENT_BIRTHDAY_SUG,
  PATIENT_GENDER_SUG,
  PERSON_NAME_SUG,
  SNILS_SUG,
  UNK,
} from "../utils/defaults"

export default class CertificateStore {
  private _cert: Certificate
  private _suggestions: ISuggestions[]
  private _identified: boolean
  private _fromRelatives: boolean
  constructor() {
    this._cert = new Certificate({
      patient: {
        identity: {
          identityCardType: ID_CARD_TYPES[PASSPORT_RF].code,
        },
        person: { fio: { family: "", given_1: "", given_2: "" } },
      } as IPatient,
    } as ICertificateResponse)
    this._identified = this._cert.patient.person.fio !== undefined
    this._fromRelatives = this._identified && this._cert.patient.identity === undefined
    this._suggestions = DEFAULT_CERT_SUGGESTIONS
    makeAutoObservable(this)
  }

  get cert() {
    return this._cert
  }
  setCert_type(cert_type: IReference) {
    this._cert.cert_type = cert_type
    this.changeSuggestionsEntry(CERT_TYPE_SUG, false)
  }
  get identified() {
    return this._identified
  }
  set identified(identified: boolean) {
    const nullFlavors = [] as INullFlavor[]
    this._identified = identified
    if (identified)
      this._cert.patient.person.setNullFlavors(
        nullFlavors.concat(
          this._cert.patient.person
            .nullFlavors()
            .filter((element: INullFlavor) => element.parent_attr !== "person_name")
        )
      )
    else {
      this._cert.patient.person.nullFlavors().push({ parent_attr: "person_name", value: NA })
      this.fromRelatives = false
    }
    this.checkFio()
  }

  get fromRelatives() {
    return this._fromRelatives
  }

  set fromRelatives(value: boolean) {
    this._fromRelatives = value
    if (value) this.identified = true
  }

  setGender(gender: number | undefined) {
    this._cert.patient.gender = gender
    const isGenderSug = this._cert.patient.gender === undefined
    this.changeSuggestionsEntry(PATIENT_GENDER_SUG, isGenderSug)
  }
  checkFio() {
    const fio = this._cert.patient.person.fio
    const isPersonNameSug =
      fio !== undefined &&
      (fio.family.trim().length === 0 ||
        fio.given_1.trim().length === 0 ||
        (fio.given_2 !== undefined && fio.given_2.trim().length === 0))
    this.changeSuggestionsEntry(PERSON_NAME_SUG, isPersonNameSug)
  }
  checkBirthDay() {
    const patient = this._cert.patient
    const isBirthDay =
      patient.birth_date === undefined &&
      patient.nullFlavors().findIndex((element) => element.parent_attr === "birth_date") === -1
    this.changeSuggestionsEntry(PATIENT_BIRTHDAY_SUG, isBirthDay)
  }
  setBirthDay(value: Date | undefined, isYear: boolean) {
    const patient = this._cert.patient
    if (value && !isYear) {
      if (patient.birth_date === undefined)
        patient.setNullFlavors(patient.nullFlavors().filter((element) => element.parent_attr !== "birth_date"))
      patient.birth_date = value
      patient.birth_year = undefined
      this.changeSuggestionsEntry(PATIENT_BIRTHDAY_SUG, false)
    } else if (value && isYear) {
      if (patient.birth_date === undefined)
        patient.setNullFlavors(patient.nullFlavors().filter((element) => element.parent_attr !== "birth_date"))
      patient.birth_date = value
      patient.birth_year = (patient.birth_date as Date).getFullYear()
      this.changeSuggestionsEntry(PATIENT_BIRTHDAY_SUG, false)
    } else {
      this._cert.patient.birth_date = undefined
      this._cert.patient.birth_year = undefined
      this.checkBirthDay()
    }
  }
  checkDeathDay() {
    const cert = this._cert
    const isDeathDay =
      cert.death_datetime === undefined &&
      cert.nullFlavors().findIndex((element) => element.parent_attr === "death_datetime") === -1
    this.changeSuggestionsEntry(CERT_DEATH_THIME_SUG, isDeathDay)
  }
  setDeathDay(value: Date | undefined, isYear: boolean) {
    const cert = this._cert
    if (value && !isYear) {
      cert.death_datetime = value
      cert.death_year = undefined
      this.changeSuggestionsEntry(CERT_DEATH_THIME_SUG, false)
    } else if (value && isYear) {
      cert.death_datetime = value
      cert.death_year = (cert.death_datetime as Date).getFullYear()
      this.changeSuggestionsEntry(CERT_DEATH_THIME_SUG, false)
    } else {
      cert.death_datetime = undefined
      cert.death_year = undefined
      this.checkDeathDay()
    }
  }

  checkSNILS() {
    const person = this._cert.patient.person
    const isSNILS =
      (person.SNILS === undefined || person.SNILS.length < 14) &&
      person.nullFlavors().findIndex((element) => element.parent_attr === "SNILS") === -1
    this.changeSuggestionsEntry(SNILS_SUG, isSNILS)
  }
  setSNILS(snils: string | undefined) {
    const person = this._cert.patient.person
    person.SNILS = snils
    this.checkSNILS()
  }
  checkOMS() {
    const oms = this._cert.policyOMS
    const isOMS =
      (oms === undefined || oms.length < 7) &&
      this._cert.nullFlavors().findIndex((element) => element.parent_attr === "policy_OMS") === -1
    this.changeSuggestionsEntry(OMS_SUG, isOMS)
  }
  setPolicyOMS(oms: string | undefined) {
    this._cert.policyOMS = oms
    this.checkOMS()
  }
  setIORGCODE(code: string | undefined) {
    const identity = this._cert.patient.identity
    if (identity) identity.issueOrgCode = code
    this.checkIORGCODE()
  }
  checkIORGCODE() {
    const code = this._cert.patient.identity?.issueOrgCode
    const isCODE =
      (code === undefined || code.length < 1) &&
      this._cert.nullFlavors().findIndex((element) => element.parent_attr === "policy_OMS") === -1
    this.changeSuggestionsEntry(IORGCODE_SUG, isCODE)
  }

  checkIdentity() {
    this.checkIORGDate()
    this.checkIORGCODE()
    this.checkIORGNAME()
    this.checkIDNumber()
    this.checkIDSeries()
  }
  checkIORGDate() {
    const patient = this._cert.patient
    const isIORGDate =
      patient.identity?.issueOrgDate === undefined &&
      patient.nullFlavors().findIndex((element) => element.parent_attr === "identity") === -1
    this.changeSuggestionsEntry(IORGDATE_SUG, isIORGDate)
  }
  setIORGDate(date: Date | undefined) {
    const identity = this._cert.patient.identity
    if (identity) identity.issueOrgDate = date
    this.checkIORGDate()
  }
  checkIORGNAME() {
    const patient = this._cert.patient
    const isIORGName =
      (patient.identity?.issueOrgName === undefined || patient.identity?.issueOrgName.length < 15) &&
      patient.nullFlavors().findIndex((element) => element.parent_attr === "identity") === -1
    this.changeSuggestionsEntry(IORGNAME_SUG, isIORGName)
  }
  setIORGNAME(name: string | undefined) {
    const identity = this._cert.patient.identity
    if (identity) identity.issueOrgName = name
    this.checkIORGNAME()
  }
  checkIDSeries() {
    const patient = this._cert.patient
    const isIDSeries =
      (patient.identity?.series === undefined || patient.identity?.series.length < 1) &&
      patient.nullFlavors().findIndex((element) => element.parent_attr === "identity") === -1
    this.changeSuggestionsEntry(IDSERIES_SUG, isIDSeries)
  }
  setIDSeries(series: string | undefined) {
    const identity = this._cert.patient.identity
    if (identity) identity.series = series
    this.checkIDSeries()
  }
  checkIDNumber() {
    const patient = this._cert.patient
    const isIDNumber =
      (patient.identity?.number === undefined || patient.identity?.number.length < 1) &&
      patient.nullFlavors().findIndex((element) => element.parent_attr === "identity") === -1
    this.changeSuggestionsEntry(IDNUMBER_SUG, isIDNumber)
  }
  setIDNumber(number: string | undefined) {
    const identity = this._cert.patient.identity
    if (identity) identity.number = number
    this.checkIDNumber()
  }
  checkLifeAreaType() {
    const isLifeAreaType =
      this._cert.lifeAreaType === undefined &&
      this._cert.nullFlavors().findIndex((element) => element.parent_attr === "life_area_type") === -1
    this.changeSuggestionsEntry(LIFE_AREA_SUG, isLifeAreaType)
  }

  get suggestions() {
    return this._suggestions
  }

  set suggestions(suggestions: ISuggestions[]) {
    this._suggestions = suggestions
  }

  changeSuggestionsEntry(index: number, value: boolean) {
    if (value === this.suggestions[index].done) {
      const nSuggestions = [...this.suggestions]
      nSuggestions[index].done = !value
      this._suggestions = nSuggestions
    }
  }
  redSuggestionsCount() {
    return this.suggestions.reduce((result, item) => {
      if (!item.done) ++result
      return result
    }, 0)
  }
}
