import React, {FC} from 'react'
import { IReference } from '../models/IReference'
import { Checkbox, CheckboxChangeParams } from "primereact/checkbox"
import { Dropdown, DropdownChangeParams } from "primereact/dropdown"
import { useState } from 'react'
import { NULL_FLAVORS } from '../utils/defaults'
import { INullFlavor } from '../models/INullFlavor'

type NullFlavorWrapperProps = {
  paraNum?: string,  
  label: React.ReactElement,  
  checked?: boolean, 
  setCheck?: ((e: CheckboxChangeParams, nullFlavors?: INullFlavor[]) => void), 
  disabled?: boolean,
  field: React.ReactElement,
  field_name?: string,
  options: IReference[],
  nullFlavors?: INullFlavor[], 
  value?: number, 
  onChange?: ((e: IReference) => void),
  lincked?: boolean
}

const NullFlavorWrapper: FC<NullFlavorWrapperProps>=(props: NullFlavorWrapperProps) => { 
  const [value, setValue] = useState<IReference | null>(props.value? NULL_FLAVORS[props.value] : null)
  const [checked, setChecked] = useState<boolean>(props.checked || false) 
  const nullFlavors = (props.nullFlavors && props.field_name ) ? props.nullFlavors.filter((element)=>element.parent_attr!==props.field_name) : []
  const paragraph = props.paraNum && <span className='paragraph'>{props.paraNum}.</span>
  const checkbox  = !props.lincked && <Checkbox        
        style={{ marginLeft: "0.4rem" }}
        checked={checked}
        disabled={props.disabled} 
        onChange={(e)=>{
            setChecked(e.checked)
            if (props.nullFlavors) {
              if (props.setCheck && e.checked ) props.setCheck(e, nullFlavors)
              else if (props.setCheck && props.value && props.field_name) {
                nullFlavors.push({parent_attr: props.field_name, value: props.value })  
                props.setCheck(e, nullFlavors.concat(props.nullFlavors))
              }              
            } else if (props.setCheck) props.setCheck(e)            
          }
        }        
      />  
       
  const style =  props.lincked ? {marginTop:'0.4rem'} : {}  
  const checkboxLabel = props.lincked && !props.checked ? (<></>) : (
    <div className='p-checkbox-right p-field-checkbox'
     key={`nf_${props.checked}_${props.paraNum}`} style={style}>
      {paragraph}      
      {props.label}     
      {checkbox}
     </div>
  )
  const dropdown = !props.lincked && <Dropdown       
      id={"p" + props.paraNum}
      key={`dd_${props.paraNum}_${props.field_name}_${props.checked}`}
      value={value}      
      options={props.options}
      onChange={(e: DropdownChangeParams)=>{   
        setValue(e.value)       
        if (nullFlavors) {          
          const prev = nullFlavors.find((element)=>element.parent_attr===props.field_name)
          if (prev) prev.value = NULL_FLAVORS.findIndex((element)=>element.code===e.value.code)
        }
        if (props.onChange) props.onChange(e.value)                      
      }}
      optionLabel='name'      
      placeholder='Причина отсутствия'
    />    
  const canNullFlavor = checked ? (
    props.field
  ) : (
    dropdown
  )
  return (<>{checkboxLabel}{canNullFlavor}</>)
}
export default NullFlavorWrapper