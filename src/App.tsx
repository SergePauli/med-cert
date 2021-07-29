import React, {FC} from 'react'
import { BrowserRouter } from 'react-router-dom'
import AppRouter  from './components/AppRouter'
import './styles/root.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'


const App: FC =() => {   
  return (
    <BrowserRouter>
      <AppRouter/>
    </BrowserRouter>  
  )  
}

export default App
