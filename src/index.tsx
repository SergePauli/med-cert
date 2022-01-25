import { createContext } from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import AddressStore from './store/addressStore'
import CertificateStore from './store/certificateStore'
import LayoutStore from './store/layoutStore'
import TemporaryIDStore from './store/temporaryIDStore'
import UserStore from './store/userStore'
interface IState{
  userStore: UserStore
  layoutStore: LayoutStore
  certificateStore: CertificateStore
  addressStore: AddressStore 
  temporaryIDStore: TemporaryIDStore 
}
const userStore = new UserStore()
const layoutStore = new LayoutStore()
const certificateStore = new CertificateStore()
const addressStore = new AddressStore()
const temporaryIDStore = new TemporaryIDStore()
addressStore.fetchRegionOptions()
export const Context = createContext<IState>({userStore, layoutStore, addressStore, certificateStore, temporaryIDStore}) 
ReactDOM.render(  
  <Context.Provider value={{userStore, layoutStore, addressStore, certificateStore, temporaryIDStore}} >
    <App />  
  </Context.Provider> , 
  document.getElementById('root')
)


