import { makeAutoObservable } from "mobx"
import { v4 as uuidv4 } from "uuid"
import { INullFlavor } from "../INullFlavor"
import { IReference } from "../IReference"
import { ICertificateResponse } from "../responses/ICertificateResponse"
import Address from "./Address"
import Patient from "./Patient"

export default class Certificate {
  private _id?: number
  private _series?: string
  private _number?: string
  private _effTime: Date
  private _certType: IReference | undefined
  private _seriesPrev?: string
  private _numberPrev?: string
  private _effTimePrev?: Date
  private _patient: Patient
  private _lifeAreaType?: number
  private _deathAreaType?: number
  private _deathDatetime: Date | Date[] | undefined
  private _deathYear?: number
  private _deathMonth?: number | undefined
  private _death_day?: number
  private _deathPlace?: number | undefined
  private _maritalStatus?: number | undefined
  private _educationLevel?: number | undefined
  private _socialStatus?: number | undefined
  private _deathKind?: number | undefined
  private _deathAddr?: Address
  private _guid: string
  private _policyOMS?: string | undefined
  private _nullFlavors: INullFlavor[]
  constructor(props: ICertificateResponse) {
    this._guid = props.guid || uuidv4()
    this._patient = new Patient(props.patient)
    this._effTime = props.eff_time || new Date()
    this._nullFlavors = props.nullFlavors || []
    if (props.cert_type) this._certType = props.cert_type
    if (props.series) this._series = props.series
    if (props.number) this._number = props.number
    if (props.death_datetime) this._deathDatetime = props.death_datetime
    if (props.death_year) this._deathYear = props.death_year
    if (props.number_prev) this._numberPrev = props.number_prev
    if (props.series_prev) this._seriesPrev = props.series_prev
    if (props.policy_OMS) this._policyOMS = props.policy_OMS
    if (props.lifeAreaType) this._lifeAreaType = props.lifeAreaType
    if (props.deathAreaType) this._deathAreaType = props.deathAreaType
    if (props.death_addr) this._deathAddr = new Address(props.death_addr)
    if (props.death_place) this._deathPlace = props.death_place
    if (props.death_kind) this._deathKind = props.death_kind
    if (props.education_level) this._educationLevel = props.education_level
    if (props.marital_status) this._maritalStatus = props.marital_status
    if (props.social_status) this._socialStatus = props.social_status
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
  get effTime() {
    return this._effTime
  }
  set effTime(eff_time: Date) {
    this._effTime = eff_time
  }
  get deathDatetime() {
    return this._deathDatetime
  }
  set deathDatetime(death_datetime: Date | Date[] | undefined) {
    this._deathDatetime = death_datetime
  }
  get certType() {
    return this._certType
  }
  set certType(cert_type: IReference | undefined) {
    this._certType = cert_type
  }
  get seriesPrev() {
    return this._seriesPrev
  }
  set seriesPrev(series: string | undefined) {
    this._seriesPrev = series
  }
  get numberPrev() {
    return this._numberPrev
  }
  set numberPrev(number: string | undefined) {
    this._numberPrev = number
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
  get effTimePrev() {
    return this._effTimePrev
  }
  set effTimePrev(eff_time: Date | undefined) {
    this._effTimePrev = eff_time
  }
  get deathYear() {
    return this._deathYear
  }
  set deathYear(death_year: number | undefined) {
    this._deathYear = death_year
  }

  get policyOMS() {
    return this._policyOMS || ""
  }

  set policyOMS(policyOMS: string | undefined) {
    this._policyOMS = policyOMS
  }

  get lifeAreaType() {
    return this._lifeAreaType
  }
  set lifeAreaType(lat: number | undefined) {
    this._lifeAreaType = lat
  }

  get deathAreaType() {
    return this._deathAreaType
  }
  set deathAreaType(dat: number | undefined) {
    this._deathAreaType = dat
  }

  get deathAddr() {
    return this._deathAddr
  }
  set deathAddr(value: Address | undefined) {
    this._deathAddr = value
  }
  get deathKind(): number | undefined {
    return this._deathKind
  }
  set deathKind(value: number | undefined) {
    this._deathKind = value
  }
  get socialStatus(): number | undefined {
    return this._socialStatus
  }
  set socialStatus(value: number | undefined) {
    this._socialStatus = value
  }
  get educationLevel(): number | undefined {
    return this._educationLevel
  }
  set educationLevel(value: number | undefined) {
    this._educationLevel = value
  }
  get maritalStatus(): number | undefined {
    return this._maritalStatus
  }
  set maritalStatus(value: number | undefined) {
    this._maritalStatus = value
  }
  get deathPlace(): number | undefined {
    return this._deathPlace
  }
  set deathPlace(value: number | undefined) {
    this._deathPlace = value
  }
  get deathMonth(): number | undefined {
    return this._deathMonth
  }
  set deathMonth(value: number | undefined) {
    this._deathMonth = value
  }
}
