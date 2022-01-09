import { makeAutoObservable } from "mobx"
import { ISerializable } from "../common/ISerializabale"
import IIdentity from "../IIdentity"
import { INullFlavor } from "../INullFlavor"

export default class Identity implements ISerializable {
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
    this._id = props.id
    this._identityCardType = props.identityCardType
    if (props.series) this._series = props.series
    this._number = props.number
    this._issueOrgName = props.issueOrgName
    if (props.issueOrgCode) this._issueOrgCode = props.issueOrgCode
    this._issueOrgDate = props.issueOrgDate
    this._parentGUID = props.parentGUID
    this._nullFlavors = props.null_flavors || props.null_flavors_attributes || []
    makeAutoObservable(this, undefined, { deep: false })
  }
  getAttributes(): IIdentity {
    let _identity = {} as IIdentity
    if (this._id) _identity.id = this._id
    if (this._identityCardType) _identity.identityCardType = this._identityCardType
    if (this._issueOrgCode) _identity.issueOrgCode = this._issueOrgCode
    if (this._issueOrgDate) _identity.issueOrgDate = this._issueOrgDate
    if (this._issueOrgName) _identity.issueOrgName = this._issueOrgName
    if (this._nullFlavors.length > 0) _identity.null_flavors_attributes = this.null_flavors_attributes()
    if (this._number) _identity.number = this._number
    if (this._parentGUID) _identity.parentGUID = this._parentGUID
    if (this._series) _identity.series = this._series
    return _identity
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
  get nullFlavors() {
    return this._nullFlavors
  }
  set nullFlavors(nullFlavors: INullFlavor[]) {
    this._nullFlavors = nullFlavors
  }
  // получение копии массива заполнителей из Observable.array
  null_flavors_attributes() {
    return this._nullFlavors.map((el) => {
      return { ...el }
    })
  }
}
