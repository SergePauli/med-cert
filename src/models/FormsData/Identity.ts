import { makeAutoObservable } from "mobx"
import { v4 as uuidv4 } from "uuid"
import IIdentity from "../IIdentity"
import { INullFlavor } from "../INullFlavor"

export default class Identity {
  private _id?: string
  private _identityCardType: string
  private _series?: string
  private _number: string | undefined
  private _issueOrgName: string | undefined
  private _issueOrgCode?: string | undefined
  private _issueOrgDate: Date | undefined
  private _parentGUID: string
  private _nullFlavors: INullFlavor[]
  constructor(props: IIdentity) {
    this._id = props.id || uuidv4()
    this._identityCardType = props.identityCardType
    if (props.series) this._series = props.series
    this._number = props.number
    this._issueOrgName = props.issueOrgName
    if (props.issueOrgCode) this._issueOrgCode = props.issueOrgCode
    this._issueOrgDate = props.issueOrgDate
    this._parentGUID = props.parentGUID
    this._nullFlavors = props.null_flavors || []
    makeAutoObservable(this)
  }
  get identityCardType() {
    return this._identityCardType
  }
  set identityCardType(ct: string) {
    this._identityCardType = ct
  }
  get series() {
    return this._series ? this._series : ""
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
  get issueOrgName() {
    return this._issueOrgName
  }
  set issueOrgName(issueOrgName: string | undefined) {
    this._issueOrgName = issueOrgName
  }
  get issueOrgDate() {
    return this._issueOrgDate
  }
  set issueOrgDate(issueOrgDate: Date | undefined) {
    this._issueOrgDate = issueOrgDate
  }
  get issueOrgCode() {
    return this._issueOrgCode ? this._issueOrgCode : ""
  }
  set issueOrgCode(issueOrgCode: string | undefined) {
    this._issueOrgCode = issueOrgCode
  }
  get parentGUID() {
    return this._parentGUID
  }
  nullFlavors() {
    return this._nullFlavors
  }
  setNullFlavors(nullFlavors: INullFlavor[]) {
    this._nullFlavors = nullFlavors
  }
}
