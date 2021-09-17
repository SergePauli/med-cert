import React, { createContext } from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import CertificateStore from './store/certificateStore'
import LayoutStore from './store/layoutStore'
import UserStore from './store/userStore'
interface IState{
  userStore: UserStore
  layoutStore: LayoutStore
  certificateStore: CertificateStore
}
const userStore = new UserStore()
const layoutStore = new LayoutStore()
const certificateStore = new CertificateStore()
export const Context = createContext<IState>({userStore, layoutStore, certificateStore}) 
ReactDOM.render(  
  <Context.Provider value={{userStore, layoutStore, certificateStore}} >
    <App />  
  </Context.Provider> , 
  document.getElementById('root')
)


