import { observer } from 'mobx-react-lite'
import { FC, useContext } from 'react'
import { Context } from '../..'
import { InputText } from 'primereact/inputtext'
import { Card } from 'primereact/card'
import '../../styles/pages/CertificatePage.css'
 const Section1: FC = () => {
   const { certificateStore } = useContext(Context)   
   const header = () => {
      return <span>Данные умершего</span>
    }
  return (<>    
      <Card className="c-section p-mr-2 p-mb-2" header={header}>        
          <div className="p-fluid p-formgrid p-grid">
            <div className="p-field p-col-12">
              <label htmlFor="fio">Фамилия Имя Отчество</label>
              <InputText id="fio" value={certificateStore.series()} autoFocus type="text"  />
            </div>
          </div>          
      </Card>  
    </>)
  }
  export default observer(Section1) 