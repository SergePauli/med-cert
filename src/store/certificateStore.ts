import { makeAutoObservable } from "mobx"
import { IReference } from "../models/IReference"
import { ICertificateResponse } from "../models/responses/ICertificateResponse"

export default class CertificateStore {
  private _cert: ICertificateResponse

  constructor() {
    this._cert = {} as ICertificateResponse
    this._cert.eff_time = new Date()
    makeAutoObservable(this)
  }

  id() {
    return this._cert.id
  }

  setId(id: number) {
    this._cert.id = id
  }
  setNumber(number: string) {
    this._cert.number = number
  }
  number() {
    return this._cert.number
  }
  setSeries(series: string) {
    this._cert.series = series
  }
  series() {
    return this._cert.series
  }
  setEff_time(eff_time: Date) {
    this._cert.eff_time = eff_time
  }
  eff_time() {
    return this._cert.eff_time
  }
  setNumber_prev(number_prev: string) {
    this._cert.number_prev = number_prev
  }
  number_prev() {
    return this._cert.number_prev
  }
  setSeries_prev(series_prev: string) {
    this._cert.series_prev = series_prev
  }
  series_prev() {
    return this._cert.series_prev
  }
  setEff_time_prev(eff_time_prev: Date) {
    this._cert.eff_time_prev = eff_time_prev
  }
  eff_time_prev() {
    return this._cert.eff_time_prev
  }
  setCert_type(cert_type: IReference) {
    this._cert.cert_type = cert_type
  }
  cert_type() {
    return this._cert.cert_type
  }
}
