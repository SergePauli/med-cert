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


type AddressProps = {
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
  const value = addressStore.address  
  const regions = addressStore.regionsOptions
  const [searchStr, setSearchStr] = useState<string>(value.streetAddressLine)
  const addresses = addressStore.fiasOptions 
  const setAddress = (e:IFiasItem)=>{    
    if (e.parent!==undefined) setAddress(e.parent)
    if (e.postalCode && e.postalCode.length>0) value.postalCode = e.postalCode
    value.streetAddressLine = e.streetAddressLine
    switch (e.level) {
      case 'Region':  value.state = regions?.find((item)=>item.code.startsWith(e.code || '28')); break
      case 'City': value.city = {code: e.AOGUID, name: `${e.name} ${e.shortname}`}; break
      case 'District': value.district = {code: e.AOGUID, name: `${e.name} ${e.shortname}`}; break
      case 'Town': value.town = {code: e.AOGUID, name: `${e.name} ${e.shortname}`}; break
      case 'building': value.housenum = e.name; break
      case 'Street': value.street = {code: e.AOGUID, name: `${e.name} ${e.shortname}`}; break
    } 
        
  }
  
  useEffect(() => { 
    if (value.state?.name===undefined) value.state = addressStore.defaultRegion()
    
    }, [addressStore, value])  
  return (
    <>
      <div className='p-paragraph-field  p-mb-2' style={{ width:'92%'}}>
        <NullFlavorWrapper checked={checked}
          label={<label>Место постоянного жительства (регистрации)</label>}  
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
              <AutoComplete
                id='searchFIAS' forceSelection        
                value={searchStr}
                suggestions={addresses}
                completeMethod={(e) =>{
                  addressStore.searchBar(e.query)
                 }}
                field='streetAddressLine'
                onChange={(e) => {  
                  console.log('e',e)                 
                  if(e.value?.AOGUID) { 
                    value.postalCode = undefined
                    value.district = undefined
                    value.city = undefined
                    value.houseGUID = undefined
                    value.street = undefined
                    value.town = undefined
                    value.housenum = undefined
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
      <div className="p-paragraph-field p-mr-2 p-mb-2" style={{marginLeft:'1.5rem'}}>
        <NullFlavorWrapper  checked={checked}                 
          label={<label htmlFor="region">субъект Российской Федерации</label>}
          field={
            <Dropdown 
              id='region'
              value={regions?.find((item)=>item.code.startsWith(value.state?.code || '28'))}                      
              filter filterBy='name'
              onChange={(e)=>{
                value.state=e.target.value                
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
      <div className="p-paragraph-field p-mr-2 p-mb-2" style={{marginLeft:'1.5rem'}}>
        <NullFlavorWrapper  checked={checked}                 
          label={<label htmlFor="district">район</label>}
          field={
            <AutoComplete id='district' key={`district_${value.district?.code}`} dropdown              
              value={value.district}  forceSelection                    
              field='name' 
              onChange={(e)=>{
                value.state=e.target.value               
                if (props.onChange) props.onChange(value)
              }}                       
              //suggestions={addresses}
              //completeMethod={(e) => getSuggestions(e, { contentType: "district" }, setAddresses, addresses)}                                                   
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
              value={value.city}  forceSelection                    
              field='name' 
              onChange={(e)=>{
                value.city=e.target.value                
                if (props.onChange) props.onChange(value)
              }}                       
              //suggestions={addresses}
              //completeMethod={(e) => getSuggestions(e, { contentType: "district" }, setAddresses, addresses)}                                                   
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
            <AutoComplete id='town'               
              value={value.town}  forceSelection                    
              field='name' 
              onChange={(e)=>{                               
                if (props.onChange) props.onChange(value)
              }}                       
              suggestions={addresses}
              //completeMethod={(e) => getSuggestions(e, { contentType: "district" }, setAddresses, addresses)}                                                   
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
              value={value.street} field='name'                 
              onChange={(e)=>{
                //value.street.name =e.value.name                
                if (props.onChange) props.onChange(value)
              }}                       
              //suggestions={addresses}
              //completeMethod={(e) => getSuggestions(e, { contentType: "district" }, setAddresses, addresses)}                                                   
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
            <AutoComplete id='housenum'               
              value={value.housenum}                      
              field='name' 
              onChange={(e)=>{
                value.state=e.target.value                
                if (props.onChange) props.onChange(value)
              }}                       
              //suggestions={addresses}
              //completeMethod={(e) => getSuggestions(e, { contentType: "district" }, setAddresses, addresses)}                                                   
            />
          }
          options={nfOptions}                   
          lincked                                   
        />  
      </div>
      <div className="p-paragraph-field p-mb-2" style={{marginLeft:'1.5rem', maxWidth:'7rem'}}>
        <NullFlavorWrapper  checked={checked}                 
          label={<label htmlFor="strucnum">стр.</label>}
          field={
            <AutoComplete id='strucnum'              
              value={value.state}                    
              field='name' 
              onChange={(e)=>{
                value.state=e.target.value                
                if (props.onChange) props.onChange(value)
              }}                       
              //suggestions={addresses}
              //completeMethod={(e) => getSuggestions(e, { contentType: "district" }, setAddresses, addresses)}                                                   
            />
          }
          options={nfOptions}                   
          lincked                                   
        />  
      </div>
      <div className="p-paragraph-field  p-mb-2" style={{marginLeft:'1.5rem', maxWidth:'7rem'}}>
        <NullFlavorWrapper  checked={checked}                 
          label={<label htmlFor="buildnum">корп.</label>}
          field={
            <AutoComplete id='sbuildnum'              
              value={value.state}                     
              field='name' 
              onChange={(e)=>{
                value.state=e.target.value                
                if (props.onChange) props.onChange(value)
              }}                       
              //suggestions={addresses}
              //completeMethod={(e) => getSuggestions(e, { contentType: "district" }, setAddresses, addresses)}                                                   
            />
          }
          options={nfOptions}                   
          lincked                                   
        />  
      </div>
      <div className="p-paragraph-field  p-mb-2" key={`flat_${value.flat}`}
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
export default AddressFC 