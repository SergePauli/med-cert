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
   const {userStore} = useContext(Context)
   const items:MenuItem[] = [    
      { label: "Свидетельство", className: "layout-root-menuitem",     
        items:[{label:"Форма", icon:"pi-file", items:[{label:"Ввод", icon:"pi-pencil", url:CERTIFICATE_ROUTE}, {label:"Заменить", icon:"pi-refresh", url:"/#"},{label:"Удалить", icon:"pi-trash", url:"/#"}, {label:"Сохранить", icon:"pi-save", disabled:true, url:"/#"},{label:"Отменить", icon:"pi-times", disabled:true, url:"/#"}]},
        { label: "Списки",  icon:"pi-list", items: [{label:"Свидетельства", icon:"pi-id-card", url:LIST_ROUTE},{label:"Журнал", icon:"pi-align-left", url:"/#"}]},]}, 
      {separator: true},
      { label: "Сеанс", className: "layout-root-menuitem",      
        items: [{label:"Главная", icon:"pi-home", url:HOME_ROUTE},{label:"Выход", icon:"pi-sign-out", command:()=>{userStore.logout()}}]     
      },     
   ]   
  const url = props.activeUrl
  const findActive = (items: MenuItem[])=>{
    let rez:MenuItem = {} 
    items.forEach((item)=>{        
     if (item.url === url) rez = item
       if (item.items){
        let active = findActive(item.items)
        if (active.label) rez = active
       } 
      })      
      return rez
    }
  const active =  findActive(items) 
  
  if (active.label) active.className='active-menuitem'
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