import { observer } from 'mobx-react-lite'
import { FC, useContext, useEffect} from 'react'
import { Context } from '../..'
import { Card } from 'primereact/card'
import '../../styles/components/RadioButton.css'
import '../../styles/components/Calendar.css'
import '../../styles/pages/CertificatePage.css'
import { NULL_FLAVORS } from '../../utils/defaults'
import { IReference } from '../../models/IReference'
import { Reason } from '../inputs/Reason'


 const Section7: FC = () => {
  const { certificateStore } = useContext(Context)
   
  const optionCode = 'NA'
  const options = NULL_FLAVORS.filter((item:IReference)=>optionCode.includes(item.code))  
  
  const header = () => {
      return <span> <span className='paragraph p-mr-1'>22(I).</span>  Причины смерти.</span>
    }
  const certificate = certificateStore.cert  
    
 
      
  return (<>    
    <Card className="c-section p-mr-2 p-mb-2" header={header}>        
      <div className="p-fluid p-d-flex p-flex-wrap p-jc-start" style={{width: '98%'}}> 
        <div className='paragraph p-mr-1'>а) </div>           
        <Reason label="Болезнь или состояние, непосредственно приведшее к смерти" 
          deathReason={certificate.reasonA}
          disabled
          checked
        />
        <div className='paragraph p-mr-1'>б) </div>
        <Reason label="Патологическое состояние, которое привело к возникновению непос- редственной причины смерти" 
          deathReason={certificate.reasonB}          
        />
        <div className='paragraph p-mr-1'>в) </div>
        <Reason label="Первоначальная причина смерти" 
          deathReason={certificate.reasonC}          
        />
        <div className='paragraph p-mr-1'>г) </div>
        <Reason label="Внешняя причина смерти при травмах и отравлениях" 
          deathReason={certificate.reasonD}          
        />   
      </div>          
    </Card>  
  </>)
  }
  export default observer(Section7) 