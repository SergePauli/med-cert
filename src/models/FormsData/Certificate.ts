import { makeAutoObservable } from "mobx"
import { v4 as uuidv4 } from "uuid"
import { INullFlavor } from "../INullFlavor"
import { IReference } from "../IReference"
import { ICertificateResponse } from "../responses/ICertificateResponse"
import Patient from "./Patient"

export default class Certificate {
  private _id?: number
  private _series?: string
  private _number?: string
  private _eff_time: Date
  private _cert_type: IReference | undefined
  private _series_prev?: string
  private _number_prev?: string
  private _eff_time_prev?: Date
  private _patient: Patient
  private _death_datetime: Date | Date[] | undefined
  private _death_year?: number
  private _death_month?: number
  private _death_day?: number
  private _guid: string
  private _policyOMS: string | undefined
  private _nullFlavors: INullFlavor[]
  constructor(props: ICertificateResponse) {
    this._guid = props.guid || uuidv4()
    this._patient = new Patient(props.patient)
    this._eff_time = props.eff_time || new Date()
    this._nullFlavors = props.nullFlavors || []
    if (props.cert_type) this._cert_type = props.cert_type
    if (props.series) this._series = props.series
    if (props.number) this._number = props.number
    if (props.death_datetime) this._death_datetime = props.death_datetime
    if (props.death_year) this._death_year = props.death_year
    if (props.number_prev) this._number_prev = props.number_prev
    if (props.series_prev) this._series_prev = props.series_prev
    if (props.policyOMS) this._policyOMS = props.policyOMS
    makeAutoObservable(this)
  }
  get id() {
    return this._id
  }
  set id(id: number | undefined) {
    this._id = id
  }
  get series() {
    return this._series
  }
  set series(series: string | undefined) {
    this._series = series
  }
  get number() {
    return this._number
  }
  set number(number: string | undefined) {
    this._number = number
  }
  get eff_time() {
    return this._eff_time
  }
  set eff_time(eff_time: Date) {
    this._eff_time = eff_time
  }
  get death_datetime() {
    return this._death_datetime
  }
  set death_datetime(death_datetime: Date | Date[] | undefined) {
    this._death_datetime = death_datetime
  }
  get cert_type() {
    return this._cert_type
  }
  set cert_type(cert_type: IReference | undefined) {
    this._cert_type = cert_type
  }
  get series_prev() {
    return this._series_prev
  }
  set series_prev(series: string | undefined) {
    this._series_prev = series
  }
  get number_prev() {
    return this._number_prev
  }
  set number_prev(number: string | undefined) {
    this._number_prev = number
  }
  get guid() {
    return this._guid
  }
  nullFlavors() {
    return this._nullFlavors
  }
  setNullFlavors(nullFlavors: INullFlavor[]) {
    this._nullFlavors = nullFlavors
  }
  get patient() {
    return this._patient
  }
  get eff_time_prev() {
    return this._eff_time_prev
  }
  set eff_time_prev(eff_time: Date | undefined) {
    this._eff_time_prev = eff_time
  }
  get death_year() {
    return this._death_year
  }
  set death_year(death_year: number | undefined) {
    this._death_year = death_year
  }

  get policyOMS() {
    return this._policyOMS || ""
  }

  set policyOMS(policyOMS: string | undefined) {
    this._policyOMS = policyOMS
  }
}
