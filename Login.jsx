import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Validation from './LoginValidation';
import axios from 'axios';
import './style.css';

const Login = () => {

    const [values, setValues] = useState({
        email: '',
        password: '' 
    })
    const [errors, setErrors] = useState({})
    const navigate = useNavigate();
    const handleInput = (event) => {
        setValues(prev => ({...prev, [event.target.name]: [event.target.value]}))
    }

        const handleSubmit = (event) => {
            event.preventDefault();
            setErrors(Validation(values));
            if(errors.email === "" && errors.password === ""){
                axios.post('http://localhost:8081/login', values)
                .then(res => {
                    console.log(res.data)
                    if(res.data.userType === "admin_access"){
                    navigate('/admin/user-details');   
                    }else if(res.data.userType === "user"){
                        navigate('/user');
                        
                    }else{
                        alert("Account does not exist!");
                    }
                })
                .catch(err => console.log(err));
            }
            
    }
  return (
    <div className='login-page-bg'>
        <div className='bg-white p-3 rounded w-25'>
            <h2>Sign-In</h2>
            <form action="" onSubmit={handleSubmit}>
                <div className='mb-3'>
                    <label htmlFor='email'><strong>Email</strong></label>
                    <input type="email" placeholder='Enter your email' name='email'
                    onChange={handleInput} className='form-control rounded-0'/>
                    {errors.email && <span className='text-danger'>{errors.email}</span>}
                </div>
                <div className='mb-3'>
                    <label htmlFor='password'><strong>Password</strong></label>
                    <input type="password" placeholder='Enter your password' name='password'
                    onChange={handleInput} className='form-control rounded-0'/>
                    {errors.password && <span className='text-danger'>{errors.password}</span>}
                </div>
                <button type='submit' className='btn btn-success w-100 rounded-0'><strong>Log in</strong></button>
                <p>You agree to our terms and policies</p>
                <Link to='/signup' className='btn btn-default border w-100 bg-light rounded-0 text-decoration-none'>Create Account</Link>
            </form>
        </div>
    </div>
  )
}

export default Login;


