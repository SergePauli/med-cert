import { makeAutoObservable } from "mobx"
import { v4 as uuidv4 } from "uuid"
import { INullFlavor } from "../INullFlavor"
import { IReference } from "../IReference"
import { ICertificateResponse } from "../responses/ICertificateResponse"
import Address from "./Address"
import { ChildInfo } from "./ChildInfo"
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
  private _deathPlace?: number | undefined
  private _maritalStatus?: number | undefined
  private _educationLevel?: number | undefined
  private _socialStatus?: number | undefined
  private _deathKind?: number | undefined
  private _extReasonTime?: Date | undefined
  private _extReasonDescription?: string | undefined
  private _deathAddr?: Address
  private _guid: string
  private _policyOMS?: string | undefined
  private _childInfo?: ChildInfo | undefined
  private _establishedMedic?: number | undefined
  private _basisDetermining?: number | undefined
  private _nullFlavors: INullFlavor[]

  constructor(props: ICertificateResponse) {
    this._guid = props.guid || uuidv4()
    this._patient = new Patient(props.patient)
    this._effTime = props.eff_time || new Date()
    this._nullFlavors = props.nullFlavors || []
    this._certType = props.cert_type
    this._series = props.series
    this._number = props.number
    this._deathDatetime = props.death_datetime
    this._deathYear = props.death_year
    this._numberPrev = props.number_prev
    this._seriesPrev = props.series_prev
    this._policyOMS = props.policy_OMS
    this._lifeAreaType = props.lifeAreaType
    this._deathAreaType = props.deathAreaType
    if (props.death_addr) this._deathAddr = new Address(props.death_addr)
    this._deathPlace = props.death_place
    this._deathKind = props.death_kind
    this._educationLevel = props.education_level
    this._maritalStatus = props.marital_status
    this._socialStatus = props.social_status
    if (props.child_info) this._childInfo = new ChildInfo(props.child_info)
    this._extReasonTime = props.ext_reason_time
    this._extReasonDescription = props.ext_reason_description
    this._establishedMedic = props.established_medic
    this._basisDetermining = props.basis_determining
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

  get extReasonTime(): Date | undefined {
    return this._extReasonTime
  }
  set extReasonTime(value: Date | undefined) {
    this._extReasonTime = value
  }
  get establishedMedic(): number | undefined {
    return this._establishedMedic
  }
  set establishedMedic(value: number | undefined) {
    this._establishedMedic = value
  }
  get basisDetermining(): number | undefined {
    return this._basisDetermining
  }
  set basisDetermining(value: number | undefined) {
    this._basisDetermining = value
  }
  get nullFlavors() {
    return this._nullFlavors
  }
  set nullFlavors(nullFlavors: INullFlavor[]) {
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
  get childInfo(): ChildInfo | undefined {
    return this._childInfo
  }
  set childInfo(value: ChildInfo | undefined) {
    this._childInfo = value
  }
  get extReasonDescription(): string | undefined {
    return this._extReasonDescription
  }
  set extReasonDescription(value: string | undefined) {
    this._extReasonDescription = value
  }
  milisecAge() {
    // Discard the time and time-zone information.
    const a = this._patient.birth_date as Date
    if (a === undefined) return false
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())
    const b = this._deathDatetime as Date
    if (b === undefined) return false
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate())
    return utc2 - utc1
  }
  hoursAge() {
    const _MS_PER_HOUR = 1000 * 60 * 60
    const ms = this.milisecAge()
    if (ms) return Math.floor(ms / _MS_PER_HOUR)
    else return false
  }
  daysAge() {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24
    const ms = this.milisecAge()
    if (ms) return Math.floor(ms / _MS_PER_DAY)
    else return false
  }
  yearsAge() {
    const ms = this.milisecAge()
    if (ms) return (this._deathDatetime as Date).getFullYear() - (this._patient.birth_date as Date).getFullYear()
    else return false
  }
  setDeathDay(value: Date | undefined, isYear: boolean) {
    if (value && !isYear) {
      this.deathDatetime = value
      this.deathYear = undefined
    } else if (value && isYear) {
      this.deathDatetime = value
      this.deathYear = (this.deathDatetime as Date).getFullYear()
    } else {
      this.deathDatetime = undefined
      this.deathYear = undefined
    }
  }
}
