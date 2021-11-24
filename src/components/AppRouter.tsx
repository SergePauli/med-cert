import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { useContext } from 'react'
import { FC } from 'react'
import { Route, Switch, useHistory } from 'react-router-dom'
import { Context } from '..'
import { NoMatchPage } from '../pages/NoMatchPage'
import { AUTH_ROUTES, NON_AUTH_ROUTES, PUBLIC_ROUTES } from '../routes'

const AppRouter: FC = observer(() => {  
  const history = useHistory()
  const {userStore} = useContext(Context) 
  const token =  userStore.token()
  const isAuth =  userStore.isAuth()
  userStore.setHistory(history)  
  useEffect(()=>{
    if (token.length>0 && !isAuth) {
      userStore.checkAuth()
    }   
  },[token, userStore, isAuth])  
  const chech_routes =  userStore.isAuth() || (token.length>0) ?  AUTH_ROUTES : NON_AUTH_ROUTES    
  return (
    <Switch> 
      { chech_routes.map(
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
