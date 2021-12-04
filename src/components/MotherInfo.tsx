import { useContext, useEffect, useState } from 'react'
import { InputNumber } from 'primereact/inputnumber'
import { InputText } from 'primereact/inputtext'
import NullFlavorWrapper from './NullFlavorWrapper'
import { ChildInfo } from '../models/FormsData/ChildInfo'
import RelatedSubject from '../models/FormsData/RelatedSubject'
import { IChildInfo } from '../models/IChildInfo'
import { INullFlavor } from '../models/INullFlavor'
import { IPersonName } from '../models/IPersonName'
import { IReference } from '../models/IReference'
import { IRelatedSubject } from '../models/IRelatedSubject'
import {  HOME_REGION_CODE, NULL_FLAVORS, UNK } from '../utils/defaults'
import { CheckboxChangeParams } from 'primereact/checkbox'
import { Calendar } from 'primereact/calendar'
import AddressFC from './inputs/AddressFC'
import Address from '../models/FormsData/Address'
import { Context } from '..'

type MotherInfoProps = {
  childInfo?: ChildInfo
  onChange: ((childInfo: ChildInfo) => void)  
}

export const MotherInfo = (props: MotherInfoProps) => {
  const { addressStore, certificateStore} = useContext(Context)  
  const [fio, setFio] = useState('')
  const [childInfo] = useState(props.childInfo || new ChildInfo({} as IChildInfo))
  const [relatedSubject] = useState(childInfo.relatedSubject || new RelatedSubject({} as IRelatedSubject))
  
  useEffect(()=>{       
      if (childInfo.relatedSubject!==relatedSubject) childInfo.relatedSubject = relatedSubject
      setFio(relatedSubject.fio ? `${relatedSubject.fio.family} ${relatedSubject.fio.given_1} ${relatedSubject.fio?.given_2}` : '')      
    },[certificateStore, childInfo, relatedSubject])         
    const options = NULL_FLAVORS.filter((item:IReference)=>"UNK".includes(item.code))
    const address = relatedSubject.addr   
    const checked = relatedSubject.nullFlavors.findIndex((item)=>item.parent_attr==='addr')===-1
    useEffect(()=>{ 
    if (checked && address) addressStore.address = address
    else if (checked && addressStore.address.aoGUID) addressStore.address = new Address({ state: HOME_REGION_CODE, streetAddressLine: "", nullFlavors: [] })   
    },[addressStore, address, checked])    
    
    return ( <>
      <div className="p-field p-grid" style={{width:'90%'}}>
        <label htmlFor="weight" 
          className="p-col-fixed" style={{width:'85%'}} >масса тела ребенка при рождении (грамм)</label>
        <div className="p-col">
          <InputNumber  id="weight" value={childInfo.weight} max={9999} min={10} 
            onChange={(e)=>{
              childInfo.weight=e.value              
            }}
          type="text"/>
        </div>
      </div>
      <div className="p-field p-grid" style={{width:'90%'}}>
        <label htmlFor="which_account" className="p-col-fixed" style={{width:'85%'}} >каким по счету был ребенок у матери (считая умерших и не считая мертворожденных)</label>
        <div className="p-col">
          <InputNumber  id="which_account" max={99} min={1}
            onChange={(e)=>{
              childInfo.whichAccount=e.value              
            }} 
            value={childInfo.whichAccount} type="text"/>
        </div>
      </div> 
      <div className='p-paragraph-field p-mr-2 p-mb-2'>
        <NullFlavorWrapper                           
          setCheck={(e:CheckboxChangeParams, nullFlavors: INullFlavor[] | undefined)=>
            { if (e.checked)  { 
              } else { 
                relatedSubject.fio = undefined                
                props.onChange(childInfo) 
              }
              if (nullFlavors) relatedSubject.nullFlavors = nullFlavors              
            }}                 
          label={<label htmlFor="fio">Фамилия матери, имя, отчество(при наличии)</label>}
          field={<InputText  id="fio" type="text" 
                  value={fio}                    
                  onChange={(e)=>{     
                    setFio(e.target.value)               
                    const values = e.target.value.trim().split(" ")
                    if (values && values.length > 1) {
                      const temp = {family: values[0], given_1: values[1]} as IPersonName
                      if (values[2]) temp.given_2 = values[2]
                      relatedSubject.fio = temp
                      props.onChange(childInfo)                     
                    }                                        
                  }}/>}                  
          options={options} 
          value={UNK} 
          nullFlavors={relatedSubject.nullFlavors}  
          field_name="person_name"                                 
        />             
      </div>
      <div className='p-paragraph-field p-mr-2 p-mb-2'>                     
        <NullFlavorWrapper                                       
          label={<label htmlFor="dateBirth">Дата рождения матери</label>}
          setCheck={(e:CheckboxChangeParams, nullFlavors: INullFlavor[] | undefined)=>{                      
                      if (!e.checked) {                        
                        relatedSubject.birthTime = undefined                        
                      } 
                      if (nullFlavors) relatedSubject.nullFlavors = nullFlavors
                    }} 
          onChange={(e:IReference,  nullFlavors: INullFlavor[] | undefined)=>{
            if (nullFlavors) relatedSubject.nullFlavors = nullFlavors}}
          field={<Calendar id="dateBirth" showIcon                                            
                  value={relatedSubject.birthTime} 
                  onChange={(e)=>{
                    relatedSubject.birthTime = e.target.value as Date | undefined
                  }}                         
                />}
          options={options} 
          value={UNK} 
          nullFlavors={relatedSubject.nullFlavors}  
          field_name="birthTime"
        />                               
      </div> 
      <div className="p-field p-d-flex p-flex-wrap p-jc-start" style={{width: '98%'}}>
      <AddressFC key={`p14_${address?.id}_${address?.streetAddressLine}`}
        label="Место жительства матери" checked={checked}  
        setCheck={(e:CheckboxChangeParams, nullFlavors: INullFlavor[] | undefined)=>{
                if (nullFlavors) relatedSubject.nullFlavors = nullFlavors                  
                if (e.checked) addressStore.address = new Address({ state: HOME_REGION_CODE, streetAddressLine: "", nullFlavors: [] })
                else relatedSubject.addr = undefined
        }} 
        nfValue={UNK}
        field_name="addr"
        nullFlavors={relatedSubject.nullFlavors}             
        onChange={(value: Address)=>{
          if (relatedSubject.addr !== value) relatedSubject.addr=value 
        }}
      />
      </div>          
    </>)
}