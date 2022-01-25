export default class TemporaryIDStore {
  private _lastCertificateID: number
  private _lastDeathReasonID: number
  private _lastProcedureID: number

  constructor() {
    this._lastCertificateID = -1
    this._lastDeathReasonID = -1
    this._lastProcedureID = -1
  }
  get lastCertificateID(): number {
    return this._lastCertificateID--
  }
  get lastDeathReasonID(): number {
    return this._lastDeathReasonID--
  }
  get lastProcedureID(): number {
    return this._lastProcedureID--
  }
}
