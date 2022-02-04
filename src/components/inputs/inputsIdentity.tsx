import { InputMask, InputMaskProps } from 'primereact/inputmask'
import { InputText } from 'primereact/inputtext'
import Identity from '../../models/FormsData/Identity'
import { ID_CARD_TYPE } from '../../utils/defaults'

type InputsIdentityProps = {
  dulValue?: ID_CARD_TYPE
  identity?:Identity  
}
export const inputsIdentity = (props:InputsIdentityProps) =>{
  const identity = props.identity
  const dulValue = props.dulValue
  const seriesProps = {type:"text", id:"series", value:identity?.series,                  
      onChange:(e:any)=>{if (identity) identity.series = e.target.value }}  
  const seriesField = dulValue?.s_mask ? <InputMask {...{mask:dulValue?.s_mask,...seriesProps} as InputMaskProps }/>
    : <InputText {...seriesProps}/>   
  const numberProps = {type:"text", id:"docNumber", value:identity?.number,                  
      onChange:(e:any)=>{if (identity) identity.number = e.target.value }}  
  const numberField = dulValue?.n_mask ? <InputMask {...{mask:dulValue?.n_mask,...numberProps} as InputMaskProps }/>
    : <InputText {...numberProps}/> 
  const depCodeProps = {type:"text", id:"depCode", value:identity?.issueOrgCode,                  
      onChange:(e:any)=>{if (identity) identity.issueOrgCode = e.target.value}}  
  const depCodeField = dulValue?.c_mask ? <InputMask {...{mask:dulValue?.c_mask,...depCodeProps} as InputMaskProps }/>
    : <InputText {...depCodeProps}/> 
  return [seriesField, numberField,  depCodeField]
}