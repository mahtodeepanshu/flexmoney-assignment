import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { register } from '../actions/userActions'

const RegisterScreen = () => {
	const [name, setName] = useState('')
    const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [currSlot, setCurrSlot] = useState('')
	const [dateOfBirth, setDateOfBirth] = useState()
	const [confirmPassword, setConfirmPassword] = useState('')
	const [message, setMessage] = useState(null)

	const dispatch = useDispatch()
	const navigate = useNavigate()

	const userRegister = useSelector(state => state.userRegister)
    const {loading, error, userInfo} = userRegister

	const { search } = useLocation();
	const sp = new URLSearchParams(search);
	const redirect = sp.get('redirect') || '/';

	useEffect(() => {
        if(userInfo){
            navigate(redirect)
        }

    }, [navigate, redirect, userInfo])

	const submitHandler = (e) => {
        e.preventDefault()
        if(password !== confirmPassword){
			setMessage('Passwords do not match')
		}
		else{
			dispatch(register(
				name, 
				email, 
				dateOfBirth,
				password,
				currSlot
			))
		}
    }


	return (
		<FormContainer>
		<h2>Register</h2>
		{message && <Message variant='danger'>{message}</Message>}
		{error && <Message variant='danger'>{error}</Message>}
		{loading && <Loader/>}
		<Form onSubmit={submitHandler}>
			<Form.Group className='my-2' controlId='name'>
				<Form.Label>Name</Form.Label>
				<Form.Control
					type='name'
					placeholder='Enter name'
					value={name}
					onChange={(e) => setName(e.target.value)}
				></Form.Control>
			</Form.Group>

			<Form.Group className='my-2' controlId='email'>
				<Form.Label>Email Address</Form.Label>
				<Form.Control
					type='email'
					placeholder='Enter email'
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				></Form.Control>
			</Form.Group>

			<Form.Group  className='my-2' controlId='currSlot'>
				<Form.Label>Pick this Month's Slot</Form.Label>
				<Form.Control 
					as='select'
					className='form-select'
					value={currSlot}
					required 
					onChange={(e) => setCurrSlot(e.target.value)}>
						<option key={'Select your slot from dropdown'} value={'Select your slot'}>{'Select your slot'}</option>
						<option key={'6-7AM'} value={'6-7AM'}>{'6-7AM'}</option>
						<option key={'7-8AM'} value={'7-8AM'}>{'7-8AM'}</option>
						<option key={'8-9AM'} value={'8-9AM'}>{'8-9AM'}</option>
						<option key={'5-6PM'} value={'5-6PM'}>{'5-6PM'}</option>
				</Form.Control>
			</Form.Group>

			<Form.Group className='my-2' controlId='dateOfBirth'>
				<Form.Label>Date Of Birth</Form.Label>
				<Form.Control
					type='date'
					placeholder='Enter date'
					value={dateOfBirth}
					onChange={(e) => setDateOfBirth(e.target.value)}
				></Form.Control>
			</Form.Group>

			<Form.Group className='my-2' controlId='password'>
				<Form.Label>Password</Form.Label>
				<Form.Control
					type='password'
					placeholder='Enter password'
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				></Form.Control>
			</Form.Group>

			<Form.Group className='my-2' controlId='confirmPassword'>
				<Form.Label>Confirm Password</Form.Label>
				<Form.Control
					type='password'
					placeholder='Confirm password'
					value={confirmPassword}
					onChange={(e) => setConfirmPassword(e.target.value)}
				></Form.Control>
			</Form.Group>
			<p> </p>
			<Button type='submit' variant='primary'>
				Submit
			</Button>
		</Form>

		<Row className='py-3'>
			<Col>
			Already have an account?{' '}
			<Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>
				Log In
			</Link>
			</Col>
		</Row>
		</FormContainer>
	)
}

export default RegisterScreen
