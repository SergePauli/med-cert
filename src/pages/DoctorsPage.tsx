
import React, { useState, useEffect, useRef, useContext, FC } from 'react'
import { classNames } from 'primereact/utils'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Toast } from 'primereact/toast'
import { Button } from 'primereact/button'
import { Toolbar } from 'primereact/toolbar'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { v4 as uuidv4 } from "uuid"
import { Context } from '..'
import { IDoctor } from '../models/IDoctor'
import DoctorService from "../services/DoctorService"
import '../styles/components/Toolbar.css'
import '../styles/components/Dialog.css'
import { InputMask } from 'primereact/inputmask'
import MainLayout from '../components/layouts/MainLayout'
import { observer } from 'mobx-react-lite'
import { DOCTORS_ROUTE } from '../utils/consts'
import { IContact } from '../models/IContact'
import { IReferenceId } from '../models/IReference'
import { AutoComplete } from 'primereact/autocomplete'
import AddressFC from '../components/inputs/AddressFC'
import { CheckboxChangeParams } from 'primereact/checkbox'
import { INullFlavor } from '../models/INullFlavor'
import { HOME_REGION_CODE, NA } from '../utils/defaults'
import Address from '../models/FormsData/Address'
import { IPerson } from '../models/IPerson'

export const DoctorsPage: FC = () => {    
    const {addressStore, userStore} = useContext(Context)
    let emptyDoctor = {
        organization: userStore.userInfo?.organization,
        guid: uuidv4(),       
        person: { person_name: {family:'Тестов', given_1:'Тест'}, 
          contacts:[{telcom_value:"tel:+79145782405", main: true }] as IContact[],
          SNILS: '456-145-154 25'
          } as IPerson,  
        nullFlavors:[],
    } as IDoctor
    const ADDRESS_FIELD_NAME = 'addr'
    const [doctors, setDoctors] = useState<IDoctor[]>([])
    const [doctorDialog, setDoctorDialog] = useState(false)
    const [deleteDoctorDialog, setDeleteDoctorDialog] = useState(false)
    const [deleteDoctorsDialog, setDeleteDoctorsDialog] = useState(false)
    const [doctor, setDoctor] = useState(emptyDoctor)
    const [selectedDoctors, setSelectedDoctors] = useState<IDoctor[]>([])
    const [submitted, setSubmitted] = useState(false)   
    const [email, setEmail] = useState('') 
    const [phone, setPhone] = useState('')
    const [position, setPosition] = useState('')
    const [positions, setPositions] = useState<IReferenceId[]>([])
    const toast = useRef(null)
    const dt = useRef(null)
     

    useEffect(() => {      
      if (userStore && userStore.userInfo) 
      DoctorService.getDoctors({       
        q:{organization_id_eq: userStore.userInfo.organization.id}        
      })
      .then(data => {        
        setDoctors(data.data)
      })
      .catch(()=>setDoctors([]))
    }, [userStore.userInfo]) // eslint-disable-line react-hooks/exhaustive-deps

    const  getPositions = (event: { query: string })=>{
        const option = {} as any
        if (event.query.trim().length>0) option.name_cont = event.query.trim()      
        DoctorService.getPositions(option).then(response=>{
            if (response.data.length>0) setPositions(response.data)
            else setPositions([])        
        }).catch((reason)=>console.log(reason))    
    }

    const openNew = () => {
        setDoctor(emptyDoctor)
        addressStore.address = new Address({ state: HOME_REGION_CODE, 
            streetAddressLine: "", nullFlavors: [] })
        setSubmitted(false)
        setDoctorDialog(true)
        setEmail('')
        setPhone('')
        setPosition('')
    }

    const hideDialog = () => {
        setSubmitted(false);
        setDoctorDialog(false);
    }

    const hideDeleteDoctorDialog = () => {
        setDeleteDoctorDialog(false)
    }

    const hideDeleteDoctorsDialog = () => {
        setDeleteDoctorsDialog(false)
    }

    const saveDoctor = () => {
        setSubmitted(true)
        if (doctor.person?.person_name?.family.trim() && doctor.person?.SNILS) {
            let _doctors = [...doctors]
            let _doctor = {...doctor}
            _doctor.person.address = addressStore.addressProps()
            
            if (doctor.id) { 
              DoctorService.updateDoctor(_doctor).then((response)=>{
                const index = findIndexById(doctor.id)
                _doctors[index] = response.data
                setDoctorDialog(false)
                setDoctors(_doctors)
              })
              
              //if (toast.current) toast.current.show({ severity: 'success', summary: 'Успешно', detail: 'Запись обновлена', life: 3000 })
            } else {               
              DoctorService.addDoctor(_doctor).then((response)=>{
                if (response.data) {                  
                  _doctors.push(response.data)
                  setDoctors(_doctors)
                  setDoctorDialog(false)
                  setDoctor(emptyDoctor)          
                  setEmail('')
                  setPhone('')
                  setPosition('')
                }  
              })           
              
              //toast.current.show({ severity: 'success', summary: 'Успешно', detail: 'Запись добавлена', life: 3000 })
            }
          
        }
    }

    const editDoctor = (_doctor: IDoctor) => {
        setPhone('')
        setEmail('')        
        _doctor.person?.contacts?.forEach((item)=>{if (item.main) setPhone(item.telcom_value)
        else setEmail(item.telcom_value.replace('mailto:',''))})
        if (_doctor.person?.address) addressStore.address = new Address(_doctor.person?.address) 
        else  addressStore.address = new Address({ state: HOME_REGION_CODE, streetAddressLine: "", nullFlavors: [] })
        setPosition(_doctor.position?.name || '')       
        setDoctor({..._doctor})
        setDoctorDialog(true)
    }

    const confirmDeleteDoctor = (_doctor: IDoctor) => {
        setDoctor(_doctor)
        setDeleteDoctorDialog(true);
    }

    const deleteDoctor = () => {
        if (doctor.id) DoctorService.removeDoctor(doctor.id).then(response=>{
          let _doctors = doctors.filter(val => val.id !== doctor.id)
          setDoctors(_doctors)
          setDeleteDoctorDialog(false)
          setDoctor(emptyDoctor)
          //toast.current.show({ severity: 'success', summary: 'Успешно', detail: 'Запись удалена', life: 3000 })
        }).catch(reason=>console.log('reason',reason))        
    }
    const findIndexById = (id:number | undefined) => {        
        return doctors.findIndex((element)=>element.id === id)
    }    

    const confirmDeleteSelected = () => {
        setDeleteDoctorsDialog(true);
    }

    const deleteSelectedDoctors = () => {
        let _doctors = doctors.filter(val => !selectedDoctors.includes(val))
        setDoctors(_doctors);
        setDeleteDoctorsDialog(false);
        setSelectedDoctors([]);
        //toast.current.show({ severity: 'success', summary: 'Удачно', detail: 'Записи удалены', life: 3000 });
    }   

    const onInputChange = () => {      
      let _doctor = {...doctor}          
      setDoctor(_doctor)
    }   

    // Обработчик изменения одного из контактов
    // Параметр isMain признак изменяемого контакта        
    // value - новое значение контакта  
    const onContactChange = (isMain: boolean, value: string) => {            
      let _doctor = {...doctor}  
      if (_doctor.person) _doctor.person.contacts = []
      //Пока считаем, что достаточно обрабатывать только два контакта (смартфон и email)       
      //В случае необходимости использовать >2 типов - заменить if на switch 
      if (isMain) { // сменился номер телефона
        if (value.trim())  _doctor.person?.contacts?.push({telcom_value:value.trim(), main: true}) 
        _doctor.person?.contacts?.push({telcom_value:"mailto:"+email.trim(), main: false})
      } else { // сменилася email
        if (value.trim()) _doctor.person?.contacts?.push({telcom_value:"mailto:"+value.trim(), main: false})
        _doctor.person?.contacts?.push({telcom_value:phone, main: true})
      }          
      setDoctor(_doctor)
    } 

    const isAddressChecked = ()=>doctor.person.address!==undefined 
    //|| doctor.nullFlavors?.findIndex((item)=>item.parent_attr===ADDRESS_FIELD_NAME) ===-1
    
    

    const rightToolbarTemplate = () => {
      return (
        <React.Fragment>                
          <Button  icon="pi pi-plus" label="ДОБАВИТЬ" className="p-button-success p-mr-2" onClick={openNew} />
          <Button  icon="pi pi-trash" label="УДАЛИТЬ" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedDoctors || !selectedDoctors.length} />
        </React.Fragment>
      )
    }

    const actionBodyTemplate = (rowData: IDoctor) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => editDoctor(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteDoctor(rowData)} />
            </React.Fragment>
        )
    }
    
    const doctorDialogFooter = (
        <React.Fragment>
            <Button label="ОТМЕНА" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="ВНЕСТИ" icon="pi pi-check" className="p-button-text p-button-success" onClick={saveDoctor} />
        </React.Fragment>
    )
    const deleteDoctorDialogFooter = (
        <React.Fragment>
            <Button label="НЕТ" icon="pi pi-times" className="p-button-text" onClick={hideDeleteDoctorDialog} />
            <Button label="ДА" icon="pi pi-check" className="p-button-text p-button-warning" onClick={deleteDoctor} />
        </React.Fragment>
    )
    const deleteDoctorsDialogFooter = (
        <React.Fragment>
            <Button label="НЕТ" icon="pi pi-times" className="p-button-text" onClick={hideDeleteDoctorsDialog} />
            <Button label="ДА" icon="pi pi-check" className="p-button-text p-button-warning" onClick={deleteSelectedDoctors} />
        </React.Fragment>
    )
    const fioBodyTemplate = (doctor: IDoctor)=>{
      if (doctor.person===undefined || doctor.person.person_name===undefined) return ""
      const result = `${doctor.person.person_name.family} ${doctor.person.person_name.given_1} ${doctor.person.person_name.given_2 ? doctor.person.person_name.given_2 : ''}`.trim()
      return <>{result}</>
    }  
    const layoutParams = {
        title: 'Врачи',     
        url: DOCTORS_ROUTE,
        content:
        <div className="datatable-crud">
            <Toast ref={toast} />

            <div className="card">
                <Toolbar className="p-mb-4" right={rightToolbarTemplate}></Toolbar>

                <DataTable ref={dt} value={doctors} selection={selectedDoctors} onSelectionChange={(e) => setSelectedDoctors(e.value)} responsiveLayout="scroll"
                    dataKey="id" >
                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} exportable={false}></Column>                    
                    <Column  header="ФИО" body={fioBodyTemplate}  style={{ minWidth: '10rem' }}></Column>
                    <Column field="position.name" header="Должность" ></Column>
                    <Column field="person.SNILS" header="СНИЛС" ></Column>                    
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={doctorDialog} style={{ width: '800px' }} header="Данные врача" modal className="p-fluid" footer={doctorDialogFooter} onHide={hideDialog}>   
               <div className='p-grid'> 
                <div className="p-field p-col-12 p-md-3">
                    <label htmlFor="family">Фамилия</label>
                    <InputText id="family" value={doctor.person?.person_name?.family} onChange={(e) =>{
                         if (doctor.person?.person_name) doctor.person.person_name.family = e.target.value     
                         onInputChange()}} required autoFocus className={classNames({ 'p-invalid': submitted && !doctor.person?.person_name.family})} />
                    {submitted && !doctor.person?.person_name.family && <small className="p-error">Фамилия обязательна.</small>}
                </div>
                <div className="p-field  p-col-12 p-md-2">
                    <label htmlFor="given_1">Имя</label>
                    <InputText id="given_1" value={doctor.person?.person_name?.given_1} onChange={(e) =>{
                         if (doctor.person?.person_name) doctor.person.person_name.given_1 = e.target.value   
                         onInputChange()}} required  className={classNames({ 'p-invalid': submitted && !doctor.person?.person_name?.given_1})} />
                    {submitted && !doctor.person?.person_name?.given_1 && <small className="p-error">Имя обязательно.</small>}
                </div>
                <div className="p-field  p-col-12 p-md-4">
                    <label htmlFor="given_2">Отчество</label>
                    <InputText id="given_2" value={doctor.person?.person_name?.given_2 || ''} onChange={(e) =>{
                         if (doctor.person?.person_name) doctor.person.person_name.given_2 = e.target.value   
                         onInputChange()}}   />                    
                </div>
                <div className="p-field  p-col-12 p-md-3">
                    <label htmlFor="snils">СНИЛС</label>
                    <InputMask id="snils"  
                      type="text" mask="999-999-999 99"
                      value={doctor.person.SNILS} 
                      onChange={(e)=>{ 
                        doctor.person.SNILS = e.target.value  
                        onInputChange()}} 
                      required className={classNames({ 'p-invalid': submitted && !doctor.person?.SNILS})}
                    />
                    {submitted && !doctor.person?.SNILS && <small className="p-error">СНИЛС некорректен.</small>}
                </div>
                <div className="p-field  p-col-12 p-md-4">
                    <label htmlFor="position">Должность</label>
                    <AutoComplete id="position" suggestions={positions} field="name"
                      value={doctor.position || {name: position} } delay={500} dropdown 
                      completeMethod={getPositions}
                      onChange={(e)=>{ 
                        if (e.value.name) { doctor.position = e.value
                           setPosition(e.value.name) 
                        } else setPosition(e.value)   
                        onInputChange()}}  
                        className={classNames({ 'p-invalid': submitted && !doctor.position})}
                    />
                    {submitted && !doctor.position && <small className="p-error">Должность должна быть указана.</small>}
                </div>
                <div className="p-field  p-col-12 p-md-4">
                    <label htmlFor="phone">телефон</label>
                    <InputMask id="phone"  
                      type="text" mask="tel:+79999999999"
                      value={phone} 
                      onChange={(e)=>{setPhone(e.target.value)  
                        onContactChange(true, e.target.value)}} required className={classNames({ 'p-invalid': submitted && !/tel:\+?[-0-9().]+/i.test(phone)})}
                    />
                    {submitted && !/tel:\+?[-0-9().]+/i.test(phone) && <small className="p-error">тел.номер некорректен!</small>}
                </div>
                <div className="p-field  p-col-12 p-md-4">
                    <label htmlFor="email">email</label>
                    <InputText id="email" type="text" 
                      value={email} 
                      onChange={(e)=>{  
                        setEmail(e.target.value)  
                        onContactChange(false, e.target.value)}} className={classNames({ 'p-invalid': submitted && !(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email) || email==='')})}
                    />
                    {submitted && !(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email) || email==='') && <small className="p-error">Неверный email</small>}
                </div>
                <div className='p-field  p-d-flex p-flex-wrap p-jc-start' style={{marginLeft:'0.5rem'}}>
                    <AddressFC checked={isAddressChecked()} label={'Адрес врача'} 
                        setCheck={(e: CheckboxChangeParams, nullFlavors?: INullFlavor[])=>{
                          if (e.checked) {
                            addressStore.address = new Address({ state: HOME_REGION_CODE, streetAddressLine: "", nullFlavors: [] })                 
                            doctor.nullFlavors = [] 
                            if (doctor.person) doctor.person.address = undefined                        
                          } else {
                            if (doctor.person) doctor.person.address = undefined  
                            doctor.nullFlavors = nullFlavors                            
                          } 
                          onInputChange()     
                        }}                                              
                        nullFlavors={doctor.nullFlavors}
                        field_name={ADDRESS_FIELD_NAME}
                        nfValue={NA}
                    /> 
                </div>    
               </div> 
            </Dialog>

            <Dialog visible={deleteDoctorDialog} style={{ width: '450px' }} header="Подтвердите" modal footer={deleteDoctorDialogFooter} onHide={hideDeleteDoctorDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem'}} />
                    {doctor && <span>Вы действительно хотите удалить <b>{fioBodyTemplate(doctor)}</b>?</span>}
                </div>
            </Dialog>

            <Dialog visible={deleteDoctorsDialog} style={{ width: '450px' }} header="Подтвердите" modal footer={deleteDoctorsDialogFooter} onHide={hideDeleteDoctorsDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem'}} />
                    {doctor && <span>Вы действительно хотите удалить выбранные записи?</span>}
                </div>
            </Dialog>
        </div>
    }
    return (
    <>
      <MainLayout {...layoutParams} />
    </>
  )
}
export default observer(DoctorsPage)                