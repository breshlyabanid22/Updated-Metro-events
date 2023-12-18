import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom';  // Assuming you are using react-router-dom for navigation

function Reg() {
  const [bookedEvents, setBookedEvents] = useState([]);
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    contact_no: '',
    file: null,
  });

  useEffect(() => {
    axios
      .get('http://localhost:8081/getBookedEvents')
      .then((response) => {
        setBookedEvents(response.data);
      })
      .catch((error) => {
        console.error('Error fetching booked events', error.message);
      });
  }, []);

  const imagePath = (image) => {
    let uploadPath = 'http://localhost:8081/uploads/';
    return `${uploadPath}${image}`;
  };

  const formatDateString = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${month}-${day}-${year}`;
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleChange = (e) => {
    setFormData((prevFormData) => ({ ...prevFormData, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files && e.target.files.length > 0 ? e.target.files[0] : null;

    setFormData((prevData) => ({
      ...prevData,
      file: selectedFile,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('fname', formData.fname);
      formDataToSend.append('lname', formData.lname);
      formDataToSend.append('event_name', formData.event_name);
      formDataToSend.append('venue', formData.venue);
      formDataToSend.append('numOf_people', formData.numOf_people);
      formDataToSend.append('start_date', formData.start_date);
      formDataToSend.append('end_date', formData.end_date);
      formDataToSend.append('file', formData.file);

      await axios.post('http://localhost:8081/bookEvent', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setFormData({
        name: '',
        lastname: '',
        contact_no: '',
        file: null,
      });

      alert('Event booked Successfully!');
      handleClose();
    } catch (error) {
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

      <section className="jumbotron text-center">
        <div className="container">
          <h1 className="jumbotron-heading">Join Exciting Events Today!</h1>
          <p className="lead">Beyond Celebrations: Trust Our Professional Event Planning Services for Every Special Occasion</p>
        </div>
      </section>

      <div className="album py-5 bg-light" id="event-list">
        <div className="container">
          <div className="row">
            {bookedEvents.map((event) => (
              <div className="col-md-4" key={event.id}>
                <div className="card mb-4 shadow-sm">
                  <img className="card-img-top" src={imagePath(event.image_path)} alt="event-image" />
                  <div className="card-body">
                    <h5 className="card-text">{event.event_name}</h5>
                    <p className="card-text text-muted">
                      <img src="/public/venue-icon2.png" />
                      {event.venue}
                    </p>
                    <p className="card-text text-muted">
                      <img src="/public/people-icon2.png" />
                      {event.numOf_people} people
                    </p>
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="btn-group">
                        {/* Update the onClick handler to trigger handleShow */}
                        <button type="button" className="btn btn-sm btn-outline-primary" onClick={handleShow}>
                          Join
                        </button>
                        <button type="button" className="btn btn-sm btn-outline-secondary">
                          View
                        </button>
                      </div>
                      <small className="text-muted">
                        <img src="/public/date-icon.png" />
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

      // ... (previous imports and component code)

<Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
  <Modal.Header closeButton>
    <Modal.Title>Join an Event</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form onSubmit={handleSubmit}>
      <Form.Group as={Row} controlId="formFirstName">
        <Form.Label column sm="4">
          First Name
        </Form.Label>
        <Col sm="8">
          <Form.Control
            type="text"
            placeholder="Enter First Name"
            name="fname"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Col>
      </Form.Group>

      <Form.Group as={Row} controlId="formLastName">
        <Form.Label column sm="4">
          Last Name
        </Form.Label>
        <Col sm="8">
          <Form.Control
            type="text"
            placeholder="Enter Last Name"
            name="lname"
            value={formData.lastname}
            onChange={handleChange}
            required
          />
        </Col>
      </Form.Group>

      <Form.Group as={Row} controlId="formContact">
        <Form.Label column sm="4">
          Contact No
        </Form.Label>
        <Col sm="8">
          <Form.Control
            type="text"
            placeholder="Enter Contact Information"
            name="contact"
            value={formData.contact_no}
            onChange={handleChange}
            required
          />
        </Col>
      </Form.Group>

      {/* Add other necessary fields as needed */}

      <div className="text-center">
        <Button variant="primary" type="submit">
          Submit Request
        </Button>
      </div>
    </Form>
  </Modal.Body>
</Modal>

</>
  );
}

export default Reg;