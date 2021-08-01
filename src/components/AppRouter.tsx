import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { useContext } from 'react'
import { FC } from 'react'
import { Route, Switch, useHistory } from 'react-router-dom'
import { Context } from '..'
import { NoMatchPage } from '../pages/NoMatchPage'
import { AUTH_ROUTES, PUBLIC_ROUTES } from '../routes'

const AppRouter: FC = observer(() => {  
  const history = useHistory()
  const {userStore} = useContext(Context) 
  userStore.setHistory(history) 
  useEffect(()=>{
    if (localStorage.getItem('token')) {
      userStore.checkAuth()
    }
  },[userStore])     
  return (
    <Switch> 
      {userStore.isAuth() && AUTH_ROUTES.map(
        ({path, Component})=><Route key={path} path={path} component={Component} exact/>)
      }      
      { PUBLIC_ROUTES.map(
        ({path, Component})=><Route key={path} path={path} component={Component} exact/>)
      }
      <Route component={NoMatchPage} />                         
    </Switch>     
  )
})
export default AppRouter
