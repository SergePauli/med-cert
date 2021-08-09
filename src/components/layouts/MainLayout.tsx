import React, { FC, useContext, useState } from 'react'
import '../../styles/layout.css'
import { Context } from '../..'
import FooterLayout from './FooterLayout'
import SideBarLayout from './SideBarLayout'
import { TopBarLayout } from './TopBarLayout'
import { classNames } from 'primereact/utils'
import { observer } from 'mobx-react-lite'
import RightSideBarLayout  from './RightSideBarLayout'


type MainLayoutProps = {
  title: string,
  url:string, 
  content:React.ReactElement }

const MainLayout: FC<MainLayoutProps>=(props: MainLayoutProps) => { 
  const {layoutStore} = useContext(Context)
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
  
  return (
  <div className={wrapperClass} data-theme='light'>
    <div className='layout-content-wrapper' onClick={()=>onClickOutside()}>  
      <TopBarLayout  title = {props.title} />        
      <div className='layout-content' >{props.content}</div>
      <FooterLayout />
    </div>
    <SideBarLayout  activeUrl={props.url} /> 
    <RightSideBarLayout /> 
    <div className="layout-search"></div>        
    <div className='layout-mask modal-in' onClick={()=>{layoutStore.setTabletOrMobile(false)}}></div>
  </div>  
  )
}
export default observer(MainLayout)

