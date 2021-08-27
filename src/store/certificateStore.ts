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
  PATIENT_BIRTHDAY_SUG,
  PATIENT_GENDER_SUG,
  PERSON_NAME_SUG,
  UNK,
} from "../utils/defaults"

export default class CertificateStore {
  private _cert: Certificate
  private _suggestions: ISuggestions[]
  constructor() {
    this._cert = new Certificate({
      patient: { person: { fio: { family: "", given_1: "", given_2: "" } } } as IPatient,
    } as ICertificateResponse)
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
  setGender(gender: number | undefined) {
    this._cert.patient.gender = gender
    const isGenderSug = this._cert.patient.gender === undefined
    this.changeSuggestionsEntry(PATIENT_GENDER_SUG, isGenderSug)
  }
  checkFio() {
    const fio = this._cert.patient.person.fio
    const isPersonNameSug =
      (fio.family.trim().length === 0 ||
        fio.given_1.trim().length === 0 ||
        (fio.given_2 !== undefined && fio.given_2.trim().length === 0)) &&
      this._cert.patient.person.nullFlavors().findIndex((element) => element.parent_attr === "person_names") === -1
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
      patient.birth_date = value
      patient.birth_year = undefined
      this.changeSuggestionsEntry(PATIENT_BIRTHDAY_SUG, false)
    } else if (value && isYear) {
      patient.birth_date = value
      patient.birth_year = (patient.birth_date as Date).getFullYear()
      if (patient.nullFlavors().findIndex((element) => element.parent_attr === "birth_date") === -1) {
        patient.nullFlavors().push({ parent_attr: "birth_date", value: UNK } as INullFlavor)
      }
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
      if (cert.nullFlavors().findIndex((element) => element.parent_attr === "death_datetime") === -1) {
        cert.nullFlavors().push({ parent_attr: "death_datetime", value: UNK } as INullFlavor)
      }
      this.changeSuggestionsEntry(CERT_DEATH_THIME_SUG, false)
    } else {
      cert.death_datetime = undefined
      cert.death_year = undefined
      this.checkDeathDay()
    }
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
