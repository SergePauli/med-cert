import { observer } from 'mobx-react-lite'
import React, {FC, useState} from 'react'
import { useContext } from 'react'
import { useEffect } from 'react'
import { Context } from '.'
import { BrowserRouter } from 'react-router-dom'
import { AppRouter } from './components/AppRouter'

const App: FC =() => {
  const {store} = useContext(Context)  
  useEffect(()=>{
    if (localStorage.getItem('token')) {
      store.checkAuth()
    }
  },[store]) 
   
  return (
    <BrowserRouter>
      <AppRouter/>
    </BrowserRouter>  
  )  
}

export default observer(App)
