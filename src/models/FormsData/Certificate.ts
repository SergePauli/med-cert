import { autorun, makeAutoObservable } from "mobx"
import { v4 as uuidv4 } from "uuid"
import { NA, NULL_FLAVOR_IDX, REGION_OKATO } from "../../utils/defaults"
import { ISerializable } from "../common/ISerializabale"
import { ITrackable } from "../common/ITraсkable"
import { IAudit } from "../IAudit"
import { checkFieldNullFlavor, INullFlavorR } from "../INullFlavor"
import { IAddressR } from "../requests/IAddressR"
import { ICertificateR } from "../requests/ICertificateR"
import { IChildInfoR } from "../requests/IChildInfoR"
import { IDeathReasonR } from "../requests/IDeathReasonR"
import { ICertificate } from "../responses/ICertificate"
import { IDeathReason } from "../responses/IDeathReason"
import Authenticator from "./Authenticator"
import { ChildInfo } from "./ChildInfo"
import { DeathReason } from "./DeathReason"
import Participant from "./Participant"
import Patient from "./Patient"

export default class Certificate implements ITrackable<ICertificate> {
  private _id: number
  private _series?: string
  private _number?: string
  private _issueDate?: Date
  private _certType?: number
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
  private _deathAddr?: IAddressR
  private _guid?: string
  private _policyOMS?: string | undefined
  private _childInfo?: ChildInfo | undefined
  private _establishedMedic?: number | undefined
  private _basisDetermining?: number | undefined
  private _trafficAccident?: number | undefined
  private _pregnancyConnection?: number | undefined
  private _author?: Authenticator | undefined
  private _audithor?: Authenticator | undefined
  private _legalAuthenticator?: Authenticator | undefined
  private _nullFlavors: INullFlavorR[]
  private _audits: IAudit[]
  private _custodian_id?: number
  private _participant?: Participant | undefined
  private _latestOne?: ICertificate | undefined
  private _oldOne?: ICertificate | undefined
  disposers: (() => void)[]

  constructor(props: ICertificate) {
    if (props.null_flavors && props.null_flavors.length > 0)
      this._nullFlavors = props.null_flavors.map((item) => {
        return { ...item, code: NULL_FLAVOR_IDX[item.code] } as INullFlavorR
      })
    else this._nullFlavors = []
    this._oldOne = props
    this._latestOne = props.latest_one
    this._audits = []
    this._id = props.id || -1
    this._guid = props.guid || uuidv4()
    this._custodian_id = props.custodian?.id || props.patient?.organization_id
    this._patient = props.patient ? new Patient(props.patient) : new Patient()
    if (props.issue_date) this._issueDate = new Date(props.issue_date)
    this._certType = props.cert_type
    this._series = props.series || REGION_OKATO
    this._number = props.number
    if (!!props.death_datetime) this._deathDatetime = new Date(props.death_datetime)
    this._deathYear = props.death_year
    this._numberPrev = props.number_prev
    this._seriesPrev = props.series_prev
    this._policyOMS = props.policy_OMS
    this._lifeAreaType = props.life_area_type
    this._deathAreaType = props.death_area_type
    this._deathAddr = {
      ...props.death_addr,
      null_flavors_attributes:
        props.death_addr?.null_flavors?.map((item) => {
          return { ...item, code: NULL_FLAVOR_IDX[item.code] } as INullFlavorR
        }) || [],
    } as IAddressR
    this._deathPlace = props.death_place
    this._deathKind = props.death_kind
    this._educationLevel = props.education_level
    this._maritalStatus = props.marital_status
    this._socialStatus = props.social_status
    if (props.eff_time_prev) this._effTimePrev = new Date(props.eff_time_prev)
    if (props.child_info) this._childInfo = new ChildInfo(props.child_info)
    if (props.author) this._author = new Authenticator(props.author)
    if (props.audithor) this._audithor = new Authenticator(props.audithor)
    if (props.legal_authenticator) this._legalAuthenticator = new Authenticator(props.legal_authenticator)
    if (props.ext_reason_time) this._extReasonTime = new Date(props.ext_reason_time)
    this._extReasonDescription = props.ext_reason_description
    this._establishedMedic = props.established_medic
    this._basisDetermining = props.basis_determining
    this._trafficAccident = props.traffic_accident
    this._pregnancyConnection = props.pregnancy_connection

    if (props.a_reason) this._reasonA = new DeathReason(props.a_reason)
    else this._reasonA = new DeathReason({} as IDeathReason)
    if (props.b_reason) this._reasonB = new DeathReason(props.b_reason)
    if (props.c_reason) this._reasonC = new DeathReason(props.c_reason)
    if (props.reason_ACME) this.changeReasonACME(props.reason_ACME)

    if (props.d_reason) this._reasonD = new DeathReason(props.d_reason)
    if (props.death_reasons) this._deathReasons = props.death_reasons.map((reason) => new DeathReason(reason))
    else this._deathReasons = []
    if (props.participant) this._participant = new Participant(props.participant)
    makeAutoObservable(this, undefined, { deep: false })
    this.disposers = []
    this.disposers[0] = autorun(() => checkFieldNullFlavor("b_reason", this.reasonB, this._nullFlavors, NA))
    this.disposers[1] = autorun(() => checkFieldNullFlavor("c_reason", this._reasonC, this._nullFlavors, NA))
    this.disposers[2] = autorun(() => checkFieldNullFlavor("d_reason", this.reasonD, this._nullFlavors, NA))
    //console.log("Certificate", props)
  }

  // получение копии массива заполнителей из Observable.array
  null_flavors_attributes() {
    return this._nullFlavors.map((el) => {
      return { ...el }
    })
  }

  changeReasonACME(value: string | undefined) {
    if (!value || "" === value) this._reasonACME = undefined
    else {
      if (value === this._reasonA?.diagnosis?.ICD10) this._reasonACME = this._reasonA
      else if (value === this._reasonB?.diagnosis?.ICD10) this._reasonACME = this._reasonB
      else if (value === this._reasonC?.diagnosis?.ICD10) this._reasonACME = this._reasonC
      else this._reasonACME = undefined
    }
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
    if (!!dd && !!db) return dd.getFullYear() - db.getFullYear()
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

  saveReasonEffTime(reason: DeathReason) {
    if (!this._deathDatetime) return false
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

  getAttributes(): ICertificateR {
    let _cert = { guid: this._guid } as ICertificateR
    if (this._id > -1) _cert.id = this._id
    if (this._issueDate) _cert.issue_date = this._issueDate.toDateString()
    _cert.number_prev = this._numberPrev
    _cert.series_prev = this._seriesPrev
    _cert.eff_time_prev = this._effTimePrev?.toDateString()
    if (this._audithor) {
      _cert.audithor_attributes = this._audithor.getAttributes()
      if (!_cert.audithor_attributes.id && !!this.oldOne?.audithor?.id)
        _cert.audithor_attributes.id = this.oldOne.audithor.id
    } else if (this.oldOne && this.oldOne.audithor)
      _cert.audithor_attributes = { id: this.oldOne.audithor.id, _destroy: "1" }
    if (this._author) {
      _cert.author_attributes = this._author.getAttributes()
      if (!_cert.author_attributes.id && !!this.oldOne?.author?.id) _cert.author_attributes.id = this.oldOne.author.id
    } else if (this.oldOne && this.oldOne.author) _cert.author_attributes = { id: this.oldOne.author.id, _destroy: "1" }
    if (this._legalAuthenticator) {
      _cert.legal_authenticator_attributes = this._legalAuthenticator.getAttributes()
      if (!_cert.legal_authenticator_attributes.id && !!this.oldOne?.legal_authenticator?.id)
        _cert.legal_authenticator_attributes.id = this.oldOne.legal_authenticator.id
    } else if (this.oldOne && this.oldOne.legal_authenticator)
      _cert.legal_authenticator_attributes = { id: this.oldOne.legal_authenticator.id, _destroy: "1" }
    if (this._basisDetermining) _cert.basis_determining = this._basisDetermining
    if (this._certType) _cert.cert_type = this._certType
    if (this._childInfo) _cert.child_info_attributes = this._childInfo.getAttributes()
    else if (this.oldOne && this.oldOne.child_info) _cert.child_info_attributes = { _destroy: "1" } as IChildInfoR
    if (this._deathAddr && !!this._deathAddr.state && !!this._deathAddr.streetAddressLine)
      _cert.death_addr_attributes = { ...this._deathAddr } as IAddressR
    else if (this.oldOne && this.oldOne.death_addr)
      _cert.death_addr_attributes = { id: this.oldOne.death_addr.id, _destroy: "1" } as IAddressR
    if (this._deathAreaType || this.oldOne?.death_area_type)
      _cert.death_area_type = !!this._deathAreaType ? this._deathAreaType : null
    if (this._deathDatetime || this.oldOne?.death_datetime)
      _cert.death_datetime = !!this._deathDatetime ? this._deathDatetime : null
    if (this._deathYear || this.oldOne?.death_year) _cert.death_year = !!this._deathYear ? this._deathYear : null
    if (this._deathKind || this.oldOne?.death_kind) _cert.death_kind = !!this._deathKind ? this._deathKind : null
    if (this._deathPlace || this.oldOne?.death_place) _cert.death_place = !!this.deathPlace ? this.deathPlace : null
    if (this._deathReasons.length > 0)
      _cert.death_reasons_attributes = this._deathReasons.map((item) => item.getAttributes())
    if (this.oldOne?.death_reasons && this.oldOne.death_reasons.length > 0) {
      let _temp = [] as IDeathReasonR[]
      this.oldOne.death_reasons.forEach((item) => {
        if (
          !_cert.death_reasons_attributes ||
          _cert.death_reasons_attributes.findIndex((el) => el.id === item.id) === -1
        )
          _temp.push({ id: item.id, _destroy: "1" } as IDeathReasonR)
      })
      if (_cert.death_reasons_attributes && _temp.length > 0)
        _cert.death_reasons_attributes = _cert.death_reasons_attributes.concat(_temp)
      else if (_temp.length > 0) _cert.death_reasons_attributes = _temp
    }
    if (this._educationLevel || this.oldOne?.education_level)
      _cert.education_level = !!this._educationLevel ? this._educationLevel : null
    if (this._establishedMedic || this.oldOne?.established_medic)
      _cert.established_medic = !!this._establishedMedic ? this._establishedMedic : null
    if (this._extReasonDescription || this.oldOne?.ext_reason_description)
      _cert.ext_reason_description = !!this.extReasonDescription ? this.extReasonDescription : null
    if (this._extReasonTime || this.oldOne?.ext_reason_time)
      _cert.ext_reason_time = !!this._extReasonTime ? this._extReasonTime : null
    if (this._lifeAreaType || this.oldOne?.life_area_type)
      _cert.life_area_type = !!this._lifeAreaType ? this._lifeAreaType : null
    if (this._policyOMS || this.oldOne?.policy_OMS) _cert.policy_OMS = !!this._policyOMS ? this._policyOMS : null
    if (this._pregnancyConnection || this.oldOne?.pregnancy_connection)
      _cert.pregnancy_connection = !!this.pregnancyConnection ? this.pregnancyConnection : null
    if (this._maritalStatus || this.oldOne?.marital_status)
      _cert.marital_status = !!this._maritalStatus ? this._maritalStatus : null
    if (this.nullFlavors.length > 0) _cert.null_flavors_attributes = this.null_flavors_attributes()
    if (this._reasonA && this._reasonA.diagnosis) _cert.a_reason_attributes = this._reasonA.getAttributes()
    else if (this.oldOne && this.oldOne.a_reason)
      _cert.a_reason_attributes = { id: this.oldOne.a_reason.id, _destroy: "1" } as IDeathReasonR
    if (this._reasonACME) _cert.reason_ACME = this._reasonACME.diagnosis?.ICD10
    if (this._reasonB && this._reasonB.diagnosis) _cert.b_reason_attributes = this._reasonB.getAttributes()
    else if (this.oldOne && this.oldOne.b_reason)
      _cert.b_reason_attributes = { id: this.oldOne.b_reason.id, _destroy: "1" } as IDeathReasonR
    if (this._reasonC && this._reasonC.diagnosis) _cert.c_reason_attributes = this._reasonC.getAttributes()
    else if (this.oldOne && this.oldOne.c_reason)
      _cert.c_reason_attributes = { id: this.oldOne.c_reason.id, _destroy: "1" } as IDeathReasonR
    if (this._reasonD && this._reasonD.diagnosis) _cert.d_reason_attributes = this._reasonD.getAttributes(true)
    else if (this.oldOne && this.oldOne.d_reason)
      _cert.d_reason_attributes = { id: this.oldOne.d_reason.id, _destroy: "1" } as IDeathReasonR
    if (this._series) _cert.series = this._series
    if (this._socialStatus || this.oldOne?.social_status)
      _cert.social_status = !!this._socialStatus ? this._socialStatus : null
    if (this._trafficAccident || this.oldOne?.traffic_accident) _cert.traffic_accident = this._trafficAccident
    if (this._patient) _cert.patient_attributes = this._patient.getAttributes()
    _cert.custodian_id = this._custodian_id || _cert.patient_attributes?.organization_id
    if (this._participant) _cert.participant_attributes = this._participant.getAttributes()
    //console.log("_cert", _cert)
    return _cert
  }
  //#region Getters - Setters
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
  get issueDate() {
    return this._issueDate
  }
  set issueDate(issueDate: Date | undefined) {
    this._issueDate = issueDate
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
  set certType(cert_type: number | undefined) {
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
    return this._audithor
  }
  set authenticator(value: Authenticator | undefined) {
    this._audithor = value
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
  set deathAddr(value: IAddressR | undefined) {
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
  get nullFlavors() {
    return this._nullFlavors
  }

  set nullFlavors(nullFlavors: INullFlavorR[]) {
    this._nullFlavors = nullFlavors
  }

  get participant(): Participant | undefined {
    return this._participant
  }
  set participant(value: Participant | undefined) {
    this._participant = value
  }
  get latestOne(): ICertificate | undefined {
    return this._latestOne
  }
  set latestOne(value: ICertificate | undefined) {
    this._latestOne = value
  }

  get oldOne(): ICertificate | undefined {
    return this._oldOne
  }

  //#endregion

  dispose() {
    // So, to avoid subtle memory issues, always call the
    // disposers when the reactions are no longer needed.
    this.disposers.forEach((disposer) => disposer())
  }
}
