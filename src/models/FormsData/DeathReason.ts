import { makeAutoObservable } from "mobx"
import { INullFlavor } from "../INullFlavor"
import { IDeathReason } from "../responses/IDeathReason"
import { IDiagnosis } from "../responses/IDiagnosis"
import { v4 as uuidv4 } from "uuid"

export class DeathReason {
  private _id?: string | undefined
  private _certificateId: number
  private _diagnosis?: IDiagnosis | undefined
  private _effectiveTime?: Date | undefined
  private _years?: number | undefined
  private _months?: number | undefined
  private _weeks?: number | undefined
  private _days?: number | undefined
  private _hours?: number | undefined
  private _minutes?: number | undefined
  private _nullFlavors: INullFlavor[]

  constructor(props: IDeathReason) {
    this._id = props.id || uuidv4()
    this._certificateId = props.certificate_id
    this._diagnosis = props.diagnosis
    this._effectiveTime = props.effective_time
    this._nullFlavors = props.nullFlavors || []
    makeAutoObservable(this)
  }
  get id(): string | undefined {
    return this._id
  }
  set id(value: string | undefined) {
    this._id = value
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
  get nullFlavors(): INullFlavor[] {
    return this._nullFlavors
  }
  set nullFlavors(value: INullFlavor[]) {
    this._nullFlavors = value
  }
}
