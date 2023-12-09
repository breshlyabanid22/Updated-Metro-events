
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './Login.jsx'
import Signup from './Signup.jsx'
import User from './User.jsx'
import Admin from './Admin.jsx'
import Booking from './Event_booking.jsx'
import Calendar from './Event_Calendar.jsx'
import User_Details from './User_Details.jsx'
import './index.css'

function App() {

  return (
    <>
      <div className='page-background'>
        <BrowserRouter>
          <Routes>  
          <Route path='/' element={<Login />}/>
            <Route path='/Login' element={<Login />}/>
            <Route path='/signup' element={<Signup />}/>
            <Route path='/user' element={<User />}/>
            <Route path='admin' element={<Admin/>}>
              <Route path='events-calendar' element={<Calendar/>}/>
              <Route path='events-booking' element={<Booking/>}/>
              <Route path='user-details' element={<User_Details/>}/>
            </Route>
          </Routes>
          
        </BrowserRouter>
      </div>
      
    </>
  )
}

export default App;
