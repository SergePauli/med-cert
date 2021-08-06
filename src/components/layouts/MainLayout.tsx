import { Button } from 'primereact/button'
import React, { FC, useContext } from 'react'
import '../../styles/layout.css'
import { Context } from '../..'
import FooterLayout from './FooterLayout'
import SideBarLayout from './SideBarLayout'

export type MainLayoutProps = { 
  isLayoutStaticInactive:boolean, 
  isTabletOrMobile:boolean,
  url:string, 
  content:React.ReactElement }

export const MainLayout:FC<MainLayoutProps>=(props={isLayoutStaticInactive:false, isTabletOrMobile:false, content: (<Button />)} as MainLayoutProps) => { 
  const {layoutStore} = useContext(Context)
  const menuHide =()=> {
    const { isLayoutStaticInactive } = props
    layoutStore.setSideBarVisible(!isLayoutStaticInactive)
  }
  return (
  <div className={ "layout-wrapper layout-static p-ripple layout-sidebar-indigo" +
          (props.isLayoutStaticInactive ? (props.isTabletOrMobile ? " layout-mobile-active" : " layout-static-inactive") : "")
        }
        data-theme='light'
      >
        <div className='layout-content-wrapper'>          
          <div className='layout-content'>{props.content}</div>
          <FooterLayout />
        </div>
        <SideBarLayout activeUrl={props.url} />
        
        <div className='layout-mask modal-in' onClick={()=>menuHide()}></div>
      </div>  
  )
}