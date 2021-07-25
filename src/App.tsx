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
  },[])
  return (
    <div>
      <h1>{store.isAuth ? `Авторизован ${store.user.email}`: 'Авторизуйтесь'}</h1>
      <LoginPage />
    </div>
  )
}

export default observer(App)
