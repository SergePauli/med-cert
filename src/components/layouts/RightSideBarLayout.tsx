import { observer } from 'mobx-react-lite'
import { classNames } from 'primereact/utils'
import { FC, useContext } from 'react'
import { Context } from '../..'


type RightSideBarLayoutProps = {}

const RightSideBarLayout: FC<RightSideBarLayoutProps> = (props: RightSideBarLayoutProps) =>{ 
  const {layoutStore} = useContext(Context)
  const className = classNames("layout-sidebar-right", {"layout-sidebar-right-active": layoutStore.rightSideBarActive() })
  return (  
  <div className={className}>
    <h5>Активность</h5>
    <div className="widget-timeline">
      <div className="timeline-event">
        <span className="timeline-event-icon" style={{backgroundColor: 'rgb(100, 181, 246)'}}>
          <i className="pi pi-dollar"></i>
        </span>
        <div className="timeline-event-title">Добавлено:</div>
          <div className="timeline-event-detail">Свидетельство<strong>№21566 5465464</strong>.</div>
        </div>
        <div className="timeline-event">
          <span className="timeline-event-icon" style={{backgroundColor: 'rgb(121, 134, 203)'}}>
            <i className="timeline-icon pi pi-download"></i>
          </span>
          <div className="timeline-event-title">Заменено:</div>
            <div className="timeline-event-detail">Свидетельство<strong>№21566 5465464</strong>.
          </div>  
        </div>
        <div className="timeline-event">
          <span className="timeline-event-icon" style={{backgroundColor: 'rgb(77, 182, 172)'}}>
            <i className="timeline-icon pi pi-question"></i>
          </span>
          <div className="timeline-event-title">Замечание:</div>
          <div className="timeline-event-detail">от <strong>Jane Davis</strong> -Неверы диагноз...</div>
        </div>
        <div className="timeline-event">
          <span className="timeline-event-icon" style={{backgroundColor: 'rgb(77, 208, 225)'}}>
            <i className="timeline-icon pi pi-comment"></i>
          </span>
          <div className="timeline-event-title">Комментарий:</div>
          <div className="timeline-event-detail">Claire Smith has upvoted your store along with ..</div>
      </div>
    </div>
  </div>
)}
export default observer(RightSideBarLayout)