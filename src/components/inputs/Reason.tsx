

import { observer } from 'mobx-react-lite'
import { AutoComplete } from 'primereact/autocomplete'
import { Button } from 'primereact/button'
import { CheckboxChangeParams } from 'primereact/checkbox'
import { InputText } from 'primereact/inputtext'
import { FC, useState } from 'react'
import Certificate from '../../models/FormsData/Certificate'
import { DeathReason } from '../../models/FormsData/DeathReason'
import { INullFlavorR } from '../../models/INullFlavor'
import { IReference } from '../../models/IReference'
import { IDiagnosis } from '../../models/responses/IDiagnosis'
import DiagnosisService from '../../services/DiagnosisService'
import { NA, NULL_FLAVORS, UNK } from '../../utils/defaults'
import NullFlavorWrapper from '../NullFlavorWrapper'

type ReasonProps = {
  disabled?:boolean
  checked?:boolean
  isExt?:boolean
  deathReason?: DeathReason
  label: string 
  certificate: Certificate
  fieldName?: string
  onChange: (reason: DeathReason | undefined)=>void
  onUp?: ()=>void
  onDown?: ()=>void
  onTimeChecked?: (checked: boolean)=>void 
  onDiagnosisChecked?: (checked: boolean, nullFlavors: INullFlavorR[] | undefined)=>void
}

const Reason: FC<ReasonProps> = (props: ReasonProps) => { 
  const options = NULL_FLAVORS.filter((item:IReference)=>"ASKU NA UNK".includes(item.code))
  const style = {width:'86px'}
  const CSS_classes = "p-field p-inputgroup p-mr-1"
  const [checked, setChecked] = useState(props.checked || false)   
  const [diagnoses, setDiagnoses] = useState<IDiagnosis[]>([]) 
  const [diagnosisText, setDiagnosisText] = useState('')
  const [diagnosisCode, setDiagnosisCode] = useState('')
  const  getDiagnoses = (event: { query: string })=>{
  const option = {} as any
  if (event.query.trim().length>0) option.s_name_cont = event.query.trim()
  if (diagnosisCode && diagnosisCode.trim().length>0) option.ICD10_start =  diagnosisCode    
  if (props.isExt) DiagnosisService.fetchExtDiagnoses(option).then(response=>{
        if (response.data.length>0) setDiagnoses(response.data)
        else setDiagnoses([])        
      }).catch((reason)=>console.log(reason)) 
  else DiagnosisService.fetchDiagnoses(option).then(response=>{
        if (response.data.length>0) setDiagnoses(response.data)
        else setDiagnoses([])        
      }).catch((reason)=>console.log(reason))    
  }
  const  getCodes = (event: { query: string })=>{    
    if (event.query.trim().length>0) {
      if (props.isExt) DiagnosisService.fetchExtDiagnoses({'ICD10_start': event.query.trim()}).then(response=>{        
        if (response.data.length>0) setDiagnoses(response.data)
        else setDiagnoses([])        
      }).catch((reason)=>console.log(reason))
      else DiagnosisService.fetchDiagnoses({'ICD10_start': event.query.trim()}).then(response=>{                
        if (response.data.length>0) setDiagnoses(response.data)
        else setDiagnoses([])        
      }).catch((reason)=>console.log(reason)) 
    } 
  }
  const deathTime = props.certificate.deathDatetime  
  const [deathReason, setDeathReason] = useState<DeathReason | null | undefined>(props.deathReason)  
  const upButton = props.onUp === undefined ? <></> : <Button icon="pi pi-angle-up" onClick={props.onUp} className="p-button-rounded p-button-secondary p-mr-1" />
  const downButton = props.onDown === undefined ? <></> : <Button icon="pi pi-angle-down" onClick={props.onDown} className="p-button-rounded p-button-secondary" />
  const diagnosisOptionTemplate = (option: IDiagnosis) => {
        return (
          <span>
            <span style={{marginRight:'4px'}}>{option.ICD10}</span>
            <span>{option.s_name}</span>
          </span>
        )
    }
  const effTime = checked && !!deathReason && !!deathTime ? (<NullFlavorWrapper  
      checked={checked && !!deathReason.effectiveTime} 
      key={`et_${deathReason.effectiveTime}`} 
      label={<label>Период времени между началом патол. состояния и смертью</label>} 
      options={options}  paraNum value={UNK}
      nullFlavors={deathReason.nullFlavors}
      setCheck={(e: CheckboxChangeParams, nullFlavors: INullFlavorR[] | undefined)=>{
        if (!e.checked) deathReason.effectiveTime = undefined 
        if (nullFlavors) deathReason.nullFlavors = nullFlavors
        props.onChange(deathReason)
        if (props.onTimeChecked) props.onTimeChecked(e.checked)
      }}
      onChange={(e: IReference, nullFlavors: INullFlavorR[] | undefined)=>{        
        if (nullFlavors) deathReason.nullFlavors = nullFlavors}}
      field_name="effective_time"
      field={
        <div className="p-fluid p-formgrid p-grid" style={{marginLeft:'0'}}>           
          <div className={CSS_classes} style={style} key={`rt_${deathTime}`}>  
            <span className="p-inputgroup-addon">лет</span>          
            <InputText id="year" type="number" min={0} max={99}
                onChange={(e)=>{  
                const value = Number.parseInt(e.target.value)                             
                deathReason.years = value === 0 ? undefined : value
                props.certificate.saveReasonEffTime(deathReason)
                props.onChange(deathReason)              
              }}
             value={deathReason.years} />         
          </div>
          <div className={CSS_classes} style={style}>
            <span className="p-inputgroup-addon">мес</span>            
            <InputText id="month" type="number" 
              min={0} max={12} onChange={(e)=>{
              const value = Number.parseInt(e.target.value)  
              deathReason.months = value === 0 ? undefined : value
              props.certificate.saveReasonEffTime(deathReason) 
              props.onChange(deathReason)
            }}
            value={deathReason.months}/>
          </div>
          <div className={CSS_classes} style={style}> 
            <span className="p-inputgroup-addon">нед</span>           
            <InputText id="ned" type="number" 
            min={0} max={4} onChange={(e)=>{
              const value = Number.parseInt(e.target.value)
              deathReason.weeks = value === 0 ? undefined : value
              props.certificate.saveReasonEffTime(deathReason)
              props.onChange(deathReason)
            }}
            value={deathReason.weeks}/>         
          </div>
          <div className={CSS_classes} style={style}>
            <span className="p-inputgroup-addon">сут</span>            
            <InputText id="dne" type="number" 
            min={0} max={7} onChange={(e)=>{
              const value = Number.parseInt(e.target.value)
              deathReason.days = value === 0 ? undefined : value
              if (props.certificate.saveReasonEffTime(deathReason)) props.onChange(deathReason)
            }}
            value={deathReason.days}/>
          </div>
          <div className={CSS_classes} style={style}>
            <span className="p-inputgroup-addon">час</span>            
            <InputText id="hours" type="number"
             min={0} max={23} onChange={(e)=>{
              const value = Number.parseInt(e.target.value) 
              deathReason.hours = value === 0 ? undefined : value
              if (props.certificate.saveReasonEffTime(deathReason)) props.onChange(deathReason)
            }}
             value={deathReason.hours}/>          
          </div>
          <div className={CSS_classes} style={style}>
            <span className="p-inputgroup-addon">мин</span>            
            <InputText id="minut" type="number"
              min={0} max={59} onChange={(e)=>{
              const value = Number.parseInt(e.target.value)  
              deathReason.minutes = value === 0 ? undefined : value
              props.certificate.saveReasonEffTime(deathReason) 
              props.onChange(deathReason)
            }}
             value={deathReason.minutes}/>
          </div>
        </div>
      }
    />) : <></>        
  return (<div className="p-paragraph-field"  style={{width: '100%'}}>  
    <NullFlavorWrapper disabled={props.disabled} checked={checked} key={`rs2_${deathReason?.id}_${deathReason?.diagnosis}`}
      setCheck={(e: CheckboxChangeParams, nullFlavors: INullFlavorR[] | undefined)=>{
        setChecked(e.checked)        
        if (e.checked) {
          const reason = new DeathReason()
          props.onChange(reason)
          setDeathReason(reason)
        } else {           
          if (!!deathReason) {             
            deathReason.nullFlavors = []
            deathReason.effectiveTime = undefined  
            deathReason.diagnosis = undefined
            deathReason.nullFlavors.push({parent_attr:'effective_time', code: NA} as INullFlavorR)   
            deathReason.nullFlavors.push({parent_attr:'diagnosis', code: NA} as INullFlavorR)       
          } 
          props.onChange(undefined)   
        }
        if (props.onDiagnosisChecked) props.onDiagnosisChecked(e.checked, nullFlavors)        
      }}  
      label={<label>{props.label}</label>} 
      options={options} 
      nullFlavors={!props.fieldName ? deathReason?.nullFlavors : props.certificate.nullFlavors}       
      paraNum      
      field_name={props.fieldName || 'diagnosis'}
      value={NA}
      field={
        <div className="p-fluid p-formgrid p-grid">     
          <div className={`p-field p-col-12 ${props.isExt ? 'p-md-10' : 'p-md-8'}`}>             
            <AutoComplete id="reason_text" placeholder="Диагноз"
              suggestions={diagnoses} delay={1000} dropdown
              completeMethod={getDiagnoses} itemTemplate={diagnosisOptionTemplate}
              field="s_name" onChange={(e) =>{ 
                if (!!deathReason && !!e.value.s_name) { 
                  deathReason.diagnosis = e.value
                  if (deathReason.diagnosis) setDiagnosisCode(deathReason.diagnosis?.ICD10)
                } else if(e.value) {
                  if (!!deathReason) deathReason.diagnosis = undefined
                  setDiagnosisText(e.value)                  
                } else {
                  if (deathReason) deathReason.diagnosis = undefined
                  setDiagnosisText('')                  
                }  
                if (deathReason!=null) props.onChange(deathReason)
              }}
              value={props.deathReason?.diagnosis || diagnosisText}/>          
          </div>
          <div className="p-field p-col-12 p-md-2">
            <AutoComplete id="reason_code" placeholder="Код"
              suggestions={diagnoses} delay={1000} field="ICD10"
              itemTemplate={diagnosisOptionTemplate}
              completeMethod={getCodes} onChange={(e) =>{ 
                if (!!deathReason && !!e.value.s_name) {
                    deathReason.diagnosis = e.value
                    if (deathReason.diagnosis) setDiagnosisCode(deathReason.diagnosis?.ICD10)
                } else if(e.value) {
                    if (deathReason) deathReason.diagnosis = undefined
                  setDiagnosisCode(e.value)                
                } else {
                  if (deathReason) deathReason.diagnosis = undefined               
                  setDiagnosisCode('')
                }  
                if (deathReason!=null) props.onChange(deathReason)
              }}
              value={props.deathReason?.diagnosis || diagnosisCode}/>          
          </div>
          <div className={`p-field ${props.isExt ? '' : 'p-col-12 p-md-2'}`}>
            {upButton}
            {downButton}            
          </div>
        </div>
      }
    />  
    {effTime}
  </div>)
}
export default observer(Reason)