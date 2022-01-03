/*
* ADDRESS SEARCH DIALOG COMPONENT
* функционал ввода адреса посредством поиска в ФИАС
* параметры:
* ID - ID существующей записи адреса в СУБД 
* address - полное представление записи адреса в СУБД  
*/
import { observer } from 'mobx-react-lite'
import { AutoComplete, AutoCompleteChangeParams } from 'primereact/autocomplete'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { Dropdown } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'
import { Toast } from 'primereact/toast'
import { FC, useContext, useEffect, useRef, useState } from 'react'
import { Context } from '../..'
import { IReference } from '../../models/IReference'
import { IFiasItem } from '../../models/responses/IFiasItem'
import { DEFAULT_ERROR_TOAST, HOME_REGION_CODE } from '../../utils/defaults'

type AddressDialogProps = {  
  onCancel?: ()=>void 
}

const AddressDialog: FC<AddressDialogProps> = (props: AddressDialogProps) =>{ 
  const { addressStore } = useContext(Context)  
  const [isLoading] = useState(addressStore.isLoading)  
  const value = addressStore.address  
  const streetAddressLine = value.streetAddressLine
  const regions = addressStore.regionsOptions
  const [searchStr, setSearchStr] = useState<string>('')   
  useEffect(()=>setSearchStr(streetAddressLine)    
  , [streetAddressLine])  
  const [region, setRegion] = useState<IReference>()
  useEffect(()=>setRegion(regions?.find((item)=>item.code === value.state?.code))      
   , [regions, value.state])   
  const [district, setDistrict] = useState<string>('')
  useEffect(()=>setDistrict(value.district?.name || ''), [value.district?.name])
  const [city, setCity] = useState<string>(value.city?.name || '')
  useEffect(()=>setCity(value.city?.name || ''), [value.city?.name])
  const [town, setTown] = useState<string>(value.town?.name || '')
  useEffect(()=>setTown(value.town?.name || ''), [value.town?.name])
  const [street, setStreet] = useState<string>(value.street?.name || '')
  useEffect(()=>setStreet(value.street?.name || ''), [value.street?.name])
  const [house, setHouse] = useState<string>(value.housenum || '')
  useEffect(()=>setHouse(value.housenum || ''), [value.housenum])
  const [addresses, setAddresses] = useState(addressStore.fiasOptions)   
  const toast = useRef<Toast>(null)
  const setAddress = (e:IFiasItem)=>{ 
    if (e === null) return      
    if (e.parent!==undefined) setAddress(e.parent)
    if (e.postalCode && e.postalCode.length>0) value.postalCode = e.postalCode
    value.aoGUID = e.AOGUID
    value.houseGUID = e.HouseGUID 
    value.streetAddressLine = e.streetAddressLine
    switch (e.level) {
      case 'Region' : if (e.code) value.state = {code: e.code.slice(0,2), name: e.name}      
        setRegion(regions?.find((item)=>item.code === value.state?.code))
        break
      case 'City': value.city = {code: e.AOGUID, name: e.name}
        setCity(e.name) 
        break
      case 'District': value.district = {code: e.AOGUID, name: e.name}
        setDistrict(e.name)
        break
      case 'Town': value.town = {code: e.AOGUID, name: e.name}
        setTown(e.name)
        break
      case 'building': value.housenum = e.housenum; 
        value.buildnum = e.buildnum;
        value.strucnum = e.strucnum;
      break
      case 'Street': 
        setStreet(e.name)
        value.street = {code: e.AOGUID, name: e.name}
      break
    }         
  }  
  useEffect( () => {     
    if (regions ===undefined) {
      addressStore.fetchRegionOptions()          
    } else if (value.state===undefined || value.state===null)  {      
      setRegion(regions?.find((region)=>region.code===HOME_REGION_CODE)) 
      value.state = region
    } else if (value.state?.code) {
      setRegion(regions?.find((region)=>region.code===value.state?.code))
    }    
  }, [regions, value, addressStore, region])  
  
  
  const onHide = ()=>{ 
    addressStore.dialogVisible = false
  }

  const autocompleteOnChange = (e: AutoCompleteChangeParams, setter: (value: string)=>void) => {
    if(e.value && e.value?.AOGUID) { 
      addressStore.clear()                                        
      setAddress(e.value)
    } else setter(e.value)
  }

  const getSuggestions = (parent:string, level: string, query:string)=>{
   addressStore.getChildItems(parent, level, query)
    .then(response=>setAddresses(response))
    .catch(reason => {  
       if (toast.current) toast.current.show({...DEFAULT_ERROR_TOAST, detail:`ошибка запроса к ФИАС: ${reason.message}`})
       setAddresses([])
    })    
  }

  const cantSaveChanges = ()=> {    
    if ((!addressStore.manualMode && addressStore.isNotStrictly()) 
      || addressStore.address.oldOne.streetAddressLine === addressStore.streetAddressLine()) return true
    else  return false  
  }
  const footer = (
    <div>
      <Button label="Применить" icon="pi pi-check" disabled={cantSaveChanges()}
        onClick={()=>{
          if (addressStore.isNotStrictly() && addressStore.manualMode) addressStore.address.streetAddressLine = searchStr
          if (addressStore.onAddrComplete) addressStore.onAddrComplete()          
          onHide()
        }} className="p-button-text p-button-success"/>        
      <Button label="Отмена" icon="pi pi-times" onClick={()=>{
        if (props.onCancel) props.onCancel()
        onHide()}} className="p-button-text"/>
    </div>
)
  return (
  <Dialog footer={footer} header='Ввод адреса посредством ФИАС' visible={addressStore.dialogVisible} onHide={onHide} 
    breakpoints={{'960px': '75vw', '640px': '100vw'}} 
    style={{width: '50vw'}} modal>
    <div className="p-grid p-fluid">  
    <div className='p-field p-col-12'>        
      <div className='p-inputgroup'>
        <span className='p-inputgroup-addon'>Строка поиска:</span> 
        <AutoComplete id='searchFIAS' disabled={isLoading}  
            value={searchStr} 
            suggestions={addresses}
            completeMethod={(e) =>{
              const query = value.state?.name ? e.query.replace(value.state?.name+',', '') : e.query
              if (query.trim().length>1) { 
                addressStore.searchBar(query.trim(), value.state?.code)
                setAddresses(addressStore.fiasOptions)
              }
            }}
          field='streetAddressLine'
          onChange={(e) => {                                  
            if(e.value && e.value?.AOGUID) { 
              addressStore.clear()                                        
              setAddress(e.value)
              setSearchStr(e.value.streetAddressLine)
            } else setSearchStr(e.target.value)
          }}
          placeholder='Регион, Город(Район),(Нас.пункт), Улица, Дом'
        />
      </div> 
    </div>       
    <div className="p-field p-col-12 p-md-6">      
      <label htmlFor="region">субъект Российской Федерации</label>
      <Dropdown id='region' value={region} filter filterBy='name'
          onChange={(e)=>{                
            value.state = e.value 
            addressStore.clear() 
            setRegion(e.value)
          }}
          options={regions}
          optionLabel='name'                                           
      />
    </div> 
    <div className="p-field p-col-12 p-md-6">
      <label htmlFor="district">район</label>
      <AutoComplete id='district' dropdown              
          value={district}  forceSelection                    
          field='name' disabled={isLoading}
          onChange={e=>autocompleteOnChange(e, setDistrict)}                       
          suggestions={addresses}
          completeMethod={e=>{
            if (value.state?.code) 
            getSuggestions(value.state?.code, 'district', e.query)
          }}                                                           
        />
      </div>
      <div className="p-field p-col-12 p-md-6">
        <label htmlFor="city">город</label>         
        <AutoComplete id='city' dropdown              
          value={city}  forceSelection                    
          field='name' 
          onChange={e=>autocompleteOnChange(e,setCity)}                       
          suggestions={addresses}
          completeMethod={e=>{                
            if (value.state?.code) getSuggestions(value.state?.code,'city', e.query)
          }}               
        />              
      </div>
      <div className="p-field p-col-12 p-md-6">
        <label htmlFor="town">населенный пункт</label>
        <AutoComplete id='town' dropdown value={town}  
          forceSelection field='name' 
          onChange={e=>autocompleteOnChange(e, setTown)}                       
          suggestions={addresses}
          completeMethod={async (e) =>{
            let parent = value.state?.code               
            if (value.city?.code) parent = value.city?.code  
            if (value.district?.code) parent = value.district?.code                
            if (parent) getSuggestions(parent, 'town', e.query)                
          }}                                                   
        />        
      </div>
      <div className="p-field p-col-12 p-md-6">
        <label htmlFor="street">улица</label>
        <AutoComplete id='street' forceSelection              
          value={street} field='name' dropdown                 
          onChange={e=>autocompleteOnChange(e, setStreet)}                       
          suggestions={addresses}
          completeMethod={async (e) =>{
            let parent = value.state?.code 
            if (value.district?.code) parent = value.district?.code              
            if (value.city?.code) parent = value.city?.code                 
            if (value.town?.code) parent = value.town?.code               
            if (parent) getSuggestions(parent, 'street', e.query)                 
          }}                                                   
        />
      </div>
      <div className="p-field p-col-12 p-md-4" style={{ maxWidth:'7rem'}}>
        <label htmlFor="housenum">дом</label>
        <AutoComplete id='housenum' dropdown value={house} field='name'            
          onChange={(e)=>{
            if(e.value && e.value?.AOGUID) { 
              addressStore.clear()                                        
              setAddress(e.value)
              setHouse(e.value.name)
            } else {
              setHouse(e.value)
              if (addresses?.entries.length===0 && e.value.trim().length>0) {
                value.housenum = e.value
              }
            }
          }}                       
          suggestions={addresses}
          completeMethod={async (e) =>{
            let parent = value.state?.code 
            if (value.district?.code) parent = value.district?.code              
            if (value.city?.code) parent = value.city?.code                 
            if (value.town?.code) parent = value.town?.code
            if (value.street?.code) parent = value.street?.code               
            if (parent) getSuggestions(parent, 'building', e.query)                
          }}                                                   
        />         
      </div>
      <div className="p-field p-col-12 p-md-4" style={{ maxWidth:'7rem'}}> 
        <label htmlFor="strucnum">стр.</label>
        <InputText id='strucnum'              
          value={value.strucnum || ''}                
          onChange={(e)=>{
            if (e.target.value.trim().length>0) value.strucnum=e.target.value
          }}
        />        
      </div>
      <div className="p-field p-col-12 p-md-4" style={{ maxWidth:'7rem'}}>
        <label htmlFor="buildnum">корп.</label>
        <InputText id='buildnum' value={value.buildnum || ''}                
          onChange={(e)=>{
            if (e.target.value.trim().length>0) value.buildnum=e.target.value                
          }}                  
        />        
      </div>
      <div className="p-field p-col-12 p-md-4" style={{ maxWidth:'9rem'}}>
        <label htmlFor="flat">квартира(офис)</label>
        <InputText id='flat' value={value.flat || ''}                  
          onChange={(e)=>{
            value.flat=e.target.value}
          }                                               
        />        
      </div>
      <div className="p-field p-col-12 p-md-4">
        <label htmlFor="postalCode">почтовый код</label>
        <InputText id='postalCode' disabled={value.aoGUID!==undefined}              
          value={value.postalCode || ""}                  
            onChange={(e)=>{
              value.postalCode=e.target.value                
            }}                                               
        />        
      </div>
      <Toast ref={toast} />      
    </div>  
  </Dialog>)
}
export default observer(AddressDialog)