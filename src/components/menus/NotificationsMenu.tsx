
import { classNames } from 'primereact/utils'
import { FC } from 'react'
import { useHistory } from 'react-router-dom'
import { ExtMenuItem, INotificationMenuProps } from './IMenuProps'

export const NotificationsMenu: FC<INotificationMenuProps> = (props: INotificationMenuProps)=> {
  const history = useHistory()   
  const onItemClick = (event: React.MouseEvent, item:ExtMenuItem)=> {
    if (item.disabled) {
      event.preventDefault()
      return
    }
    if (!item.url) {
      event.preventDefault()
    } else {
      history.push(item.url)
    }
    if (item.command) item.command({           
      originalEvent: event,
      item,
    })  
  }
  const className = "notifications-menu fade-in-up"
  const renderMenu = (items:ExtMenuItem[]) => {
    const renderItem = (item:ExtMenuItem, index:number) => {
        const renderSeparator = (index:number)=><li key={"separator_" + index} className='menu-separator' role='separator'></li>
        const renderMenuItem =(item:ExtMenuItem, index:number) => { 
          const className =  classNames("notification-item", item.className)                           
          const iconClassName = classNames("pi", item.icon, item.className)          
          const icon = item.icon && <i className={iconClassName}></i>
          const summary = item.summary && <div className="notification-summary">{item.summary}</div>
          const label = (item.label && item.label.split('detail'))||["",""]
          const content = <button key={`bt_${item.summary}_${index}`} 
              type='button' className="p-link" 
              onClick={(e:React.MouseEvent)=>onItemClick(e, item)}>
                {icon}
              <div className={className}>
                {summary}
                <div className="notification-detail">
                  {label[0]} <b>{item.detail}</b> {label[1]}  
                </div>
              </div>                                                               
            </button> 
          return <li key={`nmi_${index}`}>{content}</li> 
            
        }
        if (item.separator) return renderSeparator(index)
        else return renderMenuItem(item, index) 
      }
    if (items.length > 0) {
      return items.map((item, index) => {
          return renderItem(item, index)
      })
    } else return null
  }
  return (
    <ul className={className}>
        {renderMenu(props.model || [])}
    </ul>
  )
}