import React, { createContext } from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import UserStore from './store/userStore'
interface IState{
  userStore: UserStore
}
const userStore = new UserStore()
export const Context = createContext<IState>({userStore}) 
ReactDOM.render(  
  <Context.Provider value={{userStore}} >
    <App />  
  </Context.Provider> , 
  document.getElementById('root')
)


