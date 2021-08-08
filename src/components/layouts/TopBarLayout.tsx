import { observer } from 'mobx-react-lite'
import React, { useContext } from 'react'
import { Context } from '../..'
import { useMediaQuery } from 'react-responsive'
import ava from "../../images/ava.png"
type TopBarLayoutProps = {title: string}

export const TopBarLayout = observer((props: TopBarLayoutProps) =>{
  const {layoutStore} = useContext(Context)
  const isTOM = useMediaQuery({ query: "(max-width: 991px)" })
  const menuToggle=()=>{    
    if (isTOM && layoutStore.tabletOrMobile()) layoutStore.setTabletOrMobile(false) 
    else if (!layoutStore.tabletOrMobile()) layoutStore.setTabletOrMobile(true)
    else layoutStore.sideBarToggle()          
  } 
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
          <li className="notifications-item">
            <button type="button" className="p-link">
              <i className="pi pi-bell"></i>
              <span className="topbar-badge">5</span>
            </button>
          </li>
          <li className="profile-item">
            <button type="button" className="p-link">
              <img src={ava} alt="" className="profile-image"/>
              <span className="profile-name">Amelia Stone</span>
            </button>
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