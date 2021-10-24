
import { InputText } from 'primereact/inputtext'
import { FC } from 'react'
import { DeathReason } from '../../models/FormsData/DeathReason'
import { IReference } from '../../models/IReference'
import { NULL_FLAVORS, UNK } from '../../utils/defaults'
import NullFlavorWrapper from '../NullFlavorWrapper'


type ReasonProps = {
  disabled?:boolean
  checked?:boolean
  deathReason?: DeathReason
  label: string 
  fieldName?: string
}

export const Reason: FC<ReasonProps> = (props: ReasonProps) => { 
  const options = NULL_FLAVORS.filter((item:IReference)=>"ASKU NA UNK".includes(item.code))
  const style = {width:'80px'}
  const CSS_classes = "p-field p-inputgroup p-mr-2"
  const effTime = props.checked ? (<NullFlavorWrapper disabled={props.disabled} checked={props.checked}
      label={<label>Период времени между началом патол. состояния и смертью</label>} 
      options={options}
      value={UNK}
      field_name={props.fieldName}
      field={
        <div className="p-fluid p-formgrid p-grid">           
          <div className={CSS_classes} style={style}>  
            <span className="p-inputgroup-addon">лет</span>          
            <InputText id="years" type="number" min={0} max={99} />         
          </div>
          <div className={CSS_classes} style={style}>
            <span className="p-inputgroup-addon">мес</span>            
            <InputText id="month" type="number" min={0} max={12}/>
          </div>
          <div className={CSS_classes} style={style}> 
            <span className="p-inputgroup-addon">нед</span>           
            <InputText id="ned" type="number" min={0} max={4}/>         
          </div>
          <div className={CSS_classes} style={style}>
            <span className="p-inputgroup-addon">сут</span>            
            <InputText id="dne" type="number" min={0} max={7} />
          </div>
          <div className={CSS_classes} style={style}>
            <span className="p-inputgroup-addon">час</span>            
            <InputText id="hours" type="number" min={0} max={23}/>          
          </div>
          <div className={CSS_classes} style={style}>
            <span className="p-inputgroup-addon">мин</span>            
            <InputText id="minut" type="number" min={0} max={59}/>
          </div>
        </div>
      }
    />) : <></> 
  return (<div className="p-paragraph-field p-mr-2 p-mb-2" key={`p_reason_${props.checked}`} style={{width: '90%'}}>
    <NullFlavorWrapper disabled={props.disabled} checked={props.checked}
      label={<label>{props.label}</label>} 
      options={options}
      value={UNK} paraNum      
      field_name={props.fieldName}
      field={
        <div className="p-fluid p-formgrid p-grid">     
          <div className="p-field p-col-12 p-md-10">             
            <InputText id="reason_text" placeholder="Диагноз" 
              value={props.deathReason?.diagnosis?.s_name}/>          
          </div>
          <div className="p-field p-col-12 p-md-2">
            <InputText id="reason_code" placeholder="Код"
              value={props.deathReason?.diagnosis?.ICD10}/>          
          </div>
        </div>
      }
    />  
    {effTime}
  </div>)
}