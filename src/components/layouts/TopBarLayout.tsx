import { observer } from 'mobx-react-lite'
import { useContext } from 'react'
import { Context } from '../..'
import { useMediaQuery } from 'react-responsive'
import ava from "../../images/ava.png"
import { classNames } from 'primereact/utils'
import { MenuItem } from 'primereact/menuitem'
import { ProfileMenu } from '../menus/ProfileMenu'
import { ExtMenuItem } from '../menus/IMenuProps'
import { NotificationsMenu } from '../menus/NotificationsMenu'
import { IUserInfo } from '../../models/responses/IUserInfo'
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
  const items:MenuItem[] = [    
      {label:"Пользователь", icon:"pi-user", url:"/#"},
      {label:"Настройки", icon:"pi-cog", url:"/#"}, 
      {label:"Врачи", icon:"pi-users", url:"/doctors"},     
      {label:"Выход", icon:"pi-power-off", command:()=>{userStore.logout()}},       
   ]
  const notif_items:ExtMenuItem[] = [    
      {label:`Создано ${detail_templ} свидетельств`, summary:"Новых", className:'p-success', icon:"pi-user", detail:3, url:"/#"},
      {label:`Заменено ${detail_templ} свидетельств`, summary:"Замены", className:'p-info', icon:"pi-cog", detail:2, url:"/#"},      
      {label:`Выданы родственникам ${detail_templ} свидетельств`, summary:"Выданно", icon:"pi-cog", detail:5, url:"/#"}, 
      {label:`С замечаниями ${detail_templ} свидетельств`, className:'p-danger', summary:"Замечаний", icon:"pi-cog", detail:1, url:"/#"},
      {label:`Проверены ${detail_templ} свидетельств`, summary:"Проверенно",  className:'p-success', icon:"pi-cog", detail:3, url:"/#"},  
      {label:`Отправлены в ФРМСИ ${detail_templ}`, summary:"Отправлено", className:'p-success', icon:"pi-cog", detail:2, url:"/#"},
   ]
   const notif_amount = notif_items.reduce((previtem, item, sum)=>{
    return sum += item.detail
   },0)
   
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
              <span className="topbar-badge">{notif_amount}</span>
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