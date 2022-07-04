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
import { IReference, IReferenceId } from '../models/IReference'
import { InputText } from 'primereact/inputtext'
import OrganizationService from '../services/OrganizationService'
import { IRouteProps } from '../models/IRouteProps'
import { Operation, OperationType } from '../store/certificateStore'


const ListPage: FC<IRouteProps> = (props: IRouteProps) => {
  const {certificateStore, userStore} = useContext(Context)  
  const [filters, setFilters] = useState<DataTableFilterMeta | undefined>()
  const [propsFilters, setPropsFilters] = useState<any | false | undefined>()  
  const [organizations, setOrganizations] = useState<IReferenceId[] | null>(null)
  const isSuperUser = userStore.userInfo?.roles.includes('MIAC') || userStore.userInfo?.roles.includes('ADMIN')
  
  useEffect(()=>{
    if (organizations===null && isSuperUser) OrganizationService.getOrganizations().then(response=>
      setOrganizations(response.data.organizations)
    ).catch(()=>{
      setOrganizations([])      
    })},[isSuperUser, organizations])
  

  useEffect(()=>{
    if (propsFilters === undefined) {
      if (props.location.search){
        const _params = props.location.search.replace("?","").split("&") 
        let _filters = {} as any
        _params.forEach(param=>{
          const pair = param.split("=")
          _filters[pair[0]]=pair[1]
        })        
        certificateStore.operation = new Operation(OperationType.FILTERING)
        certificateStore.filters = {..._filters}
        setPropsFilters({..._filters})            
      } else { 
        certificateStore.operation = new Operation(OperationType.FILTERING)       
        if (certificateStore.filters && Object.keys(certificateStore.filters).length !== 0) {
          certificateStore.filters = {}          
        }  
        setPropsFilters({})
      }        
    }    
  },[certificateStore, props, propsFilters])  
    
  PrimeReact.locale = 'ru'
  const toast = useRef<Toast>(null)
  const dt = useRef<DataTable>(null) 
  useEffect(()=>{       
    if (certificateStore.needScroll 
      && certificateStore.operation.is(OperationType.FILTERING)
      && dt.current) {  
        //console.log('useEffect resetScroll', certificateStore.operation)     
        dt.current.resetScroll()
      }
  }, [ certificateStore.needScroll, certificateStore.operation])  

  const [selected, setSelected] = useState<ICertificate | undefined>()

  const initFilters = () => {
        setFilters({
        'basis_determining': { value: null, matchMode: FilterMatchMode.IN },  
        'custodian_id': { value: null, matchMode: FilterMatchMode.IN },            
        'number': { operator: 'and', constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]}, 
        'patient_fio': { operator: 'and', constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }]},
        'primory_reason' : { operator: 'and', constraints: [{ value: null, matchMode: FilterMatchMode.GREATER_THAN_OR_EQUAL_TO},{ value: null, matchMode: FilterMatchMode.LESS_THAN_OR_EQUAL_TO}]},
        'patient_birth_date' : { operator: 'and', constraints: [{ value: null, matchMode: FilterMatchMode.DATE_AFTER},{ value: null, matchMode: FilterMatchMode.DATE_BEFORE}]},
        'patient_death_date' : { operator: 'and', constraints: [{ value: null, matchMode: FilterMatchMode.DATE_AFTER},{ value: null, matchMode: FilterMatchMode.DATE_BEFORE}]},
        'issue_date': { operator: 'and', constraints: [{ value: null, matchMode: FilterMatchMode.DATE_AFTER},{ value: null, matchMode: FilterMatchMode.DATE_BEFORE}]},   
        'death_place': { value: null, matchMode: FilterMatchMode.IN },        
        })        
    }   
    useEffect(() => {            
        initFilters()        
    }, [])

  const orderNumberBodyTemplate = (rowData: ICertificate)=>{    
    return <i>{rowData.rowNumber}</i>
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
  const dbBodyTemplate = (rowData: ICertificate)=>{
    let _result =''
    const birth = rowData.patient?.birth_date
    if (!!birth) _result = `${birth.slice(8,10)}.${birth.slice(5,7)}.${birth.slice(0,4)}`  
    return _result
  }  
  const ddBodyTemplate = (rowData: ICertificate)=>{
    let _result =''    
    const death = !rowData.death_datetime ? !rowData.death_year ? false : rowData.death_year.toString() : rowData.death_datetime 
    if (death && death.length>4) {
       _result = `${death?.slice(8,10)}.${death.slice(5,7)}.${death.slice(0,4)}`
    } else if (death && death.length<5){
       _result =death       
    } 
    return _result
  }  
  const ageBodyTemplate = (rowData: ICertificate)=>{
    if (!rowData.death_datetime || !rowData.patient?.birth_date) return ''   
    const dd = new Date(rowData.death_datetime)
    const db = new Date(rowData.patient?.birth_date)
    let age = dd.getFullYear() - db.getFullYear()
    if (age === 0) return 0
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
  const custodianFilterTemplate = (options: any) => {
        return <MultiSelect value={options.value} options={organizations || []}  onChange={(e) => options.filterCallback(e.value)} optionLabel="name" placeholder="не выбрано" className="p-column-filter" />;
    }  
  const custodian = isSuperUser ? 
    <Column  header="Мед. организация" body={custodianBodyTemplate}          
        filterField='custodian_id' showFilterMatchModes={false}
                      filterClear={filterClearTemplate} filterApply={filterApplyTemplate}
                      filter filterElement={custodianFilterTemplate}                    
        style={{ flexGrow: 1, flexBasis: '120px' }}> </Column> :
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
        return rowData.id && (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={()=>userStore.history().push(`${CERTIFICATE_ROUTE}/${rowData.id}?q=0`)} />                
            </React.Fragment>
        )
    }
  const loadCertificatesLazy = (event: any) => {  
    //console.log('loadCertificatesLazy start count-',certificateStore.count, ' start-', event.first, ' last-',event.last,' operation-',certificateStore.operation.getType()  )  
    if (!(certificateStore.operation.is(OperationType.FILTERING) || certificateStore.operation.is(OperationType.SCROLLING))) certificateStore.operation = new Operation(OperationType.SCROLLING)    
    certificateStore.getList(()=>{ //console.log('loadCertificatesLazy finished, count-', certificateStore.count, ' start-', event.first,  ' last-',event.last,' operation-',certificateStore.operation.getType())      
      }, event.first, event.last)           
  }   
 
  const sortLazy = (e: DataTableSortParams) => { 
    if (certificateStore.count === 0) return        
    const order =  e.sortOrder ? DIRECTION[e.sortOrder===-1 ? 0 : 1] : DIRECTION[0]    
    if (e.sortField && e.sortOrder) {
      certificateStore.sorts = [`${e.sortField} ${order}`]
      certificateStore.sortField = e.sortField
      certificateStore.sortOrder = e.sortOrder
      certificateStore.operation = new Operation(OperationType.SORTING)
    } 
  }  
  const basisDeterminingFilterTemplate = (options: any) => {
        return <MultiSelect value={options.value} options={BASIS_DERMINING}  onChange={(e) => options.filterCallback(e.value)} optionLabel="name" placeholder="не выбрано" className="p-column-filter" />;
    }
  const deathPlaceFilterTemplate = (options: any) => {
        return <MultiSelect value={options.value} options={DEAD_PLACE_TYPES}  onChange={(e) => options.filterCallback(e.value)} optionLabel="name" placeholder="не выбрано" className="p-column-filter" />;
    }   
    
  const fioFilterTemplate = (options: any) => {
        return <InputText value={options.value || ''}  onChange={(e) => options.filterCallback(e.target.value)}  placeholder="строка поиска" className="p-column-filter" />
    }  
  
  const footer = `Всего ${ certificateStore.count } свидетельств(а).`  
  
  const layoutParams = {
        title: 'СПИСОК СВИДЕТЕЛЬСТВ',     
        url: LIST_ROUTE,
        content:
        <>
          <Toast ref={toast} />
          <div id='tableDiv' className='p-card' >             
            <DataTable ref={dt} value={certificateStore.allCerts}  responsiveLayout="scroll" scrollDirection="both"
                emptyMessage="нет данных, удовлетворяющих запросу" scrollable scrollHeight="72vh" 
                selectionMode="single" selection={selected}  dataKey="id" size="small"
                footer={footer} loading={certificateStore.isLoading} lazy
                onSelectionChange={e =>{
                  if ( e.value.id ) {
                    certificateStore.select(certificateStore.certs.findIndex(el=>el.id === e.value.id))
                    setSelected(e.value)
                  }
                }} filterDisplay="menu" 
                onFilter={e=>{
                  //console.log('e',e)
                  let _filters = {...propsFilters} as any                  
                  let _constraint: any = e.filters['issue_date'] 
                  if (_constraint && _constraint.constraints[0] && _constraint.constraints[0].value) 
                    _filters[`issue_date${RunsackFilterMatchMode[_constraint.constraints[0].matchMode  as DataTableFilterMatchModeType]}`]=_constraint.constraints[0].value                  
                  if (_constraint && _constraint.constraints[1] && _constraint.constraints[1].value) 
                    _filters[`issue_date${RunsackFilterMatchMode[_constraint.constraints[1].matchMode  as DataTableFilterMatchModeType]}`]=_constraint.constraints[1].value
                    _constraint = e.filters['primory_reason'] 
                  if (_constraint && _constraint.constraints[0] && _constraint.constraints[0].value) 
                    _filters[`reason_ACME${RunsackFilterMatchMode[_constraint.constraints[0].matchMode  as DataTableFilterMatchModeType]}`]=_constraint.constraints[0].value                  
                  if (_constraint && _constraint.constraints[1] && _constraint.constraints[1].value) 
                    _filters[`reason_ACME${RunsackFilterMatchMode[_constraint.constraints[1].matchMode  as DataTableFilterMatchModeType]}`]=_constraint.constraints[1].value  
                   _constraint = e.filters['patient_birth_date'] 
                  if (_constraint && _constraint.constraints[0] && _constraint.constraints[0].value) 
                    _filters[`patient_birth_date${RunsackFilterMatchMode[_constraint.constraints[0].matchMode  as DataTableFilterMatchModeType]}`]=_constraint.constraints[0].value                  
                  if (_constraint && _constraint.constraints[1] && _constraint.constraints[1].value) 
                    _filters[`patient_birth_date${RunsackFilterMatchMode[_constraint.constraints[1].matchMode  as DataTableFilterMatchModeType]}`]=_constraint.constraints[1].value  
                  _constraint = e.filters['patient_death_date'] 
                  if (_constraint && _constraint.constraints[0] && _constraint.constraints[0].value) 
                    _filters[`death_datetime${RunsackFilterMatchMode[_constraint.constraints[0].matchMode  as DataTableFilterMatchModeType]}`]=_constraint.constraints[0].value                  
                  if (_constraint && _constraint.constraints[1] && _constraint.constraints[1].value) 
                    _filters[`death_datetime${RunsackFilterMatchMode[_constraint.constraints[1].matchMode  as DataTableFilterMatchModeType]}`]=_constraint.constraints[1].value     
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
                  _constraint = e.filters['custodian_id']   
                  if (_constraint && _constraint.value) {
                    const values = _constraint.value as IReferenceId[]
                    let _codes = [] as number[]
                    values.map(item=> _codes.push(item.id)) 
                    _filters.custodian_id_in = _codes   
                  }               
                  certificateStore.filters = _filters 
                }}                
                virtualScrollerOptions={{ lazy: true,  onLazyLoad: loadCertificatesLazy,  numToleratedItems:5, itemSize: 180, delay: 100,showLoader: false,  loading: certificateStore.isLoading}} filters={filters} filterLocale={'ru'} 
                onRowDoubleClick={()=>userStore.history().push(`${CERTIFICATE_ROUTE}/${certificateStore.cert.id}?q=0`)}
                onSort={sortLazy} sortField={certificateStore.sortField} sortOrder={certificateStore.sortOrder}
                >  
                    <Column header="№ п.п"  body={orderNumberBodyTemplate} 
                      sortField='rowNumber'
                      style={{ flexGrow: 1, flexBasis: '58px' }} frozen></Column>                                   
                    <Column header="Серия Номер Вид" body={seriesNumberBodyTemplate} filterField='number'
                      filter filterPlaceholder="Поиск по номеру" dataType='text' showFilterOperator ={false}                                           
                      filterClear={filterClearTemplate} filterApply={filterApplyTemplate} sortField='number' sortable style={{ flexGrow: 1, flexBasis: '110px' }} frozen></Column>
                    <Column header="Причины смерти и соп. патологии" showFilterOperator ={false}                     
                     filterField='primory_reason'  filterPlaceholder="код ПП" filter dataType='numeric'
                     filterClear={filterClearTemplate} filterApply={filterApplyTemplate}  
                      style={{ flexGrow: 1, flexBasis: '250px' }} body={reasonsBodyTemplate}></Column>
                    <Column  header="ФИО" body={fioBodyTemplate} 
                      sortField='patient_person_person_name_family'
                      dataType='text' showFilterOperator ={false}
                      filter filterField='patient_fio' filterClear={filterClearTemplate} filterApply={filterApplyTemplate}  filterElement={fioFilterTemplate}
                      sortable style={{ flexGrow: 1, flexBasis: '140px' }}></Column>                    
                    <Column  header="ДР" body={dbBodyTemplate} filter sortable
                       showFilterOperator={false} dataType='date' filterPlaceholder="дата рождения"
                     filterField='patient_birth_date' sortField='patient_birth_date' 
                     filterClear={filterClearTemplate} filterApply={filterApplyTemplate}  
                       style={{ flexGrow: 1, flexBasis: '110px' }}> </Column>
                    <Column  header="ДС" body={ddBodyTemplate} filter sortable
                       showFilterOperator={false} dataType='date' filterPlaceholder="дата смерти"
                     filterField='patient_death_date' sortField='death_datetime' 
                     filterClear={filterClearTemplate} filterApply={filterApplyTemplate}  
                       style={{ flexGrow: 1, flexBasis: '110px' }}> </Column>
                    <Column  header="Лет" body={ageBodyTemplate} 
                      style={{ flexGrow: 1, flexBasis: '46px' }}> </Column>
                    <Column  header="Пол" body={genderBodyTemplate} sortField='patient_gender'
                      sortable style={{ flexGrow: 1, flexBasis: '56px' }}> </Column>    
                    <Column  header="Адрес проживания" sortable sortField='patient_person_address_streetAddressLine'
                      field='patient.person.address.streetAddressLine'
                      style={{ flexGrow: 1, flexBasis: '200px' }}> </Column>  
                    <Column  header="Адрес смерти" sortable sortField='death_addr_streetAddressLine'
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