import { createContext } from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import AddressStore from './store/addressStore'
import CertificateStore from './store/certificateStore'
import LayoutStore from './store/layoutStore'
import SuggestionsStore from './store/suggestionsStore'
import TemporaryIDStore from './store/temporaryIDStore'
import UserStore from './store/userStore'
interface IState{
  userStore: UserStore
  layoutStore: LayoutStore
  certificateStore: CertificateStore
  suggestionsStore: SuggestionsStore
  addressStore: AddressStore 
  temporaryIDStore: TemporaryIDStore 
}
const userStore = new UserStore()
const layoutStore = new LayoutStore()
const certificateStore = new CertificateStore()
const suggestionsStore = new SuggestionsStore(certificateStore)
const addressStore = new AddressStore()
const temporaryIDStore = new TemporaryIDStore()
addressStore.fetchRegionOptions()
export const Context = createContext<IState>({userStore, layoutStore, addressStore, certificateStore, temporaryIDStore,suggestionsStore}) 
ReactDOM.render(  
  <Context.Provider value={{userStore, layoutStore, addressStore, certificateStore, temporaryIDStore, suggestionsStore}} >
    <App />  
  </Context.Provider> , 
  document.getElementById('root')
)


