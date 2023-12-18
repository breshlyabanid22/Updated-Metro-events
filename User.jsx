
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './event_post.css';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


function User() {

  const [bookedEvents, setBookedEvents] = useState([]);

  
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {

    axios.get('http://localhost:8081/getBookedEvents')
      .then((response) => {
        setBookedEvents(response.data);
        console.log(response.data);
      }).catch((error) => {
        console.error("Error fetching booked events", error.message);
      });
  }, []);

  const imagePath = (image) => {
    let uploadPath = 'http://localhost:8081/uploads/';
    return `${uploadPath}${image}`;
  }
  function formatDateString(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${month}-${day}-${year}`;
  }
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
                  'Content-Type': 'multipart/form-data', 
                },
          });
          
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
          handleClose();
        }catch (error) {
          console.error('Error booking event:', error.message);
          alert('Error booking event. Please try again.');
        }
    };      

  return (
    <>
      
    <div>
      <div className="navbar navbar-dark bg-dark shadow-sm">
        <div className="container d-flex justify-content-between">
          
          <a href="user" className="navbar-brand d-flex align-items-center">
            <img className='brand-logo' src="/public/brand-logo2.png"/>
            <strong>EventSphere</strong>
          </a>
          <Link to="/login"><h6 className='logout'>Log out</h6></Link>
        </div>
      </div>
    </div>
    <main role="main">

      <section className="jumbotron text-center">
        <div className="container">
          <h1 className="jumbotron-heading">Join Exciting Events Today!</h1>
          <p className="lead">Beyond Celebrations: Trust Our Professional Event Planning Services for Every Special Occasion</p>
          <p>
            <Button className="btn btn-primary my-2" variant="primary" onClick={handleShow}>Organize an event</Button>
            <a href="#event-list" className="btn btn-secondary my-2">Join an event</a>
          </p>
        </div>
      </section>

      <div className="album py-5 bg-light" id='event-list'>
        <div className="container">

          <div className="row">
            {bookedEvents.map((event) => (
              <div className="col-md-4" key={event.id}>
              <div className="card mb-4 shadow-sm">
                <img className="card-img-top" src={imagePath(event.image_path)} alt="event-image"/>
                <div className="card-body">
                  <h5 className="card-text">{event.event_name}</h5>
                  <p className="card-text text-muted">
                    <img src='/public/venue-icon2.png'/>
                    {event.venue}</p>
                  <p className="card-text text-muted">
                    <img src='/public/people-icon2.png'/>
                     {event.numOf_people} people</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="btn-group">
                      <button type="button" className="btn btn-sm btn-outline-primary">Join</button>
                      <button type="button" className="btn btn-sm btn-outline-secondary">View</button>
                    </div>
                    <small className="text-muted">
                      <img src='/public/date-icon.png'/>
                      {formatDateString(event.start_date)}
                    </small>
                  </div>
                </div>
              </div>
            </div>

            ))}
          </div>
        </div>
      </div>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Book an event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className='mb-3'>
              <Row>
                <Col>
                  <Form.Label>First name</Form.Label>
                  <Form.Control type="text" name='fname' value={formData.fname || ''} placeholder="Enter first name" onChange={handleChange}/>
                </Col>
                <Col>
                  <Form.Label>Last name</Form.Label>
                  <Form.Control type="text" name='lname' value={formData.lname || ''} placeholder="Enter last name" onChange={handleChange}/>
                </Col>
              </Row>
            </Form.Group> 
            <Form.Group className="mb-3">
              <Form.Label>Event name</Form.Label>
              <Form.Control type="text" name='event_name' value={formData.event_name || ''} placeholder="Enter the name of the event" onChange={handleChange}/>
            </Form.Group>
            <Form.Group className='mb-3'>
            <Row>
              <Col>
                <Form.Label>Venue</Form.Label>
                <Form.Control type="text" name='venue' value={formData.venue || ''} placeholder="-venue location-" onChange={handleChange}/>
              </Col>
              <Col>
                <Form.Label>No. of people</Form.Label>
                <Form.Control type="number" name='numOf_people' value={formData.numOf_people || ''} placeholder="-maximum participants-" onChange={handleChange}/>
              </Col>
            </Row>   
            </Form.Group> 
            <Form.Group className='mb-3'>
              <Row>
                <Col>
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control type="date" name='start_date' value={formData.start_date || ''} onChange={handleChange}/>
                </Col>
                <Col>
                  <Form.Label>End date</Form.Label>
                  <Form.Control type="date" name='end_date' value={formData.end_date || ''} onChange={handleChange}/>
                </Col>
              </Row>
            </Form.Group>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Upload an image</Form.Label>
              <Form.Control type="file" name='file' onChange={handleFileChange}/>
            </Form.Group>
            <Modal.Footer
              style={{
                display: "flex",
                justifyContent: "center",
                fontSize: "14px",
                color: "blue",
              }}
            >
            You will receive a notification if your request has been approved.
            </Modal.Footer>
            <Modal.Footer>
              <Button variant="primary" type='submit'>Submit Request</Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>   
      </Modal>
      
    </main>
    <footer className="py-3 my-4">
      <ul className="nav justify-content-center border-bottom pb-3 mb-3">
        <li className="nav-item"><a href="#" className="nav-link px-2">Home</a></li>
        <li className="nav-item"><a href="#" className="nav-link px-2 ">Features</a></li>
        <li className="nav-item"><a href="#" className="nav-link px-2 ">Pricing</a></li>
        <li className="nav-item"><a href="#" className="nav-link px-2 ">FAQs</a></li>
        <li className="nav-item"><a href="#" className="nav-link px-2 ">About</a></li>
      </ul>
      <p className="text-center">&copy; 2023 EventSphere, Inc</p>
    </footer>
    </>
  )
}

export default User;
