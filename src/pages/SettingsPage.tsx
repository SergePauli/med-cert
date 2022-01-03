import { FC, useContext, useEffect, useRef, useState } from 'react'
import { IRouteMatch } from '../models/IRouteMatch'
import { IRouteProps } from '../models/IRouteProps'
import ava from '../images/hospital.jpg'
import '../styles/pages/ProfilePage.css'
import { DESTROY_OPTION, MO_SETTINGS_ROUTE} from '../utils/consts'
import MainLayout from '../components/layouts/MainLayout'
import OrganizationService from '../services/OrganizationService'
import { IOrganization } from '../models/IOrganization'
import { InputText } from 'primereact/inputtext'
import { ProgressSpinner } from 'primereact/progressspinner'
import { IAudit } from '../models/IAudit'
import { classNames } from 'primereact/utils'
import { InputMask } from 'primereact/inputmask'
import { IContact } from '../models/IContact'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'
import { DEFAULT_ERROR_TOAST } from '../utils/defaults'
import { Context } from '..'
import { Dropdown } from 'primereact/dropdown'
import { IReferenceId } from '../models/IReference'
import AddressDialog from '../components/dialogs/AddressDialog'
import { observer } from 'mobx-react-lite'
import { IAddress } from '../models/responses/IAddress'
import AddressFC2 from '../components/inputs/AddressFC2'

// страница настроек профиля организации
// Organization profile page

// используем роут с параметром id для загрузки с API
interface IMatch extends IRouteMatch {  
  params: {id: string}
}
interface SettingsPageProps extends IRouteProps { 
    match: IMatch  
}


const SettingsPage: FC<SettingsPageProps> = (props: SettingsPageProps) =>{ 
  const {userStore, addressStore} = useContext(Context)
  const [audits, setAudits] = useState<IAudit[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [email, setEmail] = useState<IContact>({telcom_value:'', main:false} as IContact) 
  const [phone, setPhone] = useState<IContact>({telcom_value:'', main:true} as IContact)
  const [organization, setOrganization] = useState<IOrganization | null>(null)
  const [ID, setID] = useState<number | null>(null)
  const toast = useRef<Toast>(null) 
  useEffect(()=>{
    if (organization!==null && organization.id !== ID) {
      setPhone({telcom_value:'', main:true} as IContact)
      setEmail({telcom_value:'', main:false} as IContact)          
      organization.contacts.forEach((item)=>{if (item.main) setPhone({...item})
        else setEmail({...item, telcom_value: item.telcom_value.replace('mailto:','')})})
      setID(organization.id)      
    }
  },[organization, ID])

  useEffect(()=>{
    if (organization===null && props.match.params.id) {
        OrganizationService.getOrganization(props.match.params.id)
        .then(response=>{        
          setOrganization(response.data)        
        })
        .catch((reason=>{console.log(reason)
          if (toast!==null && toast.current!==null) toast.current.show(DEFAULT_ERROR_TOAST)
        }))      
    }
  },[organization, props.match.params.id, userStore.userInfo])
  const [organizations, setOrganizations] = useState<IReferenceId[] | null>(null)
  useEffect(()=>{
    if (organizations===null && userStore.userInfo
       && userStore.userInfo.roles.includes('ADMIN')) 
    OrganizationService.getOrganizations().then(response=>
      setOrganizations(response.data.organizations)
    ).catch(()=>{
      setOrganizations([])
      if (toast!==null && toast.current!==null) toast.current.show(DEFAULT_ERROR_TOAST)
    })},[organizations, userStore.userInfo])
  const changesAudit = (fieldName: string, field: string, oldValue: string, newValue: string) => {
    if (organization ===null) return
    let _audits = audits
    const audit = _audits.find(element=>element.field === field) || {field, before: oldValue} as IAudit
    if (audit.after === undefined) _audits.push(audit)    
    audit.after = newValue   
    audit.detail = `${fieldName}: ${audit.before} -> ${audit.after}`     
    setAudits(_audits)
  }
  

  // Обработчик изменения контактов      
  const onContactChange = (contact: IContact) => { 
      if (organization === null) return  
      let _contact = contact.telcom_value==='' ?
      (contact.id ? {...contact,...DESTROY_OPTION} : {...contact}) :    
      (contact.id ? {id:contact.id, parent_guid: contact.parent_guid, telcom_use: contact.telcom_use, telcom_value: contact.telcom_value, main: contact.main} : {...contact}) 
      if (organization.contacts === undefined) organization.contacts = []
      if (_contact.id) {        
          const idx = organization.contacts.findIndex(item=>item.id===_contact.id)  
          if (idx>-1) organization.contacts[idx] = _contact        
      } else organization.contacts.push(_contact)       
  }

  // проверка возможности сохранения
  const isSaveAvaible = () : boolean => {
    if (organization === null) return false    
    let _result = audits.length > 0    
    _result = _result && /tel:\+?[-0-9().]+/i.test(phone.telcom_value)    
    _result = _result && (/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email.telcom_value) || email.telcom_value==='')    
    _result = _result && !(!organization.name || (!organization.name && organization.name.length > 100))
    _result = _result && !!organization.name_full    
    //_result = _result && !(!organization.address || !organization.address.houseGUID)
   
    return  _result
  }  
  const saveOrganization = () => {
    if (organization===null) return    
    setSubmitted(true)
    if (isSaveAvaible()) {
      onContactChange(phone)
      onContactChange(email)
      let _organization = { id: organization.id,                               
                            name: organization.name,
                            name_full: organization.name_full,
                            license: organization.license || null,
                            license_data: organization.license_data || null,
                            okpo: organization.okpo || null,
                            contacts_attributes: organization.contacts,
                            address_attributes: organization.address
                           } as any                                                     
      OrganizationService.updateOrganization({Organization: _organization, audits: audits})
        .then(response=>{          
          setAudits([])
          setSubmitted(false)
          setOrganization(response.data)
          console.log('response.data',response.data)
          if (toast!==null && toast.current!==null) toast.current.show({ severity: 'success', summary: 'Успешно', detail: 'Изменения применены', life:3000 })
        })
        .catch((reason=>{console.log(reason)
          if (toast!==null && toast.current!==null) toast.current.show(DEFAULT_ERROR_TOAST)
        }))    
    } else if (toast!==null && toast.current!==null) toast.current.show({ severity: 'info', summary: 'Отклонено', detail: 'Изменения отсутствуют или неприменимы', life:3000 })   
  } 
  
  const adminOpportunities = ()=>{    
    return (userStore.userInfo && userStore.userInfo.roles.includes('ADMIN')) ? 
    (<>
      <div className="p-field p-col-12">
        <label htmlFor="organization" >Выбрать медорганизацию</label>
        <Dropdown id="organization"  options={organizations || []}
          onChange={(e)=>{            
            if (e.value.id) {
              const history = userStore.history()
              let link = `${MO_SETTINGS_ROUTE}/${e.value.id}`
              setOrganization(null)              
              history.push(link)              
            }  
          }}
          filter showClear optionLabel="name" />
      </div>
    </>) 
    : (<></>)     
  }
  const layoutParams = {
    title: 'Профиль медорганизации',     
    url: MO_SETTINGS_ROUTE,
    content: organization ? (<>    
    <div className="card widget-user-card" key={props.match.params.id}>
      <div className="user-card-header">
        <img src={ava} alt="" className="user-card-avatar" />
      </div>
      <div className="user-card-body">  
      <div className="user-card-title">
        {organization.name || ''}
      </div>             
      <div className="user-card-subtext">{organization.oid}</div>
      <div className="p-grid user-card-stats">
        <div className="p-col-4">
          <i className="pi pi-users"></i>
          <div>14 Создано</div>
        </div>
        <div className="p-col-4">
          <i className="pi pi-bookmark"></i>
          <div>2 Выданно</div>
        </div>
        <div className="p-col-4">
          <i className="pi pi-check-square"></i>
          <div>6 Отправленно</div>
        </div>
      </div>        
    </div>
    <div className='card' style={{textAlign: 'left'}} >      
        <div className='p-fluid p-formgrid p-grid'>
          <div className="p-field p-col-12 p-md-5 ">
            <label htmlFor="name">Наименование</label>
            <InputText id="name" required value={organization.name || ''} 
              onChange={e=>{
                  let _organization = {...organization}
                  changesAudit("Наименование", "name", _organization.name || '', e.target.value || '')
                   _organization.name = e.target.value
                  setOrganization(_organization) 
              }}
              autoFocus className={classNames({ 'p-invalid': submitted && organization.name && organization.name?.length > 100})}
            />
            {submitted && (!organization.name || (organization.name && organization.name.length > 100)) && <small className="p-error">Краткое наименование более 100 знаков или отсутствует</small>}
          </div>
          <div className="p-field p-col-12 p-md-7">
            <label htmlFor="name_full">Полное наименование</label>
            <InputText id="name_full" value={organization.name_full || ''} 
              onChange={e=>{
                  let _organization = {...organization}                  
                  changesAudit("Полное наименование", "name_full", _organization.name || '', e.target.value || '')
                  _organization.name_full = e.target.value
                  setOrganization(_organization) 
              }}
              required className={classNames({ 'p-invalid': submitted && !organization.name_full})}
            />
            {submitted && !organization.name_full && <small className="p-error">Полное наименование обязательно</small>}
          </div>
          <div className="p-field p-col-12">
            <label htmlFor="license">Cерия и номер лицензии на осуществление медицинской деятельности</label>
            <InputText id="license" value={organization.license || ''} 
              onChange={e=>{
                  let _organization = {...organization}
                  changesAudit("Cерия и номер лицензии", "license", _organization.license || '', e.target.value || '')
                   _organization.license = e.target.value
                  setOrganization(_organization) 
              }}               
            />            
          </div>
          <div className="p-field p-col-12">
            <label htmlFor="license_data">указание на Федеральную службу по надзору в сфере здравоохранения и дату регистрации лицензии</label>
            <InputText id="license_data" value={organization.license_data || ''} 
              onChange={e=>{
                  let _organization = {...organization}
                  changesAudit("Данные лицензии", "license_data", _organization.license_data || '', e.target.value || '')
                   _organization.license_data = e.target.value
                  setOrganization(_organization) 
              }}               
            />            
          </div>
          <div className="p-field p-col-12 p-md-6">
            <label htmlFor="okpo">ОКПО</label>
            <InputText id="okpo" value={organization.okpo || ''} 
              onChange={e=>{
                  let _organization = {...organization}
                  changesAudit("ОКПО", "okpo", _organization.okpo || '', e.target.value || '')
                  _organization.okpo = e.target.value
                  setOrganization(_organization) 
              }}               
            />            
          </div>
          <div className="p-field p-col-12 p-md-6">
            <label htmlFor="phone">телефон</label>
            <InputMask id="phone" required 
              type="text" mask="tel:+79999999999"
              value={phone.telcom_value} 
              onChange={(e)=>{
                changesAudit("телефон", "phone", phone.telcom_value || '', e.target.value || '')  
                setPhone({...phone, telcom_value: e.target.value})                
              }} 
              className={classNames({ 'p-invalid': submitted && !/tel:\+?[-0-9().]+/i.test(phone.telcom_value)})}
            />
            {submitted && !/tel:\+?[-0-9().]+/i.test(phone.telcom_value) && <small className="p-error">тел.номер некорректен или отсутствует!</small>}            
          </div>
          <div className="p-field  p-col-12 p-md-6">
            <label htmlFor="email">email</label>
            <InputText id="email" type="text" 
              value={email.telcom_value} 
              onChange={(e)=>{ 
                changesAudit("email", "email", email.telcom_value || '', e.target.value || '') 
                setEmail({...email, telcom_value:e.target.value})  
              }} 
              className={classNames({ 'p-invalid': submitted && !(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email.telcom_value) || email.telcom_value==='')})}
                    />
              {submitted && !(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email.telcom_value) || email.telcom_value==='') && <small className="p-error">Неверный email</small>}
          </div>      
          <AddressFC2 className="p-col-12" submitted={submitted} 
            label='Адрес медорганизации'
            value={organization.address} strictly 
            onClear={(value: IAddress)=>setOrganization({...organization, address: {...value}})}
            onChange={()=>{        
              let _organization = {...organization, address: addressStore.addressProps()}                
              changesAudit("Адрес", "address", organization.address?.streetAddressLine || '', _organization.address?.streetAddressLine || '')                 
              setOrganization(_organization)
            }}  
          />
          <div className="p-field  p-col-12 p-md-6">
            <Button label="ПРИМЕНИТЬ"  className="p-button-success" 
              style={{marginTop: '22px'}} onClick={saveOrganization}  />
          </div>   
          {adminOpportunities()}          
        </div>        
      </div>             
    </div>
    <Toast ref={toast} /> 
    <AddressDialog />        
  </>) : (<><Toast ref={toast} /><ProgressSpinner/></>)
  }
  return (
    <>
      <MainLayout {...layoutParams} />
    </>
  )
}
export default observer(SettingsPage)