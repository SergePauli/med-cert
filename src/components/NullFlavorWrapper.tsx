import React, {FC} from 'react'
import { IReference } from '../models/IReference'
import { Checkbox, CheckboxChangeParams } from "primereact/checkbox"
import { Dropdown, DropdownChangeParams } from "primereact/dropdown"
import { useState } from 'react'
import { NULL_FLAVORS } from '../utils/defaults'
import { INullFlavorR } from '../models/INullFlavor'
import { useEffect } from 'react'

type NullFlavorWrapperProps = {
  paraNum?: boolean,  
  label: React.ReactElement,  
  checked?: boolean, 
  setCheck?: ((e: CheckboxChangeParams, nullFlavors?: INullFlavorR[]) => void), 
  disabled?: boolean,
  field: React.ReactElement,
  field_name?: string,
  options: IReference[],
  nullFlavors?: INullFlavorR[], 
  value?: number,  
  onChange?: ((e: IReference, nullFlavors: INullFlavorR[] | undefined) => void),
  lincked?: boolean
}

const NullFlavorWrapper: FC<NullFlavorWrapperProps>=(props: NullFlavorWrapperProps) => {   
  const [value, setValue] = useState<IReference | null>(props.value? NULL_FLAVORS[props.value] : null)
  const [checked, setChecked] = useState<boolean>(props.checked || false) 
  const fieldStyle = props.paraNum ? {marginLeft: '-0.76rem'} : {}
  const ddStyle = {width: '200px'}
  const nullFlavors = (props.nullFlavors && props.nullFlavors.length>0 && props.field_name ) ? props.nullFlavors.filter((element: INullFlavorR)=>element.parent_attr!==props.field_name) : []
  const nullFlavor = (props.nullFlavors && props.nullFlavors.length>0 && props.field_name ) ? props.nullFlavors.find((element: INullFlavorR)=>element.parent_attr===props.field_name) : false
  useEffect(()=>{   
    if (props.nullFlavors) {
      const nullFlavor = props.nullFlavors.find(item=>item.parent_attr===props.field_name && !item._destroy)
      if (nullFlavor) {
        setValue(NULL_FLAVORS[nullFlavor.code])
        if (props.checked!==true) setChecked(false)
      } else if (props.checked!==false) setChecked(true)
    }    
  },[props.nullFlavors, props.field_name, props.checked])   
  
  const checkbox  = !props.lincked && <Checkbox        
        style={{ marginLeft: "0.4rem" }}
        checked={checked}
        disabled={props.disabled} 
        onChange={(e)=>{
            setChecked(e.checked)
            if (props.nullFlavors) {
              if (props.setCheck && e.checked ) { 
                if (nullFlavor && nullFlavor.id) {
                  props.nullFlavors.forEach(el=>{
                    if (el.parent_attr===props.field_name) el._destroy="1"
                  })
                  props.setCheck(e)
                } else  props.setCheck(e, nullFlavors)
              } else if (props.setCheck && props.value && props.field_name) { 
                let _nullFlavors = nullFlavors               
                _nullFlavors.push({parent_attr: props.field_name, code: props.value })                                 
                props.setCheck(e, _nullFlavors)                            
              } else if (props.setCheck) props.setCheck(e)             
            } else if (props.setCheck) props.setCheck(e)            
          }
        }        
      />  
       
  const style =  props.lincked ? {marginTop:'0.4rem'} : {}  
  const checkboxLabel = props.lincked && !props.checked ? (<></>) : (
    <div className='p-checkbox-right p-field-checkbox'
     key={`nf_${props.checked}_${props.paraNum}`} style={style}>            
      {props.label}     
      {checkbox}
     </div>
  )
  const dropdown = !props.lincked && <Dropdown       
      id={"p" + props.field_name}       
      key={`dd_${props.field_name}_${props.checked}`}
      style={fieldStyle}
      value={value}      
      options={props.options}
      onChange={(e: DropdownChangeParams)=>{   
        setValue(e.value)                
        if (props.onChange) { // for not in MobX nullflavors
          const nullFlavor = {parent_attr: props.field_name, code: NULL_FLAVORS.findIndex((element)=>element.code===e.value.code)}
          let _nullFlavors = nullFlavors
          _nullFlavors.push(nullFlavor as INullFlavorR)
          props.onChange(e.value, _nullFlavors)
        } else if (!!props.nullFlavors) { //standart case nullFlavor
            const idx = props.nullFlavors.findIndex(item=>item.parent_attr===props.field_name)
            if (idx > -1) props.nullFlavors[idx].code = NULL_FLAVORS.findIndex((element)=>element.code===e.value.code)
            else throw new Error(`Error change nullFlavor: invalid field name:  ${props.field_name}`)            
        }                                    
      }}
      optionLabel='name'      
      placeholder='Причина отсутствия'
    />    
  const canNullFlavor = checked ? (
    <div style={fieldStyle}>{props.field}</div>
  ) : (
    <div style={ddStyle}>{dropdown}</div>
  )  
  return (<>{checkboxLabel}{canNullFlavor}</>)
}
export default NullFlavorWrapper