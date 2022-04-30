import { autorun, configure, makeAutoObservable } from "mobx"
import Certificate from "../models/FormsData/Certificate"
import { IPatient } from "../models/IPatient"
import { ICertificate } from "../models/responses/ICertificate"
import { IUserInfo } from "../models/responses/IUserInfo"
import CertificateService from "../services/CertificateService"
import { ID_CARD_TYPES, NULL_FLAVOR_IDX, PASSPORT_RF } from "../utils/defaults"
import { DeathReason } from "../models/FormsData/DeathReason"
import { IDeathReason } from "../models/responses/IDeathReason"
import { IAddressR } from "../models/requests/IAddressR"
import { INullFlavorR } from "../models/INullFlavor"
configure({
  enforceActions: "never",
})
export default class CertificateStore {
  private _cert: Certificate
  private _submitted: boolean
  private _userInfo?: IUserInfo | undefined
  private _certs: ICertificate[]
  private _selected: number
  private _sorts: string[] | undefined
  private _filters: any
  private _first: number
  private _last: number
  private _rows: number
  private _count: number
  private _needFetch: boolean

  disposers: (() => void)[]
  constructor() {
    this._submitted = false
    this.disposers = []
    this._certs = []
    this._filters = {}
    this._first = 0
    this._last = 0
    this._rows = 0
    this._count = 0
    this._needFetch = true
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
    this._selected = 0
    makeAutoObservable(this, undefined, { deep: false })

    // реакции на изменение данных
    this.disposers[0] = autorun(() => {
      let _q = { ...this._filters }
      //console.log("фильтры", this._filters)
      if (this._userInfo && !this._userInfo.roles.includes("MIAC")) _q.custodian_id_eq = this._userInfo?.organization.id
      if (this._filters) {
        this._needFetch = true
        CertificateService.getCount({ q: _q })
          .then((value) => {
            this._count = value.data
            //console.log("надено", this._count)
          })
          .catch((reason) => console.log(reason))
      }
    })
    this.disposers[1] = autorun(() => {
      if (this._sorts) this._needFetch = true
    })
  }

  //#region setters-getters
  get cert() {
    return this._cert
  }
  set cert(value: Certificate) {
    this._cert = value
  }

  get submitted(): boolean {
    return this._submitted
  }
  set submitted(value: boolean) {
    this._submitted = value
  }
  get certs(): ICertificate[] {
    return this._certs.map((el) => {
      return { ...el }
    })
  }
  get userInfo(): IUserInfo | undefined {
    return this._userInfo
  }
  set userInfo(value: IUserInfo | undefined) {
    this._userInfo = value
  }
  get sorts(): string[] | undefined {
    return this._sorts
  }
  set sorts(value: string[] | undefined) {
    this._sorts = value
  }
  get filters(): any {
    return this._filters
  }
  set filters(value: any) {
    this._filters = value
  }
  get first(): number {
    return this._first
  }
  set first(value: number) {
    this._first = value
  }
  get rows(): number {
    return this._rows
  }
  set rows(value: number) {
    this._rows = value
  }
  get count(): number {
    return this._count
  }
  set count(value: number) {
    this._count = value
  }
  //#endregion
  createNew(id = -1) {
    this._cert = new Certificate({
      id: id,
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
  replace() {
    const old = this._certs.find((cert) => cert.id === this._cert.id)
    if (!old) return
    this._cert = new Certificate({
      id: -1,
      custodian: old.custodian,
      patient: old.patient,
      basis_determining: old.basis_determining,
      cert_type: old.cert_type === 1 ? 4 : 3,
      death_area_type: old.death_area_type,
      death_kind: old.death_kind,
      death_datetime: old.death_datetime,
      death_place: old.death_place,
      death_year: old.death_year,
      education_level: old.education_level,
      eff_time_prev: old.issue_date,
      established_medic: old.established_medic,
      ext_reason_description: old.ext_reason_description,
      ext_reason_time: old.ext_reason_time,
      life_area_type: old.life_area_type,
      marital_status: old.marital_status,
      number_prev: old.number,
      policy_OMS: old.policy_OMS,
      pregnancy_connection: old.pregnancy_connection,
      reason_ACME: old.reason_ACME,
      series_prev: old.series,
      social_status: old.social_status,
      traffic_accident: old.traffic_accident,
    } as ICertificate)
    if (old.a_reason)
      this._cert.reasonA = new DeathReason({
        days: old.a_reason.days,
        diagnosis: old.a_reason.diagnosis,
        effective_time: old.a_reason.effective_time,
        hours: old.a_reason.hours,
        null_flavors: old.a_reason.null_flavors?.map((item) => {
          return { code: item.code, parent_attr: item.parent_attr }
        }),
        minutes: old.a_reason.minutes,
        months: old.a_reason.months,
        years: old.a_reason.years,
        weeks: old.a_reason.weeks,
      } as IDeathReason)
    else this._cert.reasonA = new DeathReason({} as IDeathReason)
    if (old.b_reason)
      this._cert.reasonB = new DeathReason({
        days: old.b_reason.days,
        diagnosis: old.b_reason.diagnosis,
        effective_time: old.b_reason.effective_time,
        hours: old.b_reason.hours,
        null_flavors: old.b_reason.null_flavors?.map((item) => {
          return { code: item.code, parent_attr: item.parent_attr }
        }),
        minutes: old.b_reason.minutes,
        months: old.b_reason.months,
        years: old.b_reason.years,
        weeks: old.b_reason.weeks,
      } as IDeathReason)
    if (old.c_reason)
      this._cert.reasonC = new DeathReason({
        days: old.c_reason.days,
        diagnosis: old.c_reason.diagnosis,
        effective_time: old.c_reason.effective_time,
        hours: old.c_reason.hours,
        null_flavors: old.c_reason.null_flavors?.map((item) => {
          return { code: item.code, parent_attr: item.parent_attr }
        }),
        minutes: old.c_reason.minutes,
        months: old.c_reason.months,
        years: old.c_reason.years,
        weeks: old.c_reason.weeks,
      } as IDeathReason)
    if (old.d_reason)
      this._cert.reasonD = new DeathReason({
        days: old.d_reason.days,
        diagnosis: old.d_reason.ext_diagnosis,
        effective_time: old.d_reason.effective_time,
        hours: old.d_reason.hours,
        null_flavors: old.d_reason.null_flavors?.map((item) => {
          return { code: item.code, parent_attr: item.parent_attr }
        }),
        minutes: old.d_reason.minutes,
        months: old.d_reason.months,
        years: old.d_reason.years,
        weeks: old.d_reason.weeks,
      } as IDeathReason)
    if (old.death_reasons)
      this._cert.deathReasons = old.death_reasons.map(
        (reason) =>
          new DeathReason({
            days: reason.days,
            diagnosis: reason.diagnosis,
            effective_time: reason.effective_time,
            hours: reason.hours,
            null_flavors: reason.null_flavors?.map((item) => {
              return { code: item.code, parent_attr: item.parent_attr }
            }),
            minutes: reason.minutes,
            months: reason.months,
            years: reason.years,
            weeks: reason.weeks,
            procedures: reason.procedures?.map((item) => {
              return {
                effective_time: item.effective_time,
                medical_serv: item.medical_serv,
                text_value: item.text_value,
                null_flavors: item.null_flavors?.map((item) => {
                  return { code: item.code, parent_attr: item.parent_attr }
                }),
              }
            }),
          } as IDeathReason)
      )
    else this._cert.deathReasons = []
    if (old.death_addr)
      this._cert.deathAddr = {
        ...old.death_addr,
        null_flavors_attributes:
          old.death_addr?.null_flavors?.map((item) => {
            return { parent_attr: item.parent_attr, code: NULL_FLAVOR_IDX[item.code] } as INullFlavorR
          }) || [],
        id: undefined,
        parent_guid: undefined,
        null_flavors: null,
      } as IAddressR

    old.latest_one = this._cert.oldOne
  }

  save(onSuccess?: (data: ICertificate) => void, onError?: (message: string) => void, sm_code?: string) {
    if (!this._userInfo) return false
    if (!this._cert.patient.provider_organization)
      this._cert.patient.provider_organization = this.userInfo?.organization.id
    const request = this._cert.getAttributes()
    if (!request.id && sm_code) {
      request.number = sm_code
      if (request.patient_attributes?.id) {
        request.patient_id = request.patient_attributes?.id
        request.patient_attributes = undefined
      }
    }
    //console.log("request", request)
    return !request.id
      ? CertificateService.addCertificate(request)
          .then((response) => {
            const nCert = response.data
            if (nCert) {
              const idx = this._certs.length
              this._certs.push(nCert)
              this.select(idx)
              if (onSuccess) onSuccess(nCert)
              //console.log("nCert", nCert)
            } else {
              if (onError)
                onError("Cвидетельство сохранено, но сервер не вернул результат. Необходим повторный вход в систему")
            }
          })
          .catch((reason) => {
            if (onError) onError(reason)
          })
      : CertificateService.updateCertificate({ Certificate: request })
          .then((response) => {
            const nCert = response.data
            if (nCert) {
              const idx = this._certs.findIndex((cert) => cert.id === nCert.id)
              this._certs[idx] = nCert
              //console.log("nCert", nCert)
              this.select(idx)
              if (onSuccess) onSuccess(nCert)
            } else {
              if (onError)
                onError("Свидетельство сохранено, но сервер не вернул результат. Необходим повторный вход в систему")
            }
          })
          .catch((reason) => {
            if (onError) onError(reason)
          })
  }
  delete() {
    if (this._cert.id === -1) return false
    else return CertificateService.removeCertificate(this._cert.id)
  }

  clean(num = this._selected) {
    try {
      this._certs.splice(num)
      const dataLength = this._certs.length
      if (dataLength > 0) {
        this.select(this._selected > dataLength - 1 ? dataLength - 1 : this._selected)
      } else {
        this.createNew(-1)
        this._selected = 0
      }
    } catch {
      throw Error("Not valid certificate number")
    }
  }

  select(num: number) {
    this._cert = new Certificate(this._certs[num])
    this._selected = num
  }

  getList(doAfter?: () => void, first = this._first, last = this._first + this._rows) {
    let _q = { ...this._filters, sorts: this._sorts }
    if (this._userInfo && !this._userInfo.roles.includes("MIAC")) _q.custodian_id_eq = this._userInfo?.organization.id
    else if (!this._userInfo) return false
    const isAdd = !this._needFetch && first === this.first
    //console.log("getList response", first, last)
    CertificateService.getCertificates({ q: _q }, isAdd ? this._last + 1 : first, last)
      .then((response) => {
        if (isAdd && this._needFetch) return // case that loaded data already not needed
        let num = isAdd ? this._certs.length : 0
        const _certs = isAdd
          ? this._certs.concat(
              response.data.map((cert) => {
                return { ...cert, rowNumber: ++num }
              })
            )
          : response.data.map((cert) => {
              return { ...cert, rowNumber: ++num }
            })
        this._certs = _certs
        const dataLength = response.data.length
        if (dataLength > 0) {
          this._rows = this._certs.length
          this._needFetch = false
          this.select(this._selected > dataLength ? dataLength - 1 : this._selected)
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        if (doAfter) doAfter()
      })
    this._first = first
    this._last = last
  }

  findById(certificate_id: number, doAfter?: () => void) {
    if (!this._userInfo) return false
    CertificateService.getCertificates({
      q: { custodian_id_eq: this._userInfo.organization.id, id_eq: certificate_id },
    })
      .then((response) => {
        if (response.data && response.data.length > 0) this._cert = new Certificate(response.data[0])
        if (response.data) {
          this.certs.push(response.data[0])
          this.select(0)
        }
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
