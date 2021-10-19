import { makeAutoObservable } from "mobx"
import { IChildInfo } from "../IChildInfo"
import { INullFlavor } from "../INullFlavor"
import RelatedSubject from "./RelatedSubject"

export class ChildInfo {
  private _certificateId: number
  private _termPregnancy?: number | undefined
  private _weight?: number | undefined
  private _whichAccount?: number | undefined
  private _relatedSubject?: RelatedSubject | undefined
  private _nullFlavors: INullFlavor[]

  constructor(props: IChildInfo) {
    this._certificateId = props.certificate_id
    this._termPregnancy = props.term_pregnancy
    this._weight = props.weight
    this._whichAccount = props.which_account
    this._nullFlavors = props.nullFlavors || []
    if (props.related_subject) this._relatedSubject = new RelatedSubject(props.related_subject)
    makeAutoObservable(this)
  }

  get certificateId(): number {
    return this._certificateId
  }

  get termPregnancy(): number | undefined {
    return this._termPregnancy
  }
  set termPregnancy(value: number | undefined) {
    this._termPregnancy = value
  }
  get weight(): number | undefined {
    return this._weight
  }
  set weight(value: number | undefined) {
    this._weight = value
  }
  get whichAccount(): number | undefined {
    return this._whichAccount
  }
  set whichAccount(value: number | undefined) {
    this._whichAccount = value
  }
  get relatedSubject(): RelatedSubject | undefined {
    return this._relatedSubject
  }
  set relatedSubject(value: RelatedSubject | undefined) {
    this._relatedSubject = value
  }
  public get nullFlavors(): INullFlavor[] {
    return this._nullFlavors
  }
  public set nullFlavors(value: INullFlavor[]) {
    this._nullFlavors = value
  }
}
