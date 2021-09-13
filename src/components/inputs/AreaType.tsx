import { RadioButton } from "primereact/radiobutton"
import { useState } from "react"
import { URBAN_AREA_TYPE, VILAGE_AREA_TYPE } from "../../utils/defaults"


type AreaTypeProps = {
  value: number | undefined
  onChange: ((value: number | undefined)=>void)
}

export const AreaType = (props: AreaTypeProps) =>{ 
  const [value, setValue] = useState<number | undefined>(props.value)
  return (  
  <div className="p-formgroup-inline">              
      <div className='p-field-radiobutton'>                  
        <RadioButton name='urban' checked={value === URBAN_AREA_TYPE}
          onChange={(e)=>{
            if (e.checked) { 
              setValue(URBAN_AREA_TYPE) 
              props.onChange(URBAN_AREA_TYPE)
            } else {
              setValue(undefined)
              props.onChange(undefined) 
            }
          }}
        />
        <label htmlFor='undef'>Городская</label>
      </div>
      <div className='p-field-radiobutton'>                  
        <RadioButton name='vilage' checked={value === VILAGE_AREA_TYPE}
          onChange={(e)=>{
            if (e.checked) { 
              setValue(VILAGE_AREA_TYPE) 
              props.onChange(VILAGE_AREA_TYPE)
            } else {
              setValue(undefined)
              props.onChange(undefined) 
            }
          }}/>
        <label htmlFor='vilage'>Сельская</label>
      </div>
    </div>
  )
}