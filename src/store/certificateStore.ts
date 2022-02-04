import { autorun, configure, makeAutoObservable } from "mobx"
import Certificate from "../models/FormsData/Certificate"
import { IPatient } from "../models/IPatient"
import { ICertificate } from "../models/responses/ICertificate"
import { IUserInfo } from "../models/responses/IUserInfo"
import CertificateService from "../services/CertificateService"
import { ID_CARD_TYPES, PASSPORT_RF } from "../utils/defaults"
configure({
  enforceActions: "never",
})
export default class CertificateStore {
  private _cert: Certificate
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
    this._selected = 0
    makeAutoObservable(this, undefined, { deep: false })

    // проверки полноты заполнения свидетельства
    // работают как реакции на изменение данных
    this.disposers[0] = autorun(() => {})
  }

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
  save(onSuccess?: (data: ICertificate) => void, onError?: (message: string) => void, sm_code?: string) {
    if (!this._userInfo) return false
    if (!this._cert.patient.provider_organization)
      this._cert.patient.provider_organization = this.userInfo?.organization.id
    const request = this._cert.getAttributes()
    if (!request.id && sm_code) request.number = sm_code
    console.log("request", request)
    return !request.id
      ? CertificateService.addCertificate(request)
          .then((response) => {
            const nCert = response.data
            if (nCert) {
              const idx = this._certs.length
              this._certs.push(nCert)
              this.select(idx)
              if (onSuccess) onSuccess(nCert)
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

  getList(doAfter?: () => void) {
    if (!this._userInfo) return false
    CertificateService.getCertificates({ q: { custudian_id_eq: this._userInfo?.organization.id } })
      .then((response) => {
        this._certs = response.data
        //console.log("getList response", { q: { custudian_id_eq: this._userInfo?.organization.id } }, response.data)
        const dataLength = response.data.length
        if (dataLength > 0) {
          this.select(this._selected > dataLength ? dataLength - 1 : this._selected)
        }
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
        console.log(
          "findById response",
          { custudian_id_eq: this._userInfo?.organization.id, id_eq: certificate_id },
          response.data
        )
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
