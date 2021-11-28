import { observer } from 'mobx-react-lite'
import { CheckboxChangeParams } from 'primereact/checkbox'
import {AutoComplete} from 'primereact/autocomplete' 
import '../../styles/components/AutoComplete.css'
import { FC, useEffect, useContext, useState } from 'react'
import { INullFlavor } from '../../models/INullFlavor'
import { IReference } from '../../models/IReference'
import { NULL_FLAVORS } from '../../utils/defaults'
import NullFlavorWrapper from '../NullFlavorWrapper'
import { Dropdown } from 'primereact/dropdown'
import Address from '../../models/FormsData/Address'
import { InputText } from 'primereact/inputtext'
import { Context } from '../..'
import { IFiasItem } from '../../models/responses/IFiasItem'
import { HOME_REGION_CODE } from '../../store/addressStore'


type AddressProps = {
  label: string
  checked?: boolean
  setCheck: ((e: CheckboxChangeParams, nullFlavors?: INullFlavor[]) => void)
  nullFlavors?: INullFlavor[]
  nfValue?:number
  field_name?:string    
  onChange?: ((value: Address)=>void)
  paraNum?: boolean
}
const nfOptions = NULL_FLAVORS.filter((item:IReference)=>"ASKU UNK NA".includes(item.code))

const AddressFC: FC<AddressProps> = (props: AddressProps) => {  
  const { addressStore } = useContext(Context)  
  const [checked, setChecked] = useState<boolean>(props.checked || false)
  const [isLoading] = useState(addressStore.isLoading)  
  const value = addressStore.address  
  const streetAddressLine = value.streetAddressLine
  const regions = addressStore.regionsOptions
  const [searchStr, setSearchStr] = useState<string>('') 
  useEffect(()=>setSearchStr(streetAddressLine)    
  , [streetAddressLine])  
  const [region, setRegion] = useState<IReference | undefined>(value.state)
  useEffect(()=>setRegion(value.state)    
  , [value.state])   
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
  
  const setAddress = (e:IFiasItem)=>{ 
    if (e === null) return      
    if (e.parent!==undefined) setAddress(e.parent)
    if (e.postalCode && e.postalCode.length>0) value.postalCode = e.postalCode
    value.aoGUID = e.AOGUID
    value.houseGUID = e.HouseGUID 
    value.streetAddressLine = e.streetAddressLine
    switch (e.level) {      
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
  const linkStyle = props.paraNum ? {marginLeft:'1.5rem'} : {} 
  return (<>
      <div className='p-paragraph-field  p-mb-2' style={{ width:'90%'}}>
        <NullFlavorWrapper checked={checked} paraNum={props.paraNum}
          label={<label>{props.label}</label>}  
          setCheck={(e:CheckboxChangeParams, nullFlavors: INullFlavor[] | undefined)=>
                    { setChecked(e.checked)                      
                      if (props.setCheck) props.setCheck(e, nullFlavors)
                    }}
          nullFlavors={props.nullFlavors}
          value={props.nfValue}
          options={nfOptions} 
          field_name={props.field_name} 
          field={
            <div className='p-inputgroup'>
              <span className='p-inputgroup-addon'>Поиск в ФИАС:</span> 
              <AutoComplete disabled={isLoading}  
                id='searchFIAS' //forceSelection        
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
                    if (props.onChange) props.onChange(value)
                    setSearchStr(e.value.streetAddressLine)
                  } else setSearchStr(e.target.value)
                }}
                placeholder='Регион, Нас.пункт, Улица, Дом'
              />
          </div>}  
          onChange={(e: IReference, nullFlavors: INullFlavor[] | undefined) => {
            props.setCheck({checked:false} as CheckboxChangeParams, nullFlavors)
          }}                 
        />
      </div>
      <div className="p-paragraph-field p-mr-3 p-mb-2"  style={linkStyle}>      
        <NullFlavorWrapper  checked={checked}  key={`region_${checked}`}               
          label={<label htmlFor="region">субъект Российской Федерации</label>}
          field={ 
            <Dropdown 
              id='region' 
              value={region}                      
              filter filterBy='name'
              onChange={(e)=>{                
                value.state = e.value 
                addressStore.clear() 
                setRegion(e.value)                            
                if (props.onChange) props.onChange(value)
              }}
              options={regions}
              optionLabel='name'                                           
            />            
          }
          options={nfOptions}                   
          lincked                                   
       />
      </div> 
      <div className="p-paragraph-field p-mr-3 p-mb-2">
        <NullFlavorWrapper  checked={checked} key={`district_${checked}`}                
          label={<label htmlFor="district">район</label>}
          field={
            <AutoComplete id='district' key={`district_${value.district?.code}_${isLoading}`}  dropdown              
              value={district}  forceSelection                    
              field='name' disabled={isLoading}
              onChange={(e)=>{                                                      
                if(e.value && e.value?.AOGUID) { 
                    addressStore.clear()                                        
                    setAddress(e.value)                
                    if (props.onChange) props.onChange(value)                    
                  } else setDistrict(e.value)
              }}                       
              suggestions={addresses}
              completeMethod={async (e) =>{
                if (value.state?.code) {                   
                  setAddresses(await addressStore.getChildItems(value.state?.code, 'district', e.query))                 
                }
              } }                                                   
            />           
          }
          options={nfOptions}                   
          lincked                                   
        />
      </div>
      <div className="p-paragraph-field p-mr-3 p-mb-2" style={linkStyle}>
        <NullFlavorWrapper  checked={checked}  key={`city_${checked}`}                
          label={<label htmlFor="city">город</label>}
          field={
            <AutoComplete id='city' dropdown              
              value={city}  forceSelection                    
              field='name' 
              onChange={(e)=>{
                if(e.value && e.value?.AOGUID) { 
                    addressStore.clear()                                        
                    setAddress(e.value)                
                    if (props.onChange) props.onChange(value)                    
                } else setCity(e.value)
              }}                       
              suggestions={addresses}
              completeMethod={async (e) =>{                
                if (value.state?.code)                   
                  setAddresses(await addressStore.getChildItems(value.state?.code, 'city', e.query))                 
                  }
              }                                                   
            />            
          }
          options={nfOptions}                   
          lincked                                   
        />
      </div>
      <div className="p-paragraph-field p-mr-3 p-mb-2">
        <NullFlavorWrapper  checked={checked}  key={`town_${checked}`}               
          label={<label htmlFor="town">населенный пункт</label>}
          field={
            <AutoComplete id='town' dropdown               
              value={town}  forceSelection                    
              field='name' 
              onChange={(e)=>{                               
                if(e.value && e.value?.AOGUID) { 
                    addressStore.clear()                                        
                    setAddress(e.value)                
                    if (props.onChange) props.onChange(value)                    
                } else setTown(e.value)
              }}                       
              suggestions={addresses}
              completeMethod={async (e) =>{
                let parent = value.state?.code               
                if (value.city?.code) parent = value.city?.code  
                if (value.district?.code) parent = value.district?.code                
                if (parent)  setAddresses(await addressStore.getChildItems(parent, 'town', e.query))                
              }}                                                   
            />
          }
          options={nfOptions}                   
          lincked                                   
        />
      </div>
      <div className="p-paragraph-field p-mr-3 p-mb-2" style={linkStyle}>
        <NullFlavorWrapper  checked={checked} key={`street_${checked}`}                 
          label={<label htmlFor="street">улица</label>}
          field={
            <AutoComplete id='street' forceSelection              
              value={street} field='name' dropdown                 
              onChange={(e)=>{
                if(e.value && e.value?.AOGUID) { 
                    addressStore.clear()                                        
                    setAddress(e.value)                
                    if (props.onChange) props.onChange(value)                    
                } else setStreet(e.value)
              }}                       
              suggestions={addresses}
              completeMethod={async (e) =>{
                let parent = value.state?.code 
                if (value.district?.code) parent = value.district?.code              
                if (value.city?.code) parent = value.city?.code                 
                if (value.town?.code) parent = value.town?.code               
                if (parent)  setAddresses(await addressStore.getChildItems(parent, 'street', e.query))                 
                }}                                                   
            />            
          }
          options={nfOptions}                   
          lincked                                   
        />
      </div>
      <div className="p-paragraph-field p-mr-3 p-mb-2" style={{ maxWidth:'7rem'}}>
        <NullFlavorWrapper  checked={checked} key={`housenum_${checked}`}                
          label={<label htmlFor="housenum">дом</label>}
          field={
            <AutoComplete id='housenum' dropdown              
              value={house}                      
              field='name'            
              onChange={(e)=>{
                if(e.value && e.value?.AOGUID) { 
                    addressStore.clear()                                        
                    setAddress(e.value)                
                    if (props.onChange) props.onChange(value)
                    setHouse(e.value.name)
                } else {
                  setHouse(e.value)
                  if (addresses?.entries.length===0 && e.value.trim().length>0) {
                    value.housenum = e.value                    
                    if (props.onChange) props.onChange(value)
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
                if (parent)  setAddresses(await addressStore.getChildItems(parent, 'building', e.query))                 
                }}                                                   
            />
          }
          options={nfOptions}                   
          lincked                                   
        /> 
      </div>
      <div className="p-paragraph-field p-mr-3 p-mb-2"  
                  style={{ maxWidth:'7rem'}}> 
        <NullFlavorWrapper  checked={checked} key={`struc_${checked}`}                
          label={<label htmlFor="strucnum">стр.</label>}
          field={
            <InputText id='strucnum'              
              value={value.strucnum || ''}                
              onChange={(e)=>{
                if (e.target.value.trim().length>0) value.strucnum=e.target.value                
                if (props.onChange) props.onChange(value)
              }}/>
          }
          options={nfOptions}                   
          lincked                                   
        />
      </div>
      <div className="p-paragraph-field p-mr-3 p-mb-2" style={{marginLeft: props.paraNum ? '1.5rem': '', maxWidth:'7rem'}}>
        <NullFlavorWrapper  checked={checked} key={`build_${checked}`}                
          label={<label htmlFor="buildnum">корп.</label>}
          field={ 
            <InputText id='buildnum'              
              value={value.buildnum || ''}                
              onChange={(e)=>{
                if (e.target.value.trim().length>0) value.buildnum=e.target.value                
                if (props.onChange) props.onChange(value)
              }}                  
            />
          }
          options={nfOptions}                   
          lincked                                   
        />
      </div>
      <div className="p-paragraph-field p-mr-3 p-mb-2" 
            style={{ maxWidth:'9rem'}}>
        <NullFlavorWrapper  checked={checked} key={`flat_${checked}`}                
          label={<label htmlFor="flat">квартира(офис)</label>}
          field={
            <InputText id='flat'               
              value={value.flat || ''}                  
              onChange={(e)=>{
                value.flat=e.target.value                
                if (props.onChange) props.onChange(value)
              }}                                               
            />
          }
          options={nfOptions}                   
          lincked                                   
        />
      </div>
      <div className="p-paragraph-field p-mr-3 p-mb-2">
        <NullFlavorWrapper  checked={checked} key={`postalCode_${checked}`}                
          label={<label htmlFor="postalCode">почтовый код</label>}
          field={
            <InputText id='postalCode' disabled={value.aoGUID!==undefined}              
              value={value.postalCode || ""}                  
              onChange={(e)=>{
                value.postalCode=e.target.value                
                if (props.onChange) props.onChange(value)
              }}                                               
            />
          }
          options={nfOptions}                   
          lincked                                   
        />
      </div>  
  </>)
}
export default observer(AddressFC) 