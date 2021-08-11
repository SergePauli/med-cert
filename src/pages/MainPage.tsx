import { observer } from 'mobx-react-lite'
import { useContext, useEffect, useState } from 'react'
import { FC } from 'react'
import { Context } from '..'
import MainLayout from '../components/layouts/MainLayout'
import { HOME_ROUTE } from '../utils/consts'
import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Divider } from 'primereact/divider'

type MainPageProps = {}

const MainPage: FC<MainPageProps> = (props: MainPageProps) => {
  const [state, setState] = useState()
  const {userStore, layoutStore} = useContext(Context)  
  useEffect(() => {}, [])
  const news =[{version:"3.00",record:"с учетом требований CDA_R2 уровня 3"},
  {version:"2.10",record:"Добавлена возможность 'грязной' выборки в ОТЧЕТНОМ БЛОКЕ"},
  {version:"2.09",record:"Добавлена возможность ввода периода времени в п.19II"}]
  const layoutParams= {
    title: 'Главная',     
    url: HOME_ROUTE,
    content:( 
      <>     
        <div className="p-d-flex p-flex-column p-jc-around p-flex-md-row p-flex-wrap">
          <Button style={{minWidth:'243px'}} className="p-mr-2 p-mb-2 p-shadow-3" label="Ввод свидетельства"  title="Форма ввода свидетельства" />
            <Button style={{minWidth:'243px'}} className="p-button-secondary p-mr-2 p-mb-2 p-shadow-3" label="Настройки" title="Настройки учетной записи пользователя"/>
            <Button style={{minWidth:'243px'}} className="p-button-secondary p-mr-2 p-mb-2 p-shadow-3" id="reports" label="Отчеты" title="Формирование отчетов" />
            <Button style={{minWidth:'243px'}} className="p-mr-2 p-mb-2 p-shadow-3" label="Перинатальное свидетельство" /> 
            <Button className="p-button-secondary p-mr-2 p-mb-2 p-shadow-3" 
            id="repBt" style={{minWidth:'243px'}} label="ЖУРНАЛ" title="Журнал выданных свидетельств и копий" />                     
            <Button style={{minWidth:'243px'}} className="p-button-success p-mr-2 p-mb-2 p-shadow-3" label="Список свидетельств" title="Список введеных свидетельств" />
            
        </div> 
        <Divider />
        <div className="p-d-flex p-flex-column p-jc-around p-flex-md-row p-flex-wrap">
          <Card className="p-mr-2 p-mb-2" title="Последние изменения" >
            <DataTable className="p-datatable-sm" value={news}>
              <Column field="version" header="Версия"></Column>
              <Column field="record" header="Что нового"></Column>
            </DataTable> 
          </Card>
        </div>                  
      </>
    )    
  }
  return (
    <>
      <MainLayout {...layoutParams} />
    </>
  )
}
export default observer(MainPage)