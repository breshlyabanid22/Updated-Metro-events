import React, { useState } from 'react'
// import './style.css'
import {Calendar, dateFnsLocalizer} from "react-big-calendar"
import format from "date-fns/format"
import parse from "date-fns/parse"
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import "react-big-calendar/lib/css/react-big-calendar.css";
import DatePicker from "react-datepicker";
import enUSLocale from 'date-fns/locale/en-US';
import "react-datepicker/dist/react-datepicker.css"
import axios from 'axios'

const locales = {
  "en-US": enUSLocale
}
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales
})

const events = [
  {
    title: "Big Meeting",
    allDay: true,
    start: new Date(2023, 10, 0),
    end: new Date(2023, 10, 0)
  },
  {
    title: "Vacation",
    start: new Date(2023, 10, 0),
    end: new Date(2023, 10, 0)
  },
  {
    title: "Conference",
    start: new Date(2023, 10, 0),
    end: new Date(2023, 10, 0)
  },
]

const Event_Calendar = () => {

  const [newEvent, setNewEvent] = useState({ title: "", start: "", end: ""})
  const [allEvents, setAllEvents] = useState(events)

  function handleAddEvent() {
    setAllEvents([...allEvents, newEvent])

    const formattedStartDate = newEvent.start.toISOString().split('T')[0];
    const formattedEndDate = newEvent.end.toISOString().split('T')[0];
    
   axios.post('http://localhost:8081/api/addEvent', {
      title: newEvent.title,
      start: formattedStartDate,
      end: formattedEndDate,
    })
    .then((response) => {
      // Handle success response from the server
      console.log(response.data);
    })
    .catch((error) => {
      // Handle error response from the server
      console.error('Error:', error);
    });
  }
  return (
    <>
      <div className='calendar-div'>
        <div className='calendar-header'>
            <h3>Events Calendar</h3>
            <h6>ADD NEW EVENT</h6>
        </div>
            <div className='textfield-container'>
              <input type="text" placeholder='Title' className='textfield-title'
              value={newEvent.title} onChange={(e) => setNewEvent({...newEvent, title: e.target.value})} required/>
              <DatePicker placeholderText='Start Date' className='textfield-startDate'
                selected={newEvent.start} onChange={(start) => setNewEvent({...newEvent, start})}/>
              <DatePicker placeholderText='End Date' className='textfield-endDate'
                selected={newEvent.end} onChange={(end) => setNewEvent({...newEvent, end})}/>
              <button className='btn-add-event' onClick={handleAddEvent}>ADD EVENT</button>
            </div>

          <div className='Calendar-content'>
            <Calendar localizer={localizer} events={allEvents}
            startAccessor="start" endAccessor="end" 
            />
          </div>
      </div>

    </>
    
  )
}

export default Event_Calendar;