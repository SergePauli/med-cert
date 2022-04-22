import { observer } from 'mobx-react-lite'
import { FC, useContext, useEffect } from 'react'
import MainLayout from '../components/layouts/MainLayout'
import { CERTIFICATE_ROUTE, HOME_ROUTE, LIST_ROUTE, MO_SETTINGS_ROUTE } from '../utils/consts'
import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Divider } from 'primereact/divider'
import { Context } from '..'
import { ProgressSpinner } from 'primereact/progressspinner'

type MainPageProps = {}

const MainPage: FC<MainPageProps> = (props: MainPageProps) => {
  const {userStore, certificateStore, layoutStore} = useContext(Context)
  useEffect(()=>{
    if (userStore.userInfo) certificateStore.userInfo = userStore.userInfo
    layoutStore.isLoading = true
    certificateStore.getList(()=>{layoutStore.isLoading = false},0,4)         
  },[certificateStore, layoutStore, userStore.userInfo])
  
  const news =[{version:"3.003",record:"Улучшена работа списка. Фильтрация по датам рождения, первопричинам, МО в списке"},{version:"3.002",record:"Фильтрация по датам смерти в списке"},
  {version:"3.001",record:"Исправлена ошибка нумерации в списке"},
  {version:"3.000",record:"с учетом требований CDA_R2 уровня 3"}]
  const layoutParams= {
    title: 'Главная',     
    url: HOME_ROUTE,
    content: userStore ? ( 
      <>     
        <div className="p-d-flex p-flex-column p-jc-around p-flex-md-row p-flex-wrap">
          <Button style={{minWidth:'243px'}} className="p-mr-2 p-mb-2 p-shadow-3" label="Ввод свидетельства"  title="Форма ввода свидетельства" 
          onClick={(e)=>{userStore.history().push(`${CERTIFICATE_ROUTE}/${certificateStore.cert.id}?q=0`)}}/>
            <Button style={{minWidth:'243px'}} className="p-button-secondary p-mr-2 p-mb-2 p-shadow-3" label="Настройки" title="Настройки учетной записи" onClick={(e)=>{userStore.history().push(`${MO_SETTINGS_ROUTE}/${userStore.userInfo?.organization.id}`)}}/>
            <Button style={{minWidth:'243px'}} className="p-button-secondary p-mr-2 p-mb-2 p-shadow-3" id="reports" label="Отчеты" title="Формирование отчетов" />
            <Button style={{minWidth:'243px'}} className="p-mr-2 p-mb-2 p-shadow-3" label="Перинатальное свидетельство" /> 
            <Button className="p-button-secondary p-mr-2 p-mb-2 p-shadow-3" 
            id="repBt" style={{minWidth:'243px'}} label="ЖУРНАЛ" title="Журнал выданных свидетельств и копий" />                     
            <Button style={{minWidth:'243px'}} className="p-button-success p-mr-2 p-mb-2 p-shadow-3" label="Список свидетельств" title="Список введеных свидетельств" onClick={(e)=>{userStore.history().push(LIST_ROUTE)}}/>            
        </div> 
        <Divider style={{marginTop:'1rem', marginBottom:'1rem'}}/>
        <div className="p-d-flex p-flex-column p-jc-around p-flex-md-row p-flex-wrap">
          <Card className="p-mr-2 p-mb-2" title="Последние изменения" >
            <DataTable className="p-datatable-sm" value={news} responsiveLayout='scroll'>
              <Column field="version" header="Версия"></Column>
              <Column field="record" header="Что нового"></Column>
            </DataTable> 
          </Card>
        </div>                  
      </>
    ) : (<ProgressSpinner/>)   
  }  
  return (
    <>
      <MainLayout {...layoutParams} />
    </>
  )
}
export default observer(MainPage)