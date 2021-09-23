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
}
const nfOptions = NULL_FLAVORS.filter((item:IReference)=>"ASKU UNK NA".includes(item.code))

const AddressFC: FC<AddressProps> = (props: AddressProps) => {
  const { addressStore } = useContext(Context)  
  const [checked, setChecked] = useState<boolean>(props.checked || false)
  const [isLoading] = useState(addressStore.isLoading)
  const value =addressStore.address  
  const regions = addressStore.regionsOptions
  const [searchStr, setSearchStr] = useState<string>(value.streetAddressLine)
  const [region, setRegion] = useState<IReference | undefined>(value.state)
  const defRegion = addressStore.defaultRegion()
  const [district, setDistrict] = useState<string>(value.district?.name || '')
  const [city, setCity] = useState<string>(value.city?.name || '')
  const [town, setTown] = useState<string>(value.town?.name || '')
  const [street, setStreet] = useState<string>(value.street?.name || '')
  const [house, setHouse] = useState<string>(value.housenum || '')
  const [addresses, setAddresses] = useState(addressStore.fiasOptions) 
  const setAddress = (e:IFiasItem)=>{ 
    if (e === null) return      
    if (e.parent!==undefined) setAddress(e.parent)
    if (e.postalCode && e.postalCode.length>0) value.postalCode = e.postalCode
    value.aoGUID = e.AOGUID
    value.houseGUID = e.HouseGUID 
    value.streetAddressLine = e.streetAddressLine
    switch (e.level) {      
      case 'City': value.city = {code: e.AOGUID, name: `${e.name} ${e.shortname}`}; break
      case 'District': value.district = {code: e.AOGUID, name: `${e.name} ${e.shortname}`}; break
      case 'Town': value.town = {code: e.AOGUID, name: `${e.name} ${e.shortname}`}; break
      case 'building': value.housenum = e.housenum; 
        value.buildnum = e.buildnum;
        value.strucnum = e.strucnum;
      break
      case 'Street': value.street = {code: e.AOGUID, name: `${e.name} ${e.shortname}`}; break
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
  return (
    <>
      <div className='p-paragraph-field  p-mb-2' style={{ width:'92%'}}>
        <NullFlavorWrapper checked={checked}
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
            </div>
            }        
        />
      </div>
      <div className="p-paragraph-field p-mr-2 p-mb-2" key={`region_${region?.name}_${defRegion?.code}`}  style={{marginLeft:'1.5rem'}}>
        <NullFlavorWrapper  checked={checked}                
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
      <div className="p-paragraph-field p-mr-2 p-mb-2"  style={{marginLeft:'1.5rem'}}>
        <NullFlavorWrapper  checked={checked}                 
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
                    setDistrict(e.value.name)
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
      <div className="p-paragraph-field p-mb-2" key={`city_${value.city?.code}`} style={{marginLeft:'1.5rem'}}>
        <NullFlavorWrapper  checked={checked}                 
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
                    setCity(e.value.name)
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
      <div className="p-paragraph-field  p-mb-2" key={`town_${value.town?.code}`} style={{marginLeft:'1.5rem'}}>
        <NullFlavorWrapper  checked={checked}                 
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
                    setTown(e.value.name)
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
      <div className="p-paragraph-field  p-mb-2" key={`street_${value.street?.code}`} style={{marginLeft:'1.5rem'}}>
        <NullFlavorWrapper  checked={checked}                 
          label={<label htmlFor="street">улица</label>}
          field={
            <AutoComplete id='street' forceSelection              
              value={street} field='name' dropdown                 
              onChange={(e)=>{
                if(e.value && e.value?.AOGUID) { 
                    addressStore.clear()                                        
                    setAddress(e.value)                
                    if (props.onChange) props.onChange(value)
                    setStreet(e.value.name)
                } else setStreet(e.value)
              }}                       
              suggestions={addresses}
              completeMethod={async (e) =>{
                let parent = value.state?.code               
                if (value.city?.code) parent = value.city?.code  
                if (value.district?.code) parent = value.district?.code 
                if (value.town?.code) parent = value.town?.code               
                if (parent)  setAddresses(await addressStore.getChildItems(parent, 'street', e.query))                 
                }}                                                   
            />
          }
          options={nfOptions}                   
          lincked                                   
        />  
      </div>
      <div className="p-paragraph-field  p-mb-2" key={`housenum_${value.housenum}`} style={{marginLeft:'1.5rem', maxWidth:'7rem'}}>
        <NullFlavorWrapper  checked={checked}                 
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
                } else setHouse(e.value)
              }}                       
              suggestions={addresses}
              completeMethod={async (e) =>{
                let parent = value.state?.code               
                if (value.city?.code) parent = value.city?.code  
                if (value.district?.code) parent = value.district?.code 
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
      <div className="p-paragraph-field p-mb-2" key={`struc_${value.strucnum}`} 
      style={{marginLeft:'1.5rem', maxWidth:'7rem'}}>
        <NullFlavorWrapper  checked={checked}                 
          label={<label htmlFor="strucnum">стр.</label>}
          field={
            <InputText id='strucnum'              
              value={value.strucnum}                
              onChange={(e)=>{
                value.strucnum=e.target.value                
                if (props.onChange) props.onChange(value)
              }}/>
          }
          options={nfOptions}                   
          lincked                                   
        />  
      </div>
      <div className="p-paragraph-field  p-mb-2" key={`build_${value.buildnum}`} style={{marginLeft:'1.5rem', maxWidth:'7rem'}}>
        <NullFlavorWrapper  checked={checked}                 
          label={<label htmlFor="buildnum">корп.</label>}
          field={
            <InputText id='buildnum'              
              value={value.buildnum}                
              onChange={(e)=>{
                value.buildnum=e.target.value                
                if (props.onChange) props.onChange(value)
              }}                  
            />
          }
          options={nfOptions}                   
          lincked                                   
        />  
      </div>
      <div className="p-paragraph-field  p-mb-2" 
       style={{marginLeft:'1.5rem', maxWidth:'7rem'}}>
        <NullFlavorWrapper  checked={checked}                 
          label={<label htmlFor="flat">квартира</label>}
          field={
            <InputText id='flat'               
              value={value.flat}                  
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
      <div className="p-paragraph-field  p-mb-2" key={`postalCode_${value.postalCode}`} style={{marginLeft:'1.5rem'}}>
        <NullFlavorWrapper  checked={checked}                 
          label={<label htmlFor="postalCode">почтовый код</label>}
          field={
            <InputText id='postalCode' disabled={value.aoGUID!==undefined}              
              value={value.postalCode}                  
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
      
    </>
  )
}
export default observer(AddressFC) 