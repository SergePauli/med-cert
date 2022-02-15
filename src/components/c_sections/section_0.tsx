import { observer } from 'mobx-react-lite'
import { FC, useContext } from 'react'
import { Context } from '../..'
import { Dropdown } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'
import { Calendar } from 'primereact/calendar'
import { Divider } from 'primereact/divider'
import { Card } from 'primereact/card'
import '../../styles/pages/CertificatePage.css'
import { CERT_TYPES } from '../../NSI/1.2.643.5.1.13.13.99.2.19'
import { DATE_FORMAT } from '../../utils/consts'
 const Section0: FC = () => {
   const { certificateStore } = useContext(Context)
   const cert =  certificateStore.cert  
   const header = () => {
      return <span>Сведения о документе</span>
    }
    console.log('cert.certType',cert.certType)
  return (<>    
      <Card className="c-section p-mr-2 p-mb-2" header={header} key={certificateStore.cert.id}>
        <div className="p-fluid p-formgrid p-grid">
          <div className="p-field p-col-6 p-md-2">
            <label htmlFor="series">Серия</label>
            <InputText id="series" value={cert.series} type="text" 
              placeholder='Заполняется автоматически' disabled/>
          </div>
          <div className="p-field p-col-6 p-md-4">
            <label htmlFor="number">Номер</label>
            <InputText id="number" value={cert.number} disabled type="text" placeholder='Заполняется автоматически'/>
          </div>
          <div className="p-field p-col-12 p-md-6">                    
            <label htmlFor="icon">Дата</label>
            <Calendar id="icon"  dateFormat="dd.mm.yy" value={cert.issueDate} disabled />
          </div>
          <div className="p-field p-col-12 p-md-6">
            <label htmlFor="cert_type">Вид свидетельства</label>
            <Dropdown inputId="cert_type"  placeholder="Выбрать" autoFocus 
              options={cert.certType ? ([3, 4].includes(cert.certType) ? CERT_TYPES.filter((item)=>[4,3,1].includes(item.code)) : CERT_TYPES) : CERT_TYPES.filter((item)=>[1,2].includes(item.code)) } optionLabel="name"
              value={CERT_TYPES.find(el=>el.code===cert.certType)} onChange={(e) =>certificateStore.cert.certType = e.value.code} disabled={cert.id > -1} />
          </div>
          
        </div>
        <Divider/>
        <div className="p-grid p-mt-2">              
          <div className="p-col-6 p-d-flex p-flex-column p-jc-left p-ai-center p-flex-md-row p-flex-wrap">
            <div className="overview-number p-mr-1 p-mb-1" style={{padding:'0.1rem'}}>РАНЕЕ ВЫДАННОГО:</div>
             <div className="overview-subtext p-mr-1 p-mb-1" style={{fontWeight:600,padding:'0.2rem'}}>{!!cert.numberPrev ? `${cert.seriesPrev} ${cert.numberPrev} от ${cert.effTimePrev?.toLocaleString('ru', DATE_FORMAT)}` : 'НЕТ'}</div>
          </div>
          <div className="p-col-6 p-d-flex p-flex-column p-jc-left p-ai-center p-flex-md-row p-flex-wrap"
            style={{borderLeft:'1px #dee2e6', borderLeftStyle:'solid'}}>
            <div className="overview-number p-mr-1 p-mb-1" style={{padding:'0.1rem'}}>Статус:</div>
            <div className="overview-subtext p-mr-1 p-mb-1"style={{fontWeight:600,background: cert.latestOne ? 'rgb(211 47 47 / 22%)': '#c8e6c9', color: cert.latestOne ? 'rgb(211 47 47)' : '#256029', padding:'0.2rem'}}>{cert.latestOne ? 'ЗАМЕНЕНО' : 'АКТУАЛЬНОЕ'}</div>
          </div>              
        </div>
      </Card>  
    </>)
  }
  export default observer(Section0) 