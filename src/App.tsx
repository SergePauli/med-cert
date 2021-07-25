import { observer } from 'mobx-react-lite'
import React, {FC} from 'react'
import { useContext } from 'react'
import { useEffect } from 'react'
import { Context } from '.'
import { LoginPage } from './components/LoginPage'

const App: FC =() => {
  const {store} = useContext(Context)
  useEffect(()=>{
    if (localStorage.getItem('token')) {
      store.checkAuth()
    }
  })  
  if (store.isLoding) {
    return (<div>Загрузка...</div>)
  }
  if (store.isAuth) {
    return (
    <div>
      <h1>{`Авторизован ${store.user.email}`}</h1>      
        <button onClick={()=>store.logout()}>logout</button>
    </div>)
  } else  return ( <LoginPage /> )
}

export default observer(App)
