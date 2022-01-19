import { makeAutoObservable } from "mobx"

export default class LayoutStore {
  private _isTabletOrMobile: boolean
  private _isLayoutStaticInactive: boolean
  private _isRightSidebarActive: boolean
  private _isProfileMenuActive: boolean
  private _isNotificationsMenuActive: boolean
  private _isLoading: boolean

  constructor() {
    this._isTabletOrMobile = false
    this._isLayoutStaticInactive = false
    this._isRightSidebarActive = false
    this._isProfileMenuActive = false
    this._isNotificationsMenuActive = false
    this._isLoading = false
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
  profileMenuActive() {
    return this._isProfileMenuActive
  }
  setProfileMenuActive(profileMenuActive: boolean) {
    this._isProfileMenuActive = profileMenuActive
  }
  notificationsMenuActive() {
    return this._isNotificationsMenuActive
  }
  setNotificationsMenuActive(notificationsMenuActive: boolean) {
    this._isNotificationsMenuActive = notificationsMenuActive
  }
  get isLoading(): boolean {
    return this._isLoading
  }
  set isLoading(value: boolean) {
    this._isLoading = value
  }
}
