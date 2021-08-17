import avatar from "../../images/favicon.png"
import { useContext } from "react"
import { observer } from "mobx-react-lite"
import { Context } from "../.."
import { Link } from "react-router-dom"
import { CERTIFICATE_ROUTE, HOME_ROUTE, LIST_ROUTE } from "../../utils/consts"
import { SideBarMenu } from "../menus/SideBarMenu"
import { MenuItem } from "primereact/menuitem"
type SideBarLayoutProps = {activeUrl: string}
const SideBarLayout = observer((props: SideBarLayoutProps) => {
   const {userStore, certificateStore} = useContext(Context)
   const cert_id = certificateStore.id() 
   const items:MenuItem[] = [    
      { label: "Свидетельство", className: "layout-root-menuitem",     
        items:[{label:"Секции", icon:"pi-file", items:[
          {label:"Сведения о документе", 
          url:`${CERTIFICATE_ROUTE}/${cert_id}?q=0`}, 
          {label:"п.1-4", url:`${CERTIFICATE_ROUTE}/${cert_id}?q=1`},{label:"ДУЛ", url:"/#"},{label:"п.5-6", url:"/#"}, {label:"п.7-9",  url:"/#"},{label:"п.10-14", url:"/#"}]},
        { label: "Списки",  icon:"pi-list", items: [{label:"Свидетельства", icon:"pi-id-card", url:LIST_ROUTE},{label:"Журнал", icon:"pi-align-left", url:"/#"}]},]}, 
      {separator: true},
      { label: "Сеанс", className: "layout-root-menuitem",      
        items: [{label:"Главная", icon:"pi-home", url:HOME_ROUTE},{label:"Выход", icon:"pi-sign-out", command:()=>{userStore.logout()}}]     
      },     
   ]   
  const url = props.activeUrl
  const findActive = (items: MenuItem[])=>{
    let isActive = false    
    items.forEach((item)=>{        
      if (item.url === url)  { 
        item.className='active-menuitem' 
        isActive = true 
      }
      if (isActive) return true
      if (item.items) {         
        if (findActive(item.items)) { 
          item.className = item.className || 'active-menuitem'
          isActive = true  
        }  
      } 
    })      
    return isActive
  }
  findActive(items)
  
  return (
    <div className='layout-sidebar'>      
        <Link className='logo' to='#/'>
          <img id='app-logo' className='logo-image' src={avatar} alt='РРМСС V3.0' />
          <span className='app-name'>МедСС</span>
        </Link>       
        <SideBarMenu model={items} />  
    </div>      
  )
})
export default SideBarLayout