import { makeAutoObservable } from "mobx"

export default class LayoutStore {
  private _isTabletOrMobile: boolean
  private _isLayoutStaticInactive: boolean
  private _isRightSidebarActive: boolean
  constructor() {
    this._isTabletOrMobile = false
    this._isLayoutStaticInactive = false
    this._isRightSidebarActive = false
    makeAutoObservable(this)
  }
  setTabletOrMobile(visible: boolean) {
    this._isTabletOrMobile = visible
  }
  tabletOrMobile() {
    return this._isTabletOrMobile
  }
  sideBarToggle() {
    this._isLayoutStaticInactive = !this._isLayoutStaticInactive
  }
  setLayoutStaticInactive(isLayoutStaticInactive: boolean) {
    this._isLayoutStaticInactive = isLayoutStaticInactive
  }
  layoutStaticInactive() {
    return this._isLayoutStaticInactive
  }
  rightSideBarActive() {
    return this._isRightSidebarActive
  }
  setRightSideBarActive(rightSidebarActive: boolean) {
    this._isRightSidebarActive = rightSidebarActive
  }
}
