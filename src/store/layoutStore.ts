export default class LayoutStore {
  private _isSideBarVisible: boolean
  constructor() {
    this._isSideBarVisible = true
  }
  setSideBarVisible(visible: boolean) {
    this._isSideBarVisible = visible
  }
  sideBarVisible() {
    return this._isSideBarVisible
  }
}
