import { observer } from 'mobx-react-lite'
import { FC, useContext} from 'react'
import { Context } from '../..'
import { Card } from 'primereact/card'
import { DeathReason } from '../../models/FormsData/DeathReason'
import Reason from '../inputs/Reason'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { doACME } from '../../utils/acme'


 const Section7: FC = () => {
  const { certificateStore, layoutStore } = useContext(Context)   
  
  
  const header = () => {
      return <span> <span className='paragraph p-mr-1'>22(I).</span>  Причины смерти.</span>
    }
  const certificate = certificateStore.cert     
  const mainCSSClass = (isACME: boolean) => isACME  ? "p-fluid p-d-flex p-jc-start ACME-reason" : "p-fluid p-d-flex p-jc-start"
  const reasonBckecked = !!certificate.reasonB
  const reasonCckecked = !!certificate.reasonC
  const reasonDckecked = !!certificate.reasonD 

  const reasonIDExchange = (first: DeathReason, second: DeathReason) => {
    if (!first.id && !second.id) return
    let _id = first.id
    first.id = second.id
    second.id = _id      
  }
      
  return (<>    
    <Card className="c-section p-mr-2 p-mb-2" header={header}>        
      <div className={mainCSSClass(!!certificate.reasonA && certificate.reasonA===certificate.reasonACME)}
       style={{width: '98%'}} key={`ra_${certificate.reasonA?.diagnosis?.ICD10}`}> 
        <div className='paragraph p-mr-1'>а) </div>           
        <Reason label="Болезнь или состояние, непосредственно приведшее к смерти" 
          deathReason={certificate.reasonA} certificate={certificate}
           key={`ra2_${certificate.reasonA?.effectiveTime}`} 
          onChange={(reason: DeathReason | undefined)=>{ 
            if (reason!==certificate.reasonA ) { certificate.reasonA = reason
            layoutStore.message = { severity: 'success', summary: 'Успешно', detail: 'Причина А изменена, рекомендуется сохранить изменения', life: 3000 }}
           }}
          disabled checked
          fieldName='a_reason' 
          onDown={()=>{
            if (!certificate.reasonA && !certificate.reasonB) return
            reasonIDExchange(certificate.reasonA || new DeathReason(), 
            certificate.reasonB || new DeathReason())            
            const reason = certificate.reasonA
            certificate.reasonA = certificate.reasonB
            certificate.reasonB = reason           
          }}
        />
      </div>  
      <div className={mainCSSClass(!!certificate.reasonB && certificate.reasonB===certificate.reasonACME)} style={{width: '98%'}} key={`rb_${certificate.reasonB?.diagnosis?.ICD10}`}>   
        <div className='paragraph p-mr-1'>б) </div>
        <Reason label="Патологическое состояние, которое привело к возникновению непос- редственной причины смерти" 
          deathReason={certificate.reasonB} certificate={certificate}  key={`rb2_${certificate.reasonB?.id}`}
          onChange={(reason: DeathReason | undefined)=>{ 
            if (reason!==certificate.reasonB ) 
            certificate.reasonB = reason 
          }}           
          checked={reasonBckecked} 
          fieldName='b_reason' 
          onDown={()=>{
            if (!certificate.reasonB && !certificate.reasonC) return
            reasonIDExchange(certificate.reasonB || new DeathReason(), 
            certificate.reasonC || new DeathReason())
            const reason = certificate.reasonB
            certificate.reasonB = certificate.reasonC
            certificate.reasonC = reason
          }}  
          onUp={()=>{
            if (!certificate.reasonB && !certificate.reasonC) return
            reasonIDExchange(certificate.reasonC || new DeathReason(),
             certificate.reasonB || new DeathReason())
            const reason = certificate.reasonB
            certificate.reasonB = certificate.reasonA
            certificate.reasonA = reason
          }}            
        />
      </div>  
      <div className={mainCSSClass(!!certificate.reasonC && certificate.reasonC===certificate.reasonACME)} 
      style={{width: '98%'}} key={`rc_${certificate.reasonC?.diagnosis?.ICD10}`}>  
        <div className='paragraph p-mr-1'>в) </div>
        <Reason label="Первоначальная причина смерти" 
          deathReason={certificate.reasonC} certificate={certificate} 
          key={`rc2_${reasonCckecked}_${certificate.reasonC?.effectiveTime}`}
          onChange={(reason: DeathReason | undefined)=>{ 
            if (reason !== certificate.reasonC) certificate.reasonC = reason            
          }} fieldName='c_reason' checked={reasonCckecked}
          onUp={()=>{
            if (!certificate.reasonC && !certificate.reasonB) return
            reasonIDExchange(certificate.reasonC || new DeathReason(),
             certificate.reasonB || new DeathReason())
            const reason = certificate.reasonC
            certificate.reasonC = certificate.reasonB
            certificate.reasonB = reason
          }}        
        />
      </div>
      <div className={mainCSSClass(false)}  style={{width: '98%'}} >  
        <div className='paragraph p-mr-1'>г) </div>
        <Reason label="Внешняя причина смерти при травмах и отравлениях" 
          deathReason={certificate.reasonD} certificate={certificate} 
          key={`rd2_${reasonDckecked}_${certificate.reasonD?.effectiveTime}`}
          onChange={(reason: DeathReason | undefined)=>{ if (reason!==certificate.reasonD ) certificate.reasonD = reason }} fieldName='d_reason'
          checked={reasonDckecked}  
          isExt       
        />   
      </div>  
      <div className={mainCSSClass(false)+'p-fluid'}  style={{width: '98%',padding:'4px'}} >  
        <Button type="button" label="ACME" 
          style={{width: '5rem', height: '2.4rem'}} 
          className='p-button-warning p-mr-2'
          onClick={()=>{            
            if (certificate.reasonA?.diagnosis?.ICD10) {
              doACME(certificate, result=>{
                certificate.changeReasonACME(result)
                layoutStore.message = { severity: 'success', summary: 'Успешно', detail: `${result}-первопричина определенная АСМЕ`, life: 3000 }           
              },message=>{
                layoutStore.message = { severity: 'error', summary: 'Сбой', detail: message, life: 7000 }
              })
            } else {
              layoutStore.message = { severity: 'warn', summary: 'Oтклонено', detail: "Причина а) отсутствует", life: 7000 }
            }
          }}
        />
         <div className="p-field  p-grid">       
          <label htmlFor="ACME" 
                 className="p-col-fixed" 
                 style={{width:'226px'}}>Первоначальная причина по АСМЕ</label>   
          <div className='p-col-12 p-md-2'>                  
            <InputText id="ACME" type="text" 
              disabled value={certificate.reasonACME?.diagnosis?.ICD10 || ''}  
            />
          </div>
         </div>            
      </div>        
    </Card>  
  </>)
  }
  export default observer(Section7) 