import React, {FC} from 'react'
import { IReference } from '../models/IReference'
import { Checkbox } from "primereact/checkbox"
import { Dropdown } from "primereact/dropdown"

type NullFlavorWrapperProps = {
  paraNum?: string,  
  label: React.ReactElement,  
  checked: boolean, 
  setCheck: Function, 
  disabled?: boolean,
  field: React.ReactElement,
  options: IReference[],
  value: IReference, 
  setValue: Function,
}

const NullFlavorWrapper: FC<NullFlavorWrapperProps>=(props: NullFlavorWrapperProps) => { 
  const paragraph = props.paraNum && <span className='paragraph'>{props.paraNum}.</span>
  const checkboxLabel = (
    <div className='p-checkbox-right p-field-checkbox' key={`nf_${props.checked}_${props.paraNum}`}>
      {paragraph}      
      {props.label}     
      <Checkbox        
        style={{ marginLeft: "0.4rem" }}
        checked={props.checked}
        disabled={props.disabled}
        onChange={(e) =>{props.setCheck(e.checked)        
        }}
      />
    </div>
  )
  const canNullFlavor = props.checked ? (
    props.field
  ) : (
    <Dropdown       
      id={"p" + props.paraNum}
      key={`dd_${props.paraNum}_${props.value?.code}`}
      value={props.value}      
      options={props.options}
      onChange={(e) => props.setValue(e.value)}
      optionLabel='name'      
      placeholder='Причина отсутствия'
    />
  )
  return (<>{checkboxLabel}{canNullFlavor}</>)
}
export default NullFlavorWrapper