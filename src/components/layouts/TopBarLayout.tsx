import { observer } from 'mobx-react-lite'
import { useContext, useEffect, useState } from 'react'
import { Context } from '../..'
import { useMediaQuery } from 'react-responsive'
import ava from "../../images/ava.png"
import { classNames } from 'primereact/utils'
import { MenuItem } from 'primereact/menuitem'
import { ProfileMenu } from '../menus/ProfileMenu'
import { ExtMenuItem } from '../menus/IMenuProps'
import { NotificationsMenu } from '../menus/NotificationsMenu'
import { IUserInfo } from '../../models/responses/IUserInfo'
import { DOCTORS_ROUTE, LIST_ROUTE, MO_SETTINGS_ROUTE, USER_ROUTE } from '../../utils/consts'
import { IActivityInfo } from '../../models/responses/IActivityInfo'
import UsersService from '../../services/UsersService'
type TopBarLayoutProps = {title: string,  userInfo: IUserInfo | null }
const detail_templ ="detail"
export const TopBarLayout = observer((props: TopBarLayoutProps) =>{
  const {layoutStore, userStore} = useContext(Context)
  const isTOM = useMediaQuery({ query: "(max-width: 991px)" })
  const profileMenuClassName = classNames("profile-item",{"active-menuitem fadeInDown":layoutStore.profileMenuActive()})
  const notificationsMenuClassName = classNames("notifications-item", {"active-menuitem":layoutStore.notificationsMenuActive()})
  const menuToggle=()=>{    
    if (isTOM && layoutStore.tabletOrMobile()) layoutStore.setTabletOrMobile(false) 
    else if (isTOM && !layoutStore.tabletOrMobile()) layoutStore.setTabletOrMobile(true)
    else layoutStore.sideBarToggle()          
  } 
  const [userActivity, setUserActivity] = useState<IActivityInfo | null | undefined>()
  
  useEffect(()=>{
    if (userActivity===undefined) {
      UsersService.getUserActivity().then((data)=>{        
        setUserActivity({...data.data})

      })
      .catch((reason)=>{
        console.log(reason.message)
        setUserActivity(null)
      })
    }
  },[userActivity])
  const items:MenuItem[] = [    
      {label:"Пользователь", icon:"pi-user", url:`${USER_ROUTE}/${userStore.userInfo?.id}`},
      {label:"Медорганизация", icon:"pi-building", url:`${MO_SETTINGS_ROUTE}/${userStore.userInfo?.organization.id}`}, 
      {label:"Врачи", icon:"pi-users", url:`${DOCTORS_ROUTE}`},     
      {label:"Выход", icon:"pi-power-off", command:()=>{userStore.logout()}},       
   ]
  const notif_items:ExtMenuItem[] = [    
      {label:`Создано ${detail_templ} свидетельств`, summary:"Новых", className:'p-success', icon:"pi-user", detail:userActivity?.created || 0, url:`${LIST_ROUTE}?created_at_gt=${userActivity?.logged}&issue_date_eq=null`, disabled: !userActivity || userActivity.created===0},
      {label:`Изменено ${detail_templ} свидетельств`, summary:"Измененных", className:'p-info', icon:"pi-pencil", detail:userActivity?.updated || 0, url:`${LIST_ROUTE}?updated_at_gt=${userActivity?.logged}`, disabled: !userActivity || userActivity.updated===0},
      {label:`Заменено ${detail_templ} свидетельств`, summary:"Замены", className:'p-info', icon:"pi-sync", detail:userActivity?.replaced || 0, url:`${LIST_ROUTE}?created_at_gt=${userActivity?.logged}&number_prev_neq=null`, disabled: !userActivity || userActivity.replaced===0},      
      {label:`Выданы родственникам ${detail_templ} свидетельств`, summary:"Выданно", icon:"pi-check", detail:userActivity?.issued || 0, url:`${LIST_ROUTE}?issue_date_gt=${userActivity?.logged}`, disabled: !userActivity || userActivity.issued===0}, 
      {label:`С замечаниями ${detail_templ} свидетельств`, className:'p-danger', summary:"Замечаний", icon:"pi-comment", detail:0, url:"/#", disabled: true},
      {label:`Проверены ${detail_templ} свидетельств`, summary:"Проверенно",  className:'p-success', icon:"pi-check-circle", detail:0, url:"/#", disabled: true},  
      {label:`Отправлены в ФРМСИ ${detail_templ}`, summary:"Отправлено", className:'p-success', icon:"pi-envelope", detail:0, url:"/#", disabled: true},
   ]
   
   
   const userName = props.userInfo!==null && props.userInfo.person_name ? 
   `${props.userInfo.person_name?.family} ${props.userInfo.person_name?.given_1[0]} ${props.userInfo.person_name?.given_2?.charAt(0) ||''}` : ''     
  return (
    <div className="layout-topbar">
      <div className="topbar-left">
        <button type="button" className="menu-button p-link" onClick={()=>menuToggle()}>
          <i className="pi pi-chevron-left"> </i>
        </button>
        <span className="topbar-separator"></span>
        <div className="layout-breadcrumb viewname">
          <span>{props.title}</span>
        </div>
      </div>
      <div className="topbar-right">
        <ul className="topbar-menu">          
          <li className={notificationsMenuClassName}>
            <button type="button" className="p-link"
            onClick={()=>layoutStore.setNotificationsMenuActive(true)}>
              <i className="pi pi-bell"></i>
              <span className="topbar-badge">{userActivity?.count || 0}</span>
            </button>
            <NotificationsMenu model={notif_items}/>
          </li>
          <li className={profileMenuClassName}>
            <button type="button" className="p-link" onClick={()=>layoutStore.setProfileMenuActive(true)}>
              <img src={ava} alt="" className="profile-image"/>
              <span className="profile-name">{userName}</span>
            </button>
            <ProfileMenu model={items}/>
          </li> 
          <li className="right-sidebar-item">
            <button type="button" className="p-link" onClick={()=>layoutStore.setRightSideBarActive(true)}>
              <i className="pi pi-align-right"></i>
            </button>
          </li>
        </ul>
      </div>
    </div>
  )
})