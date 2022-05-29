import React, { FC,  useContext,  useState } from 'react'
import { MenuItem } from 'primereact/menuitem'
import { classNames, UniqueComponentId } from 'primereact/utils'
import { IMenuProps } from './IMenuProps'
import { HOME_ROUTE } from '../../utils/consts'
import { Context } from '../..'


export const SideBarMenu:FC<IMenuProps> = (props: IMenuProps) =>{ 
  const { userStore } = useContext(Context)
  const [activeItem, setActiveItem] = useState<MenuItem>({})
  const onItemClick = (event: React.MouseEvent, item:MenuItem)=> {
        if (item.disabled) {
            event.preventDefault()
            return
        }
        if (!item.url) {
           event.preventDefault()
        } else if (item.url.startsWith(HOME_ROUTE)) {
           userStore.history().push(item.url) 
           event.preventDefault()          
        }
        if (item.command) item.command({           
              originalEvent: event,
              item,
            })        
        if (item!==activeItem) {
          if (activeItem.className) activeItem.className=''
          item.className='active-menuitem'
          setActiveItem(item)
        } else {
          item.className=''
          setActiveItem({})
        }
  }

  const className = classNames("layout-menu-container", props.className)
  const menu = (items: MenuItem[], label: string)=> {
    const renderMenu = ()=> {
      if (items.length>0) {
        const renderItem = (item:MenuItem, index:number) => {
          const renderSeparator = (index:number)=><li key={"separator_" + index} className='menu-separator' role='separator'></li>
          const renderMenuItem =(item:MenuItem, index:number) => {
          const submenuIconClassName = "pi pi-fw pi-angle-down layout-submenu-toggler"
          const iconClassName = classNames("layout-menuitem-icon pi pi-fw", item.icon)
          const linkClassName = classNames("p-ripple", { "p-link": item.url === undefined }, 
          { "p-disabled": item.disabled })
          const submenuIcon = item.items && <span className={submenuIconClassName}></span>
          const icon = item.icon && <span className={iconClassName}></span>
          const label = item.label && <span className='layout-menuitem-text'>{item.label}</span>
          const content = item.className || item.items ?             [
              <button key={`bt_${item.label}_${index}`} type='button' onClick={(e:React.MouseEvent)=>onItemClick(e, item)} className="p-ripple p-link">
                {icon}
                {label}
                {submenuIcon}                                
              </button>,              
            ] :  [<a href={item.url} target={item.target}
                    key={`a_${item.disabled ? label : index}`}  
                    className={linkClassName} 
                    onClick={(e:React.MouseEvent)=>onItemClick(e, item)} 
                    aria-disabled={item.disabled}>
                    {icon}{label}</a>,]
            if (item.className?.includes('layout-root-menuitem')) 
               content.push(<div key={`dv_${item.label}_${index}`} className={item.className}><div className='layout-menuitem-root-text'>{item.label}</div></div>)
            const submenu = (item.items && item.className) && menu(item.items as MenuItem[], item.label || UniqueComponentId())      
            return (
              <li key={`li_${index}_${item.className}`} 
                className={item.className} style={item.style}       
                role='menuitem'>
                {content}
                {submenu}
              </li>
            )
          }
          if (item.separator) return renderSeparator(index)
          else return renderMenuItem(item, index) 
        }
        return items.map((item, index) => {
          return renderItem(item, index)
        })
      }
      return null
    }
    
    return (
      <ul key={label} className="layout-menu" role="menu">
        {renderMenu()}
      </ul>
    )
  }  
  return (
    <div id={props.id || "sidebar_menu"} className={className} style={props.style}>
      {menu(props.model || [], "global")}
    </div>
  )
}


