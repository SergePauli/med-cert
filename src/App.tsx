import { observer } from 'mobx-react-lite'
import React, {FC, useState} from 'react'
import { useContext } from 'react'
import { useEffect } from 'react'
import { Context } from '.'
import LoginPage from './components/LoginPage'
import { IUser } from './models/IUser'
import UsersService from './services/UsersService'

const App: FC =() => {
  const {store} = useContext(Context)
  const [users, setUsers] = useState<IUser[]>([])
  useEffect(()=>{
    if (localStorage.getItem('token')) {
      store.checkAuth()
    }
  },[store])
    
  const getUsers = async ()=>{
    try {
      const response = await UsersService.fetchUsers()      
      if (response.data) setUsers(response.data) 
      else setUsers([])
    } catch (e) {
      console.log(e.response?.data?.message)
    }
  }
  
  if (store.isLoding) {
    return (<div>Загрузка...</div>)
  }
  if (store.isAuth) {
    return (
    <div>
      <h1>{`Авторизован ${store.user.email}`}</h1>   
        <button onClick={()=>getUsers()}>СПИСОК</button>   
        <button onClick={()=>store.logout()}>ВЫХОД</button>
        <ul>
        {users.map(user=><li key={user.id}>{user.email} {user.roles} {user.activated}</li>)}
        </ul>
    </div>
    )
  } else  return ( <LoginPage /> )
}

export default observer(App)
