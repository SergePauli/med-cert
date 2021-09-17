import React, { createContext } from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import AddressStore from './store/addressStore'
import CertificateStore from './store/certificateStore'
import LayoutStore from './store/layoutStore'
import UserStore from './store/userStore'
interface IState{
  userStore: UserStore
  layoutStore: LayoutStore
  certificateStore: CertificateStore
  addressStore: AddressStore
}
const userStore = new UserStore()
const layoutStore = new LayoutStore()
const certificateStore = new CertificateStore()
const addressStore = new AddressStore()
export const Context = createContext<IState>({userStore, layoutStore, addressStore, certificateStore}) 
ReactDOM.render(  
  <Context.Provider value={{userStore, layoutStore, addressStore, certificateStore}} >
    <App />  
  </Context.Provider> , 
  document.getElementById('root')
)


