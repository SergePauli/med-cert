import { observer } from 'mobx-react-lite'
import { classNames } from 'primereact/utils'
import { FC, useContext, useEffect, useState } from 'react'
import '../../styles/components/EventTimeline.css'
import { Context } from '../..'
import { ACTIONS,  ITimeEvent } from '../../models/responses/ITimeEvent'
import {  TIME_FORMAT } from '../../utils/consts'
import AuditService from '../../services/AuditService'


type RightSideBarLayoutProps = {}

const RightSideBarLayout: FC<RightSideBarLayoutProps> = (props: RightSideBarLayoutProps) =>{ 
  const {layoutStore, userStore} = useContext(Context)
  const className = classNames("layout-sidebar-right", {"layout-sidebar-right-active": layoutStore.rightSideBarActive() }) 
  const [timeEvents, setTimeEvents] = useState<ITimeEvent[]>([])
  useEffect(()=>{
    if (timeEvents.length===0) AuditService.getAudits({q:{user_id_eq:userStore.userInfo?.id, sorts: [ 'created_at desc']}, limit: 200})
    .then(response=>setTimeEvents(response.data))
    .catch(()=>setTimeEvents([]))
  },[timeEvents, userStore.userInfo?.id]) 
    
  
  return (  
  <div className={className}>
    <h5>Активность</h5>
    <div className="widget-timeline">
      {timeEvents.map(item=>{
        console.log('item',item)
        const ACTION_ATTRIBUTES = ACTIONS.get(item.action)
        if (ACTION_ATTRIBUTES === undefined) throw Error('неверный action')
        const timeStr = new Date(item.created_at).toLocaleString(
      "ru", TIME_FORMAT)
        return (
      <div className="timeline-event">
        <span className="timeline-event-icon" style={{ backgroundColor: ACTION_ATTRIBUTES.color }}>
                <i className={ACTION_ATTRIBUTES.icon}></i>
        </span>
        <div className='timeline-event-title'>{ACTION_ATTRIBUTES.title}</div>
        <div className='timeline-event-detail'>
          <p>{item.detail}</p> 
          <em>{timeStr}</em>
        </div>
      </div>)})}
    </div> 
        
  </div>
)}
export default observer(RightSideBarLayout)

