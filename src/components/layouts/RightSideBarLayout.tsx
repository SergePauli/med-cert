import { observer } from 'mobx-react-lite'
import { classNames } from 'primereact/utils'
import { FC, useContext, useEffect, useState } from 'react'
import { Context } from '../..'
import { ACTIONS,  ITimeEvent } from '../../models/responses/ITimeEvent'
import {  TIME_FORMAT } from '../../utils/consts'
import AuditService from '../../services/AuditService'


type RightSideBarLayoutProps = {}

const RightSideBarLayout: FC<RightSideBarLayoutProps> = (props: RightSideBarLayoutProps) =>{ 
  const {layoutStore, userStore} = useContext(Context)
  const className = classNames("layout-sidebar-right", {"layout-sidebar-right-active": layoutStore.rightSideBarActive() }) 
  const [timeEvents, setTimeEvents] = useState<ITimeEvent[] | null>(null)
  const [q , setQ] = useState<any | null>(null) 
  useEffect(()=>{
    if (q === null && userStore.userInfo) {      
      if (userStore.userInfo.roles.includes('ADMIN'))
        setQ({ sorts: [ 'created_at desc']})
      else 
        setQ({user_organization_id_eq: userStore.userInfo?.organization.id, sorts: [ 'created_at desc']})
    }  
  }, [q, userStore.userInfo, userStore.userInfo?.organization] ) 
  
  useEffect(()=>{
    if (timeEvents===null && q!==null) AuditService.getAudits({q:q, limit: 200})
    .then(response=>setTimeEvents(response.data))
    .catch(()=>setTimeEvents([]))
  },[timeEvents, q]) 
    
   
  return (  
  <div className={className}>
    <h5>Активность</h5>
    <div className="widget-timeline">
      { timeEvents===null || timeEvents.length===0 ? 'Событий не найдено' : timeEvents.map(item=>{        
        const ACTION_ATTRIBUTES = ACTIONS.get(item.action)
        if (ACTION_ATTRIBUTES === undefined) throw Error('неверный action')
        const timeStr = new Date(item.created_at).toLocaleString(
      "ru", TIME_FORMAT)
        return (
      <div className="timeline-event" key={item.id}>
        <span className="timeline-event-icon" style={{ backgroundColor: ACTION_ATTRIBUTES.color }}>
                <i className={ACTION_ATTRIBUTES.icon}></i>
        </span>
        <div className='timeline-event-title'>{timeStr} {ACTION_ATTRIBUTES.title}</div>
        <div className='timeline-event-detail'>
          {item.summary ? <><b>где: </b> <em>{item.summary}</em></> : ''}
          {item.detail ? <p><b>что: </b>{item.detail}</p> : ''}          
          <b>кем: </b> <em>{item.user.email}</em>         
        </div>
      </div>)})}
    </div> 
        
  </div>
)}
export default observer(RightSideBarLayout)

