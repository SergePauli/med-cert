import { FC, useEffect, useState } from 'react'
import { IRouteMatch } from '../models/IRouteMatch'
import { IRouteProps } from '../models/IRouteProps'
import ava from '../images/ava.jpg'
import '../styles/pages/ProfilePage.css'
import { ROLES, USER_ROUTE } from '../utils/consts'
import MainLayout from '../components/layouts/MainLayout'
import { IUserInfo } from '../models/responses/IUserInfo'
import UsersService from '../services/UsersService'

// страница настроек профиля пользователя
// User profile page

// используем роут с параметром id для загрузки с API
interface IMatch extends IRouteMatch {  
  params: {id: number}
}
interface ProfilePageProps extends IRouteProps { 
    match: IMatch  
}


export const ProfilePage: FC<ProfilePageProps> = (props: ProfilePageProps) =>{ 
  const [user, setUser] = useState<IUserInfo | null>(null)
  useEffect(()=>{
    if (user===null && props.match.params.id) UsersService.getUser(props.match.params.id)
    .then(response=>setUser(response.data))
    .catch(()=>console.log('Ошибка получения пользователя')) 
  })
  const user_name = `${user?.person_name.family} ${user?.person_name.given_1}`
  const user_team = `${user!==null && user.roles ? ROLES[user.roles.split(' ')[0]] : ''} ${user?.organization.name}`
  const layoutParams = {
    title: 'Профиль пользователя',     
    url: USER_ROUTE,
    content: (<>  
    <div className="card widget-user-card">
      <div className="user-card-header">
        <img src={ava} alt="" className="user-card-avatar" />
      </div>
      <div className="user-card-body">
        <div className="user-card-title">{user_name}</div>
        <div className="user-card-subtext">{user_team}</div>
        <div className="p-grid user-card-stats">
          <div className="p-col-4">
            <i className="pi pi-users"></i>
            <div>14 Создано</div>
          </div>
          <div className="p-col-4">
            <i className="pi pi-bookmark"></i>
            <div>2 Выданно</div>
          </div>
          <div className="p-col-4">
            <i className="pi pi-check-square"></i>
            <div>6 Отправленно</div>
          </div>
        </div>
      </div>
    </div>      
  </>)
  }
  return (
    <>
      <MainLayout {...layoutParams} />
    </>
  )
}