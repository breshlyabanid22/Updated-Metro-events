import React, { useState } from 'react'
import './style.css'
import axios from 'axios';

const Event_booking = () => {

    const [formData, setFormData] = useState({
        fname: '',
        lname: '',
        event_name: '',
        venue: '',
        numOf_people: '',
        start_date: '',
        end_date:'',
        file: null,
    });

    const handleChange = (e) => {
        setFormData((prevFormData) => ({...prevFormData, [e.target.name]: e.target.value,}));
      };
      const handleFileChange = (e) => {
        const selectedFile = e.target.files && e.target.files.length > 0 ? e.target.files[0] : null;

        console.log('Selected File:', selectedFile);
        setFormData((prevData) => ({
          ...prevData,
          file: selectedFile,
        }));
      };
      
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form Data:', formData);

        try{
            const formDataToSend = new FormData();
            formDataToSend.append('fname', formData.fname);
            formDataToSend.append('lname', formData.lname);
            formDataToSend.append('event_name', formData.event_name);
            formDataToSend.append('venue', formData.venue);
            formDataToSend.append('numOf_people', formData.numOf_people);
            formDataToSend.append('start_date', formData.start_date);
            formDataToSend.append('end_date', formData.end_date);

            formDataToSend.append('file', formData.file);
            
            console.log('Form data to send: ', formDataToSend);

            await axios.post('http://localhost:8081/bookEvent', formDataToSend, {
                  headers: {
                      'Content-Type': 'multipart/form-data', // Set the correct content type
                    },
              });
              // Clear form data
                setFormData({
                  fname: '',
                  lname: '',
                  event_name: '',
                  venue: '',
                  numOf_people: '',
                  start_date: '',
                  end_date: '',
                  file: null,
              });
              console.log('Form Data:', formData);
              alert("Event booked Successfully!");

            }catch (error) {
              console.error('Error booking event:', error.message);
              alert('Error booking event. Please try again.');
            }
    };
  return (
    <>
    
    <div className='event-booking-div'>
    <h1>Event booking</h1>
            <div className="row d-flex justify-content-center">
              <div className="col-xl-7 col-lg-8 col-md-9 col-11 text-center">
               <h3>Book Events</h3>
                  <div className="card">
                      <form className="form-card" onSubmit={handleSubmit}>
                          <div className="row justify-content-between text-left">
                              <div className="form-group col-sm-6 flex-column d-flex">
                                <label className="form-control-label px-3">First name<span className="text-danger"> *</span></label>
                                <input type="text" id="fname" name="fname" value={formData.fname || ''} placeholder="Enter your first name"  onChange={handleChange}/> </div>
                              <div className="form-group col-sm-6 flex-column d-flex"> <label className="form-control-label px-3">Last name<span className="text-danger"> *</span></label>
                                <input type="text" id="lname" name="lname" value={formData.lname || ''} placeholder="Enter your last name"  onChange={handleChange}/> </div>
                          </div>
                          <div className="row justify-content-between text-left">
                              <div className="form-group col-12 flex-column d-flex">
                                <label className="form-control-label px-3">Event Name<span className="text-danger"> *</span></label>
                                <input type="text" id="event_name" name="event_name" value={formData.event_name || ''} placeholder=""  onChange={handleChange}/> 
                              </div>
                          </div>
                          <div className="row justify-content-between text-left">
                              <div className="form-group col-sm-6 flex-column d-flex"> 
                                <label className="form-control-label px-3">Venue<span className="text-danger"> *</span></label> 
                                <input type="text" id="venue" name="venue" value={formData.venue || ''} placeholder=""   onChange={handleChange}/>
                              </div>
                              <div className="form-group col-sm-6 flex-column d-flex"> 
                                <label className="form-control-label px-3">No. of People<span className="text-danger"> *</span></label> 
                                    <input type="number" id="numOf_people" name="numOf_people" value={formData.numOf_people || ''} placeholder="" onChange={handleChange}/> 
                                </div>
                          </div>
                          <div className="row justify-content-between text-left">
                              <div className="form-group col-sm-6 flex-column d-flex"> <label className="form-control-label px-3">Start Date<span className="text-danger"> *</span></label> <input type="date" id="start_date" name="start_date" value={formData.start_date || ''} placeholder="" onChange={handleChange}/> </div>
                              <div className="form-group col-sm-6 flex-column d-flex"> <label className="form-control-label px-3">End Date<span className="text-danger"> *</span></label> <input type="date" id="end_date" name="end_date" value={formData.end_date || ''} placeholder="" onChange={handleChange}/> </div> 
                          </div>
                          <div className="row justify-content-between text-left">
                              <div className="form-group col-12 flex-column d-flex"> <label className="form-control-label px-3">Upload Image<span className="text-danger"> *</span></label> 
                              <input 
                                type="file"
                                id="file"   
                                name="file"
                                onChange={handleFileChange} 
                                placeholder="No file chosen."
                                
                                />
                              </div>
                          </div>
                          <div className="row justify-content-end">
                              <div className="form-group col-sm-6"> <button type="submit" className="btn-block btn-primary">Book event</button> </div>
                          </div>
                      </form>
                  </div>
            </div>
          </div>
     </div>
    </>
  )
}

export default Event_booking;