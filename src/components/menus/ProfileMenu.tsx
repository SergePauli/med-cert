import { MenuItem } from 'primereact/menuitem'
import { classNames } from 'primereact/utils'
import { FC } from 'react'
import { IMenuprops } from './IMenuProps'

export const ProfileMenu: FC<IMenuprops> = (props: IMenuprops)=> {   
  const onItemClick = (event: React.MouseEvent, item:MenuItem)=> {
    if (item.disabled) {
      event.preventDefault()
      return
    }
    if (!item.url) {
      event.preventDefault()
    }
    if (item.command) item.command({           
      originalEvent: event,
      item,
    })  
  }
  const className = "profile-menu fade-in-up"
  const renderMenu = (items:MenuItem[]) => {
    const renderItem = (item:MenuItem, index:number) => {
        const renderSeparator = (index:number)=><li key={"separator_" + index} className='menu-separator' role='separator'></li>
        const renderMenuItem =(item:MenuItem, index:number) => {          
          const iconClassName = classNames("pi", item.icon)          
          const icon = item.icon && <i className={iconClassName}></i>
          const label = item.label && <span>{item.label}</span>
          const content = <button key={`bt_${item.label}_${index}`} 
              type='button' 
              onClick={(e:React.MouseEvent)=>onItemClick(e, item)} 
              className="p-link">
                {icon}
                {label}                                                
            </button> 
          return <li key={`pfi_${index}`}>{content}</li> 
            
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