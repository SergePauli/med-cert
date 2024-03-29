import { makeAutoObservable } from "mobx"
import { NULL_FLAVOR_IDX } from "../../utils/defaults"
import { ISerializable } from "../common/ISerializabale"
import IIdentity from "../IIdentity"
import { INullFlavorR } from "../INullFlavor"
import IIdentityR from "../requests/IIdentityR"

export default class Identity implements ISerializable {
  private _id?: string
  private _identityCardType: number
  private _series?: string
  private _number: string | undefined
  private _issueOrgName: string | undefined
  private _issueOrgCode?: string | undefined
  private _issueOrgDate: Date | undefined
  private _parentGUID: string
  private _nullFlavors: INullFlavorR[]
  constructor(props: IIdentity) {
    this._id = props.id
    this._identityCardType = props.identity_card_type_id
    if (props.series) this._series = props.series
    this._number = props.number
    this._issueOrgName = props.issueOrgName
    if (props.issueOrgCode) this._issueOrgCode = props.issueOrgCode
    if (props.issueDate) this._issueOrgDate = new Date(props.issueDate)
    this._parentGUID = props.parentGUID
    this._nullFlavors =
      props.null_flavors?.map((item) => {
        return { ...item, code: NULL_FLAVOR_IDX[item.code] } as INullFlavorR
      }) || []
    makeAutoObservable(this, undefined, { deep: false })
  }
  getAttributes(): IIdentityR {
    let _identity = {} as IIdentityR
    if (this._id) _identity.id = this._id
    if (this._identityCardType) _identity.identity_card_type_id = this._identityCardType
    if (this._issueOrgCode) _identity.issueOrgCode = this._issueOrgCode
    if (this._issueOrgDate) _identity.issueDate = this._issueOrgDate.toDateString()
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
  set identityCardType(ct: number) {
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
  set nullFlavors(nullFlavors: INullFlavorR[]) {
    this._nullFlavors = nullFlavors
  }
  // получение копии массива заполнителей из Observable.array
  null_flavors_attributes() {
    return this._nullFlavors.map((el) => {
      return { ...el }
    })
  }
}
