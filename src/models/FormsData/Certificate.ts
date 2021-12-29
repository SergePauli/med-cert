import { autorun, makeAutoObservable } from "mobx"
import { v4 as uuidv4 } from "uuid"
import { UNK } from "../../utils/defaults"
import { timeDiff } from "../../utils/functions"
import { IAudit } from "../IAudit"
import { INullFlavor } from "../INullFlavor"
import { IReference } from "../IReference"
import { ICertificateResponse } from "../responses/ICertificateResponse"
import { IDeathReason } from "../responses/IDeathReason"
import Address from "./Address"
import Authenticator from "./Authenticator"
import { ChildInfo } from "./ChildInfo"
import { DeathReason } from "./DeathReason"
import Patient from "./Patient"

export default class Certificate {
  private _id: number
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
  private _deathDatetime?: Date
  private _deathYear?: number
  private _deathMonth?: number | undefined
  private _deathPlace?: number | undefined
  private _maritalStatus?: number | undefined
  private _educationLevel?: number | undefined
  private _socialStatus?: number | undefined
  private _deathKind?: number | undefined
  private _extReasonTime?: Date | undefined
  private _extReasonDescription?: string | undefined
  private _reasonA?: DeathReason | undefined
  private _reasonB?: DeathReason
  private _reasonC?: DeathReason
  private _reasonD?: DeathReason
  private _deathReasons: DeathReason[]
  private _reasonACME?: DeathReason | undefined
  private _deathAddr?: Address
  private _guid: string
  private _policyOMS?: string | undefined
  private _childInfo?: ChildInfo | undefined
  private _establishedMedic?: number | undefined
  private _basisDetermining?: number | undefined
  private _trafficAccident?: number | undefined
  private _pregnancyConnection?: number | undefined
  private _author?: Authenticator | undefined
  private _authenticator?: Authenticator | undefined
  private _legalAuthenticator?: Authenticator | undefined
  private _nullFlavors: INullFlavor[]
  private _audits: IAudit[]
  disposers: (() => void)[]

  constructor(props: ICertificateResponse) {
    this._audits = []
    this._id = props.id || -1
    this.disposers = []
    this._guid = props.guid || uuidv4()
    this._patient = new Patient(props.patient)
    this._effTime = props.eff_time || new Date()
    this._nullFlavors = props.null_flavors || []
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
    if (props.author) this._author = new Authenticator(props.author)
    if (props.authenticator) this._authenticator = new Authenticator(props.authenticator)
    if (props.legal_authenticator) this._legalAuthenticator = new Authenticator(props.legal_authenticator)
    this._extReasonTime = props.ext_reason_time
    this._extReasonDescription = props.ext_reason_description
    this._establishedMedic = props.established_medic
    this._basisDetermining = props.basis_determining
    this._trafficAccident = props.traffic_accident
    this._pregnancyConnection = props.pregnancy_connection
    if (props.reason_ACME && props.reason_ACME === props.a_reason?.diagnosis?.ICD10) this._reasonACME = this._reasonA
    else if (props.reason_ACME && props.reason_ACME === props.b_reason?.diagnosis?.ICD10)
      this._reasonACME = this._reasonB
    else if (props.reason_ACME && props.reason_ACME === props.c_reason?.diagnosis?.ICD10)
      this._reasonACME = this._reasonC
    else if (props.reason_ACME && props.reason_ACME === props.d_reason?.diagnosis?.ICD10)
      this._reasonACME = this._reasonD
    makeAutoObservable(this)
    this.disposers[0] = autorun(() => {
      if (this.reasonB === undefined && this._nullFlavors.findIndex((item) => item.parent_attr === "b_reason") === -1)
        this._nullFlavors.push({ parent_attr: "b_reason", code: UNK } as INullFlavor)
      else if (
        this.reasonB !== undefined &&
        this._nullFlavors.findIndex((item) => item.parent_attr === "b_reason") !== -1
      )
        this.nullFlavors = this._nullFlavors.filter((item) => item.parent_attr !== "b_reason")
    })
    this.disposers[1] = autorun(() => {
      if (this.reasonC === undefined && this._nullFlavors.findIndex((item) => item.parent_attr === "c_reason") === -1)
        this._nullFlavors.push({ parent_attr: "c_reason", code: UNK } as INullFlavor)
      else if (
        this.reasonC !== undefined &&
        this._nullFlavors.findIndex((item) => item.parent_attr === "c_reason") !== -1
      )
        this.nullFlavors = this._nullFlavors.filter((item) => item.parent_attr !== "c_reason")
    })
    this.disposers[2] = autorun(() => {
      if (this.reasonD === undefined && this._nullFlavors.findIndex((item) => item.parent_attr === "d_reason") === -1)
        this._nullFlavors.push({ parent_attr: "d_reason", code: UNK } as INullFlavor)
      else if (
        this.reasonD !== undefined &&
        this._nullFlavors.findIndex((item) => item.parent_attr === "d_reason") !== -1
      )
        this.nullFlavors = this._nullFlavors.filter((item) => item.parent_attr !== "d_reason")
    })
    if (props.a_reason) this._reasonA = this.createDeathReason(props.a_reason)
    if (props.b_reason) this._reasonB = this.createDeathReason(props.b_reason)
    if (props.c_reason) this._reasonC = this.createDeathReason(props.c_reason)
    if (props.d_reason) this._reasonD = this.createDeathReason(props.d_reason)
    if (props.death_reasons) this._deathReasons = props.death_reasons.map((reason) => this.createDeathReason(reason))
    else this._deathReasons = []
  }
  get id() {
    return this._id
  }
  set id(id: number) {
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
  set deathDatetime(death_datetime: Date | undefined) {
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
  get author(): Authenticator | undefined {
    return this._author
  }
  set author(value: Authenticator | undefined) {
    this._author = value
  }
  get authenticator(): Authenticator | undefined {
    return this._authenticator
  }
  set authenticator(value: Authenticator | undefined) {
    this._authenticator = value
  }
  get legalAuthenticator(): Authenticator | undefined {
    return this._legalAuthenticator
  }
  set legalAuthenticator(value: Authenticator | undefined) {
    this._legalAuthenticator = value
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
  get trafficAccident(): number | undefined {
    return this._trafficAccident
  }
  set trafficAccident(value: number | undefined) {
    this._trafficAccident = value
  }
  get pregnancyConnection(): number | undefined {
    return this._pregnancyConnection
  }
  set pregnancyConnection(value: number | undefined) {
    this._pregnancyConnection = value
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
  get reasonA(): DeathReason | undefined {
    return this._reasonA
  }
  set reasonA(value: DeathReason | undefined) {
    this._reasonA = value
  }
  get reasonB(): DeathReason | undefined {
    return this._reasonB
  }
  set reasonB(value: DeathReason | undefined) {
    this._reasonB = value
  }
  get reasonC(): DeathReason | undefined {
    return this._reasonC
  }
  set reasonC(value: DeathReason | undefined) {
    this._reasonC = value
  }
  get reasonD(): DeathReason | undefined {
    return this._reasonD
  }
  set reasonD(value: DeathReason | undefined) {
    this._reasonD = value
  }
  get reasonACME(): DeathReason | undefined {
    return this._reasonACME
  }
  set reasonACME(value: DeathReason | undefined) {
    this._reasonACME = value
  }
  get deathReasons(): DeathReason[] {
    return this._deathReasons
  }
  set deathReasons(value: DeathReason[]) {
    this._deathReasons = value
  }
  get audits() {
    return this._audits
  }

  milisecAge() {
    // Discard the time-zone information.
    const a = this._patient.birth_date as Date
    if (a === undefined) return false
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate(), a.getHours(), a.getMinutes())
    const b = this._deathDatetime as Date
    if (b === undefined) return false
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate(), b.getHours(), b.getMinutes())
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
    const dd = this._deathDatetime as Date
    const db = this._patient.birth_date as Date
    if (dd !== undefined && db !== undefined) return dd.getFullYear() - db.getFullYear()
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
  createDeathReason(props: IDeathReason): DeathReason {
    const newReason = new DeathReason({ ...props, certificate_id: this._id } as IDeathReason)
    if (newReason.effectiveTime && this._deathDatetime !== undefined) {
      const diff = timeDiff(newReason.effectiveTime, this._deathDatetime)
      if (diff.days && diff.days > 0) newReason.days = diff.days
      if (diff.hours) newReason.hours = diff.hours
      if (diff.minutes && diff.minutes > 0) newReason.minutes = diff.minutes
      if (diff.months && diff.months > 0) newReason.months = diff.months
      if (diff.weeks && diff.weeks > 0) newReason.weeks = diff.weeks
      if (diff.years && diff.years > 0) newReason.years = diff.years
    }
    return newReason
  }
  saveReasonEffTime(reason: DeathReason) {
    if (this._deathDatetime === undefined) return false
    let result = new Date(this._deathDatetime)
    if (reason.minutes) result.setMinutes(result.getMinutes() - reason.minutes)
    if (reason.hours) result.setHours(result.getHours() - reason.hours)
    if (reason.days) result.setDate(result.getDate() - reason.days)
    if (reason.weeks) result.setDate(result.getDate() - reason.weeks * 7)
    if (reason.months) result.setMonth(result.getMonth() - reason.months)
    if (reason.years) result.setFullYear(result.getFullYear() - reason.years)
    reason.effectiveTime = result
    return true
  }
  dispose() {
    // So, to avoid subtle memory issues, always call the
    // disposers when the reactions are no longer needed.
    this.disposers.forEach((disposer) => disposer())
  }
}
