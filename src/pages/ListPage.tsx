import { observer } from 'mobx-react-lite'
import { Context } from '..'
import { MultiSelect } from 'primereact/multiselect'
import { Column} from 'primereact/column'
import { DataTable, DataTableFilterMatchModeType, DataTableFilterMeta, DataTableSortParams } from 'primereact/datatable'
import { Toast } from 'primereact/toast'
import { FC, useContext, useEffect, useRef, useState } from 'react'
import MainLayout from '../components/layouts/MainLayout'
import { CERTIFICATE_ROUTE, DIRECTION, LIST_ROUTE, RunsackFilterMatchMode } from '../utils/consts'
import { ICertificate } from '../models/responses/ICertificate'
import React from 'react'
import { Button } from 'primereact/button'
import { GENDERS } from '../NSI/1.2.643.5.1.13.13.11.1040'
import { DEAD_PLACE_TYPES } from '../NSI/1.2.643.5.1.13.13.99.2.20'
import { BASIS_DERMINING } from '../NSI/1.2.643.5.1.13.13.99.2.23'
import '../styles/components/DataTable.css'
import '../styles/components/MultiSelect.css'
import { CERT_TYPES } from '../NSI/1.2.643.5.1.13.13.99.2.19'
import { getOneLinePersonName } from '../models/IPersonName'
import  PrimeReact, {FilterMatchMode}  from 'primereact/api'
import { IReference } from '../models/IReference'
import { InputText } from 'primereact/inputtext'




type ListPageProps = {}

const ListPage: FC<ListPageProps> = (props: ListPageProps) => {
  const {certificateStore, userStore} = useContext(Context)  
  const [lazyLoading, setLazyLoading] = useState(false)
  const [sortField, setSortField] = useState<string>('')
  const [sortOrder, setSortOrder] = useState<-1 | 0 | 1>(0)
  const [filters, setFilters] = useState<DataTableFilterMeta | undefined>()
 
  PrimeReact.locale = 'ru'
  const toast = useRef<Toast>(null)
  const dt = useRef(null)  

  const [selected, setSelected] = useState<ICertificate | undefined>()

  const initFilters = () => {
        setFilters({
        'basis_determining': { value: null, matchMode: FilterMatchMode.IN },              
        'number': { operator: 'and', constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]}, 
        'patient_fio': { operator: 'and', constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }]},
        'patient_birth_date' : { operator: 'and', constraints: [{ value: null, matchMode: FilterMatchMode.DATE_AFTER},{ value: null, matchMode: FilterMatchMode.DATE_BEFORE}]},
        'issue_date': { operator: 'and', constraints: [{ value: null, matchMode: FilterMatchMode.DATE_AFTER},{ value: null, matchMode: FilterMatchMode.DATE_BEFORE}]},   
        'death_place': { value: null, matchMode: FilterMatchMode.IN },        
        })        
    }
   
   
    useEffect(() => {        
        initFilters()
    }, [])
  const orderNumberBodyTemplate = (rowData: ICertificate)=>{
    const idx = certificateStore.certs.indexOf(rowData)+1
    return <i>{idx}</i>
  }
  const seriesNumberBodyTemplate = (rowData: ICertificate)=>{   
    const cert_type = CERT_TYPES.find(el=>el.code===rowData.cert_type) 
    return <>{rowData.series} {rowData.number} {cert_type?.s_name}</>
  }
  const reasonsBodyTemplate = (rowData: ICertificate)=>{
    const acme = rowData.reason_ACME
    const isACME = !!acme
    const cr = rowData.c_reason?.diagnosis
    const ar = rowData.a_reason?.diagnosis
    const br = rowData.b_reason?.diagnosis
    const dr = rowData.d_reason?.ext_diagnosis
    let result = isACME && !!cr && acme === cr.ICD10 ? 
      `(ПП-${acme})${cr.s_name}; ` : !!cr ? `(В-${cr.ICD10})${cr.s_name}; ` : ''
    result += (isACME && !!ar && acme === ar.ICD10 ? `(ПП-${acme})${ar.s_name}; ` : 
          !!ar ? `(А-${ar.ICD10})${ar.s_name}; ` : '')
    result += (isACME && !!br && acme === br.ICD10 ? `(ПП-${acme})${br.s_name}; ` : 
          !!br ? `(Б-${br.ICD10})${br.s_name}; ` : '')
    result += (isACME && !!dr && acme === dr.ICD10 ? `(ПП-${acme})${dr.s_name}; ` : 
          !!dr ? `(Г-${dr.ICD10})${dr.s_name}; ` : '')
    if (rowData.death_reasons && rowData.death_reasons.length>0) { 
      result +="Сопутствующие: " 
      rowData.death_reasons.forEach(el=>{
        result +=`(${el.diagnosis?.ICD10})${el.diagnosis?.s_name}; `
      })          
    }
    return <span style={{fontSize:'smaller'}}>{result}</span>
  }

  const filterClearTemplate = (options:any) => {
        return <Button type="button" icon="pi pi-times" onClick={options.filterClearCallback} className="p-button-secondary"></Button>;
    }
   const filterApplyTemplate = (options:any) => {
        return <Button type="button" icon="pi pi-check" 
        onClick={options.filterApplyCallback} className="p-button-success"></Button>
    }
 
  const datesBodyTemplate = (rowData: ICertificate)=>{
    let _result =''
    const birth = rowData.patient?.birth_date
    if (!!birth) _result = `${birth.slice(8,10)}.${birth.slice(5,7)}.${birth.slice(0,4)}`
    const death = !rowData.death_datetime ? !rowData.death_year ? false : rowData.death_year.toString() : rowData.death_datetime 
    if (death && death.length>4) {
       if (_result.length>0)_result += `-${death?.slice(8,10)}.${death.slice(5,7)}.${death.slice(0,4)}`
       else _result = `?-${death?.slice(8,10)}.${death.slice(5,7)}.${death.slice(0,4)}`
    } else if (death && death.length<5){
       if (_result.length>0)_result += `-${death}`
       else _result = `?-${death}`
    } else if (!death && _result.length>0) {
      _result += '-?'
    }  
    return _result
  }  
  const ageBodyTemplate = (rowData: ICertificate)=>{
    if (!rowData.death_datetime || !rowData.patient?.birth_date) return ''   
    const dd = new Date(rowData.death_datetime)
    const db = new Date(rowData.patient?.birth_date)
    let age = dd.getFullYear() - db.getFullYear()
    const m = dd.getMonth() - dd.getMonth()
    if (m < 0 || (m === 0 && dd.getDate() < db.getDate())) age--    
    return age
  }

  const genderBodyTemplate = (rowData: ICertificate)=>{
    if (!rowData.patient?.gender) return ''
    else return GENDERS[rowData.patient.gender-1].name.slice(0,1)
  }

  const fioBodyTemplate = (rowData: ICertificate)=>{
      if (!rowData.patient) return ""
      else if (!rowData.patient.person) return "не иденти-фицирован"          
      const result = getOneLinePersonName(rowData.patient.person.person_name)
      return <>{result}</>
    }
  const deathPlaceBodyTemplate = (rowData: ICertificate) => {
    if (!rowData.death_place) return ''
    else {
     const place = DEAD_PLACE_TYPES.find(el=>el.code === rowData.death_place)
     if (!place) return ''
     else return <span style={{fontSize:'small'}}>{place.name}</span>
    }      
  }   
  const basisDeterminingBodyTemplate = (rowData: ICertificate) => {
    if (!rowData.basis_determining) return ''
    else {
     const basis = BASIS_DERMINING.find(el=>el.code === rowData.basis_determining)
     if (!basis) return ''
     else return <span style={{fontSize:'small'}}>{basis.name}</span>
    }      
  }
  const custodianBodyTemplate = (rowData: ICertificate) => {
    const cusName = rowData.custodian?.name
    if (!cusName) return ''
    else return <span style={{fontSize:'small'}}>{cusName}</span>
  }  

  const custodian = userStore.userInfo?.roles.includes('MIAC') ? 
    <Column  header="Мед. организация" body={custodianBodyTemplate}                      
                      style={{ flexGrow: 1, flexBasis: '100px' }}> </Column> :
    <></>                  
  const doctorBodyTemplate = (rowData: ICertificate) => {
    if (!rowData.author) return ''
    else {       
      const result = getOneLinePersonName(rowData.author.doctor.person_name)
      return  <span style={{fontSize:'small'}}>{result}</span>
    }      
  }
  const positionBodyTemplate = (rowData: ICertificate) => {
    if (!rowData.author?.doctor.position ) return ''
    else return  <span style={{fontSize:'small'}}>{rowData.author.doctor.position.name}</span>         
  }  
  const issueDateBodyTemplate = (rowData: ICertificate) => {
    const iDate = rowData.issue_date
    if (!iDate ) return ''    
    else return  <span style={{fontSize:'small'}}>{`${iDate.slice(8,10)}.${iDate.slice(5,7)}.${iDate.slice(0,4)}`}</span>         
  }

  const actionBodyTemplate = (rowData: ICertificate) => {       
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={()=>userStore.history().push(`${CERTIFICATE_ROUTE}/${rowData.id}?q=0`)} />
                
            </React.Fragment>
        )
    }
  const loadCertificatesLazy = (event: {first:number, last:number}) => {       
      certificateStore.getList(()=>{setLazyLoading(false)}, event.first, event.last)      
  }   
  const sortLazy = (e: DataTableSortParams) => {    
    const order =  e.sortOrder ? DIRECTION[e.sortOrder] : DIRECTION[0]
    certificateStore.sorts = [`${e.sortField} ${order}`]
    setSortField(e.sortField)
    if (e.sortOrder) setSortOrder(e.sortOrder)
  }  
  const basisDeterminingFilterTemplate = (options: any) => {
        return <MultiSelect value={options.value} options={BASIS_DERMINING}  onChange={(e) => options.filterCallback(e.value)} optionLabel="name" placeholder="не выбрано" className="p-column-filter" />;
    }
  const deathPlaceFilterTemplate = (options: any) => {
        return <MultiSelect value={options.value} options={DEAD_PLACE_TYPES}  onChange={(e) => options.filterCallback(e.value)} optionLabel="name" placeholder="не выбрано" className="p-column-filter" />;
    }  
  const fioFilterTemplate = (options: any) => {
        return <InputText value={options.value}  onChange={(e) => options.filterCallback(e.target.value)}  placeholder="строка поиска" className="p-column-filter" />
    }  
  const footer = `Всего ${ certificateStore.count } свидетельств(а).`  
  const layoutParams = {
        title: 'СПИСОК СВИДЕТЕЛЬСТВ',     
        url: LIST_ROUTE,
        content:
        <>
          <Toast ref={toast} />
          <div id='tableDiv' className='p-card' >             
              <DataTable ref={dt} value={certificateStore.certs}  responsiveLayout="scroll" scrollDirection="both"
                emptyMessage="нет данных, удовлетворяющих запросу" scrollable scrollHeight="72vh" 
                selectionMode="single" selection={selected}  dataKey="id" size="small"
                footer={footer}
                onSelectionChange={e =>{
                  certificateStore.select(certificateStore.certs.findIndex(el=>el.id === e.value.id))
                  setSelected(e.value)
                }} filterDisplay="menu" 
                onFilter={e=>{
                  console.log('e',e)
                  let _filters = {} as any
                  let _constraint: any = e.filters['issue_date'] 
                  if (_constraint && _constraint.constraints[0] && _constraint.constraints[0].value) 
                    _filters[`issue_date${RunsackFilterMatchMode[_constraint.constraints[0].matchMode  as DataTableFilterMatchModeType]}`]=_constraint.constraints[0].value                  
                  if (_constraint && _constraint.constraints[1] && _constraint.constraints[1].value) 
                    _filters[`issue_date${RunsackFilterMatchMode[_constraint.constraints[1].matchMode  as DataTableFilterMatchModeType]}`]=_constraint.constraints[1].value
                  _constraint = e.filters['patient_birth_date'] 
                  if (_constraint && _constraint.constraints[0] && _constraint.constraints[0].value) 
                    _filters[`patient_birth_date${RunsackFilterMatchMode[_constraint.constraints[0].matchMode  as DataTableFilterMatchModeType]}`]=_constraint.constraints[0].value                  
                  if (_constraint && _constraint.constraints[1] && _constraint.constraints[1].value) 
                    _filters[`patient_birth_date${RunsackFilterMatchMode[_constraint.constraints[1].matchMode  as DataTableFilterMatchModeType]}`]=_constraint.constraints[1].value     
                  _constraint = e.filters['number'] 
                  if (_constraint && _constraint.constraints[0] && _constraint.constraints[0].value) 
                    _filters[`number${RunsackFilterMatchMode[_constraint.constraints[0].matchMode as DataTableFilterMatchModeType]}`]=_constraint.constraints[0].value
                  _constraint = e.filters['patient_fio'] 
                  if (_constraint && _constraint.constraints[0] && _constraint.constraints[0].value) 
                    _filters[`patient_fio${RunsackFilterMatchMode[_constraint.constraints[0].matchMode as DataTableFilterMatchModeType]}`]=_constraint.constraints[0].value  
                  _constraint = e.filters['basis_determining']   
                  if (_constraint && _constraint.value) {
                    const values = _constraint.value as IReference[]
                    let _codes = [] as string[]
                    values.map(item=> _codes.push(item.code)) 
                    _filters.basis_determining_in = _codes   
                  }
                   _constraint = e.filters['death_place']   
                  if (_constraint && _constraint.value) {
                    const values = _constraint.value as IReference[]
                    let _codes = [] as string[]
                    values.map(item=> _codes.push(item.code)) 
                    _filters.death_place_in = _codes   
                  }
                  certificateStore.filters = _filters
                  certificateStore.getList(()=>{})  
                }}                
                virtualScrollerOptions={{ lazy: true, onLazyLoad: loadCertificatesLazy, itemSize: 6, delay: 200, showLoader: false, loading: lazyLoading }} filters={filters} filterLocale={'ru'}
                onRowDoubleClick={()=>userStore.history().push(`${CERTIFICATE_ROUTE}/${certificateStore.cert.id}?q=0`)}
                onSort={sortLazy} sortField={sortField} sortOrder={sortOrder}
                >  
                    <Column header="№ п.п"  body={orderNumberBodyTemplate} 
                      style={{ flexGrow: 1, flexBasis: '38px' }} frozen></Column>                                   
                    <Column header="Серия Номер Вид" body={seriesNumberBodyTemplate} filterField='number'
                      filter filterPlaceholder="Поиск по номеру" dataType='text' showFilterOperator ={false}                                           
                      filterClear={filterClearTemplate} filterApply={filterApplyTemplate} sortField='number' sortable style={{ flexGrow: 1, flexBasis: '110px' }} frozen></Column>
                    <Column header="Причины смерти и соп. патологии"  
                      style={{ flexGrow: 1, flexBasis: '250px' }} body={reasonsBodyTemplate}></Column>
                    <Column  header="ФИО" body={fioBodyTemplate} 
                      sortField='patient.person.person_name.family'
                      dataType='text' showFilterOperator ={false}
                      filter filterField='patient_fio' filterClear={filterClearTemplate} filterApply={filterApplyTemplate}  filterElement={fioFilterTemplate}
                      sortable style={{ flexGrow: 1, flexBasis: '140px' }}>  </Column>                    
                    <Column  header="Даты" body={datesBodyTemplate} filter sortable
                       showFilterOperator={false} dataType='date' filterPlaceholder="дата рождения"
                     filterField='patient_birth_date' sortField='patient.birth_date' 
                     filterClear={filterClearTemplate} filterApply={filterApplyTemplate}  
                       style={{ flexGrow: 1, flexBasis: '110px' }}> </Column>
                    <Column  header="Лет" body={ageBodyTemplate} 
                      style={{ flexGrow: 1, flexBasis: '46px' }}> </Column>
                    <Column  header="Пол" body={genderBodyTemplate} sortField='patient.gender'
                      sortable style={{ flexGrow: 1, flexBasis: '56px' }}> </Column>    
                    <Column  header="Адрес проживания" sortable 
                      field='patient.person.address.streetAddressLine'
                      style={{ flexGrow: 1, flexBasis: '200px' }}> </Column>  
                    <Column  header="Адрес смерти" sortable
                      field='death_addr.streetAddressLine'
                      style={{ flexGrow: 1, flexBasis: '200px' }}> </Column>                     
                    <Column  header="Смерть наступила" body={deathPlaceBodyTemplate}
                      showFilterMatchModes={false} filterElement={deathPlaceFilterTemplate}
                      filterClear={filterClearTemplate} filterApply={filterApplyTemplate} 
                      filter filterField='death_place' sortField='death_place' sortable 
                      style={{ flexGrow: 1, flexBasis: '140px' }}> </Column>  
                    <Column  header="Основание заключения" body={basisDeterminingBodyTemplate}
                      sortField='basis_determining' sortable
                      filterField='basis_determining' showFilterMatchModes={false}
                      filterClear={filterClearTemplate} filterApply={filterApplyTemplate}
                      filter filterElement={basisDeterminingFilterTemplate} 
                      style={{ flexGrow: 1, flexBasis: '140px' }}> </Column>
                    {custodian}
                    <Column  header="Специалист" body={doctorBodyTemplate}
                      style={{ flexGrow: 1, flexBasis: '120px' }}> </Column>
                    <Column  header="Должность" body={positionBodyTemplate}
                      style={{ flexGrow: 1, flexBasis: '130px' }}> </Column>  
                    <Column  header="Выдано" body={issueDateBodyTemplate} 
                     showFilterOperator={false} dataType='date' 
                     filterField='issue_date' sortField='issue_date' filterPlaceholder="дата выпуска"
                     filterClear={filterClearTemplate} filterApply={filterApplyTemplate}                       
                     filter sortable style={{ flexGrow: 1, flexBasis: '100px' }}> </Column>                
                    <Column body={actionBodyTemplate} exportable={false} 
                      style={{ flexGrow: 1, flexBasis: '100px' }}></Column>
                </DataTable>
          </div>  
        </>
    }

 return (
    <>
      <MainLayout {...layoutParams} />
    </>
 )  
}
export default observer(ListPage)