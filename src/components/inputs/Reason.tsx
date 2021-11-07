

import { observer } from 'mobx-react-lite'
import { AutoComplete } from 'primereact/autocomplete'
import { Button } from 'primereact/button'
import { CheckboxChangeParams } from 'primereact/checkbox'
import { InputText } from 'primereact/inputtext'
import { FC, useState } from 'react'
import Certificate from '../../models/FormsData/Certificate'
import { DeathReason } from '../../models/FormsData/DeathReason'
import { INullFlavor } from '../../models/INullFlavor'
import { IReference } from '../../models/IReference'
import { IDeathReason } from '../../models/responses/IDeathReason'
import { IDiagnosis } from '../../models/responses/IDiagnosis'
import DiagnosisService from '../../services/DiagnosisService'
import { NULL_FLAVORS, UNK } from '../../utils/defaults'
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
  if (diagnosisCode.trim().length>0) option.ICD10_start =  diagnosisCode    
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
  const deathReason = props.deathReason
  const certificate = props.certificate
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
  const effTime = checked && deathReason!==undefined && deathTime!==undefined ? (<NullFlavorWrapper disabled={props.disabled} 
      checked={checked && (deathReason.effectiveTime!==undefined || props.disabled)} 
      key={`et_${deathReason.effectiveTime}`} 
      label={<label>Период времени между началом патол. состояния и смертью</label>} 
      options={options}  paraNum value={UNK}
      nullFlavors={deathReason.nullFlavors}
      setCheck={(e: CheckboxChangeParams, nullFlavors: INullFlavor[] | undefined)=>{
        if (!e.checked) deathReason.effectiveTime = undefined 
        if (nullFlavors) deathReason.nullFlavors = nullFlavors
        props.onChange(deathReason)
      }}
      field_name="effective_time"
      field={
        <div className="p-fluid p-formgrid p-grid" >           
          <div className={CSS_classes} style={style} key={`rt_${deathTime}`}>  
            <span className="p-inputgroup-addon">лет</span>          
            <InputText id="year" type="number" min={0} max={99}
                onChange={(e)=>{                             
                deathReason.years = Number.parseInt(e.target.value)
                props.certificate.saveReasonEffTime(deathReason)
                props.onChange(deathReason)              
              }}
             value={deathReason.years} />         
          </div>
          <div className={CSS_classes} style={style}>
            <span className="p-inputgroup-addon">мес</span>            
            <InputText id="month" type="number" 
              min={0} max={12} onChange={(e)=>{
              deathReason.months = Number.parseInt(e.target.value)
              props.certificate.saveReasonEffTime(deathReason) 
              props.onChange(deathReason)
            }}
            value={deathReason.months}/>
          </div>
          <div className={CSS_classes} style={style}> 
            <span className="p-inputgroup-addon">нед</span>           
            <InputText id="ned" type="number" 
            min={0} max={4} onChange={(e)=>{
              deathReason.weeks = Number.parseInt(e.target.value)
              props.certificate.saveReasonEffTime(deathReason)
              props.onChange(deathReason)
            }}
            value={deathReason.weeks}/>         
          </div>
          <div className={CSS_classes} style={style}>
            <span className="p-inputgroup-addon">сут</span>            
            <InputText id="dne" type="number" 
            min={0} max={7} onChange={(e)=>{
              deathReason.days = Number.parseInt(e.target.value)
              if (props.certificate.saveReasonEffTime(deathReason)) props.onChange(deathReason)
            }}
            value={deathReason.days}/>
          </div>
          <div className={CSS_classes} style={style}>
            <span className="p-inputgroup-addon">час</span>            
            <InputText id="hours" type="number"
             min={0} max={23} onChange={(e)=>{
              deathReason.hours = Number.parseInt(e.target.value)
              if (props.certificate.saveReasonEffTime(deathReason)) props.onChange(deathReason)
            }}
             value={deathReason.hours}/>          
          </div>
          <div className={CSS_classes} style={style}>
            <span className="p-inputgroup-addon">мин</span>            
            <InputText id="minut" type="number"
              min={0} max={59} onChange={(e)=>{
              deathReason.minutes = Number.parseInt(e.target.value)
              props.certificate.saveReasonEffTime(deathReason) 
              props.onChange(deathReason)
            }}
             value={deathReason.minutes}/>
          </div>
        </div>
      }
    />) : <></>
  return (<div className="p-paragraph-field" key={`rs_${checked}`} style={{width: '100%'}}>  
    <NullFlavorWrapper disabled={props.disabled} checked={checked} key={`rs2_${deathReason?.id}_${deathReason?.diagnosis}`}
      setCheck={(e: CheckboxChangeParams, nullFlavors: INullFlavor[] | undefined)=>{
        setChecked(e.checked)
        if (e.checked) {
          const reason = props.certificate.createDeathReason({certificate_id: props.certificate.id} as IDeathReason)
          props.onChange(reason)} 
        else props.onChange(undefined) 
        console.log('e',e)
        }
      }  
      label={<label>{props.label}</label>} 
      options={options} nullFlavors={props.certificate.nullFlavors} 
      onChange={(e: IReference, nullFlavors: INullFlavor[] | undefined)=>{
        if (nullFlavors) certificate.nullFlavors = nullFlavors
      }}
      paraNum      
      field_name={props.fieldName}
      field={
        <div className="p-fluid p-formgrid p-grid">     
          <div className={`p-field p-col-12 ${props.isExt ? 'p-md-10' : 'p-md-8'}`}>             
            <AutoComplete id="reason_text" placeholder="Диагноз"
              suggestions={diagnoses} delay={1000} dropdown
              completeMethod={getDiagnoses} itemTemplate={diagnosisOptionTemplate}
              field="s_name" onChange={(e) =>{ 
                if (deathReason!==undefined && e.value.s_name!==undefined) { 
                  deathReason.diagnosis = e.value
                  if (deathReason.diagnosis) setDiagnosisCode(deathReason.diagnosis?.ICD10)
                } else if(e.value) {
                  if (deathReason) deathReason.diagnosis = undefined
                  setDiagnosisText(e.value)                  
                } else {
                  if (deathReason) deathReason.diagnosis = undefined
                  setDiagnosisText('')                  
                }  
              }}
              value={props.deathReason?.diagnosis || diagnosisText}/>          
          </div>
          <div className="p-field p-col-12 p-md-2">
            <AutoComplete id="reason_code" placeholder="Код"
              suggestions={diagnoses} delay={1000} field="ICD10"
              itemTemplate={diagnosisOptionTemplate}
              completeMethod={getCodes} onChange={(e) =>{ 
                if (deathReason!==undefined && e.value.s_name!==undefined) {
                  deathReason.diagnosis = e.value
                  if (deathReason.diagnosis) setDiagnosisCode(deathReason.diagnosis?.ICD10)
                } else if(e.value) {
                  if (deathReason) deathReason.diagnosis = undefined
                  setDiagnosisCode(e.value)                  
                } else {
                  if (deathReason) deathReason.diagnosis = undefined                  
                  setDiagnosisCode('')
                }  
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