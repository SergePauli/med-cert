import React, { createContext } from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import LayoutStore from './store/layoutStore'
import UserStore from './store/userStore'
interface IState{
  userStore: UserStore
  layoutStore: LayoutStore
}
const userStore = new UserStore()
const layoutStore = new LayoutStore()
export const Context = createContext<IState>({userStore, layoutStore}) 
ReactDOM.render(  
  <Context.Provider value={{userStore, layoutStore}} >
    <App />  
  </Context.Provider> , 
  document.getElementById('root')
)


