import { makeAutoObservable } from "mobx"
import { INullFlavor } from "../INullFlavor"
import { IDeathReason } from "../responses/IDeathReason"
import { IDiagnosis } from "../responses/IDiagnosis"
import { v4 as uuidv4 } from "uuid"
import { Procedure } from "./Procedure"

export class DeathReason {
  private _id: string
  private _certificateId: number
  private _diagnosis?: IDiagnosis | undefined
  private _effectiveTime?: Date | undefined
  private _years?: number | undefined
  private _months?: number | undefined
  private _weeks?: number | undefined
  private _days?: number | undefined
  private _hours?: number | undefined
  private _minutes?: number | undefined
  private _procedures: Procedure[]
  private _nullFlavors: INullFlavor[]

  constructor(props: IDeathReason) {
    this._id = props.id || uuidv4()
    this._certificateId = props.certificate_id
    this._diagnosis = props.diagnosis
    this._effectiveTime = props.effective_time
    this._procedures = props.procedures?.map((proc) => new Procedure(proc)) || []
    this._nullFlavors = props.null_flavors || []
    makeAutoObservable(this)
  }
  get id(): string {
    return this._id
  }

  get certificateId(): number {
    return this._certificateId
  }
  get diagnosis(): IDiagnosis | undefined {
    return this._diagnosis
  }
  set diagnosis(value: IDiagnosis | undefined) {
    this._diagnosis = value
  }
  get effectiveTime(): Date | undefined {
    return this._effectiveTime
  }
  set effectiveTime(value: Date | undefined) {
    this._effectiveTime = value
  }
  get years(): number | undefined {
    return this._years
  }
  set years(value: number | undefined) {
    this._years = value
  }
  get months(): number | undefined {
    return this._months
  }
  set months(value: number | undefined) {
    this._months = value
  }
  get weeks(): number | undefined {
    return this._weeks
  }
  set weeks(value: number | undefined) {
    this._weeks = value
  }
  get days(): number | undefined {
    return this._days
  }
  set days(value: number | undefined) {
    this._days = value
  }
  get hours(): number | undefined {
    return this._hours
  }
  set hours(value: number | undefined) {
    this._hours = value
  }
  get minutes(): number | undefined {
    return this._minutes
  }
  set minutes(value: number | undefined) {
    this._minutes = value
  }
  get procedures(): Procedure[] {
    return this._procedures
  }
  set procedures(value: Procedure[]) {
    this._procedures = value
  }
  get nullFlavors(): INullFlavor[] {
    return this._nullFlavors
  }
  set nullFlavors(value: INullFlavor[]) {
    this._nullFlavors = value
  }
  procNames(): string {
    let _result = ""
    this._procedures.forEach((proc) => {
      _result += proc.textValue || proc.medicalServ.name
      if (proc.effectiveTime) _result += " от " + proc.timeStr()
      _result += ";"
    })
    return _result
  }
}
