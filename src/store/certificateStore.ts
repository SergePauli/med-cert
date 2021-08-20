import { makeAutoObservable } from "mobx"
import { IReference } from "../models/IReference"
import { ISuggestions } from "../models/ISuggestions"
import { ICertificateResponse } from "../models/responses/ICertificateResponse"
import { DEFAULT_CERT_SUGGESTIONS } from "../utils/defaults"

export default class CertificateStore {
  private _cert: ICertificateResponse
  private _suggestions: ISuggestions[]
  constructor() {
    this._cert = {} as ICertificateResponse
    this._cert.eff_time = new Date()
    this._suggestions = DEFAULT_CERT_SUGGESTIONS
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
    if (!this._suggestions[0].done) {
      const newValue = [...this._suggestions]
      newValue[0].done = true
      this.setSuggestions(newValue)
    }
  }
  cert_type() {
    return this._cert.cert_type
  }
  isCert_type() {
    return this._cert.cert_type?.code ? true : false
  }
  setSuggestions(suggestions: ISuggestions[]) {
    this._suggestions = suggestions
  }
  suggestions() {
    return this._suggestions
  }
  redSuggestionsCount() {
    return this._suggestions.reduce((result, item) => {
      if (!item.done) ++result
      return result
    }, 0)
  }
}
