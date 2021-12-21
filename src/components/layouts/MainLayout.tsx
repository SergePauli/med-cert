import React, { FC, useContext, useEffect, useState } from 'react'
import '../../styles/layout.css'
import { Context } from '../..'
import FooterLayout from './FooterLayout'
import SideBarLayout from './SideBarLayout'
import { TopBarLayout } from './TopBarLayout'
import { classNames } from 'primereact/utils'
import { observer } from 'mobx-react-lite'
import RightSideBarLayout  from './RightSideBarLayout'
import { IUserInfo } from '../../models/responses/IUserInfo'
import { ActionButtonLayout, IActionItem } from './ActionButtonLayout'

type MainLayoutProps = {
  title: string,
  url:string, 
  content:React.ReactElement
  actionItems?: IActionItem[]
 }

const MainLayout: FC<MainLayoutProps>=(props: MainLayoutProps) => { 
  const {layoutStore, userStore} = useContext(Context)
  const rightSideBarActive = layoutStore.rightSideBarActive()
  const layoutStaticInactive = layoutStore.layoutStaticInactive()
  const profileMenuActive = layoutStore.profileMenuActive()
  const notificationsMenuActive = layoutStore.notificationsMenuActive()  
  const onClickOutside = ()=>{
    if (rightSideBarActive) layoutStore.setRightSideBarActive(false)
    else if (profileMenuActive) layoutStore.setProfileMenuActive(false)
    else if (notificationsMenuActive) layoutStore.setNotificationsMenuActive(false)
  } 
  const wrapperClass = classNames("layout-wrapper layout-static p-ripple layout-sidebar-indigo",{"layout-static-inactive": layoutStaticInactive}, {"layout-mobile-active": layoutStore.tabletOrMobile()})
  const [userInfo, setUserInfo] = useState<IUserInfo | null>(null)   
  const userId = userStore.user().id   
  useEffect(()=>{ 
     if (userId!== undefined && userInfo === null) 
     setUserInfo(userStore.userInfo)     
    },[userId, userInfo, userStore.userInfo]
  )
    
  return (
  <div className={wrapperClass} data-theme='light'>    
    <div className='layout-content-wrapper' onClick={()=>onClickOutside()}>  
      <TopBarLayout  title = {props.title}  userInfo={userInfo} />        
      <div className='layout-content' >{props.content}
        <ActionButtonLayout items={props.actionItems}/>
      </div>
      <FooterLayout userInfo={userInfo} />
    </div>
    <SideBarLayout  activeUrl={props.url} /> 
    <RightSideBarLayout />     
    <div className="layout-search"></div>        
    <div className='layout-mask modal-in' onClick={()=>{layoutStore.setTabletOrMobile(false)}}></div>
  </div>  
  )
}
export default observer(MainLayout)

