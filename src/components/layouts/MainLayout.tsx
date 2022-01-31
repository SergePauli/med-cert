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
import { ProgressSpinner } from 'primereact/progressspinner'
import { addLocale } from 'primereact/api'
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
  const content =  layoutStore.isLoading ? <ProgressSpinner/> : props.content 
  addLocale('ru', {
    closeText: 'закрыть',
    prevText: 'назад',
    nextText: 'вперед',
    currentText: 'текущий',
    monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
    monthNamesShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн',
        'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
    dayNames: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
    dayNamesShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
    dayNamesMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
    weekHeader: 'Нед',
    firstDay: 1,
    isRTL: false,
    showMonthAfterYear: false,
    yearSuffix: '',
    month: 'Мес',
    week: 'Неделя',
    day: 'День',
    timeOnlyTitle: 'Выбор времени',
    timeText: 'Время',
    hourText: 'Часы',
    minuteText: 'Минуты',
    secondText: 'Секунды',
    allDayText: 'Полный день'
  })
  return (
  <div className={wrapperClass} data-theme='light'>    
    <div className='layout-content-wrapper' onClick={()=>onClickOutside()}>  
      <TopBarLayout  title = {props.title}  userInfo={userInfo} />        
      <div className='layout-content'>{content}
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

