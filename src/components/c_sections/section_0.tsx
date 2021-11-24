import { observer } from 'mobx-react-lite'
import { FC, useContext } from 'react'
import { Context } from '../..'
import { Dropdown } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'
import { Calendar } from 'primereact/calendar'
import { Divider } from 'primereact/divider'
import { CERT_TYPE } from '../../utils/consts'
import { Card } from 'primereact/card'
import '../../styles/pages/CertificatePage.css'
 const Section0: FC = () => {
   const { certificateStore } = useContext(Context)
   const cert =  certificateStore.cert  
   const header = () => {
      return <span>Сведения о документе</span>
    }
  return (<>    
      <Card className="c-section p-mr-2 p-mb-2" header={header}>
        <div className="p-fluid p-formgrid p-grid">
          <div className="p-field p-col-12 p-md-6">
            <label htmlFor="firstname6">Серия</label>
            <InputText id="firstname6" value={cert.series} disabled type="text" 
              placeholder='Заполняется автоматически' />
          </div>
          <div className="p-field p-col-12 p-md-6">
            <label htmlFor="lastname6">Номер</label>
            <InputText id="lastname6" value={cert.number} disabled type="text" placeholder='Заполняется автоматически'/>
          </div>
          <div className="p-field p-col-12 p-md-6">
            <label htmlFor="state">Вид свидетельства</label>
            <Dropdown inputId="state"  placeholder="Выбрать" autoFocus 
              options={CERT_TYPE.filter((item)=>"1 2".includes(item.code))} optionLabel="name"
              value={cert.certType} onChange={(e) =>certificateStore.cert.certType = e.value} />
          </div>
          <div className="p-field p-col-12 p-md-6">                    
            <label htmlFor="icon">Дата</label>
            <Calendar id="icon"  dateFormat="dd/mm/yy" value={cert.effTime} disabled showIcon />
          </div>
        </div>
        <Divider/>
        <div className="p-grid p-mt-2">              
          <div className="p-col-6 p-d-flex p-flex-column p-jc-left p-ai-center p-flex-md-row p-flex-wrap">
            <div className="overview-number p-mr-1 p-mb-1" style={{padding:'0.1rem'}}>Статус:</div>
            <div className="overview-subtext p-mr-1 p-mb-1"style={{fontWeight:600,background: '#c8e6c9', color: '#256029', padding:'0.2rem'}}>АКТУАЛЬНОЕ</div>
          </div>
          <div className="p-col-6 p-d-flex p-flex-column p-jc-left p-ai-center p-flex-md-row p-flex-wrap"
            style={{borderLeft:'1px #dee2e6', borderLeftStyle:'solid'}}>
            <div className="overview-number p-mr-1 p-mb-1" style={{padding:'0.1rem'}}>Ранее выданные:</div>
            <div className="overview-subtext p-mr-1 p-mb-1" style={{fontWeight:600,padding:'0.2rem'}}>НЕТ</div>
          </div>              
        </div>
      </Card>  
    </>)
  }
  export default observer(Section0) 