import React, { useEffect, useState } from 'react'
import FormContainer from '../components/FormContainer'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Button, Col, Form, InputGroup, ListGroup, Row } from 'react-bootstrap'
import Loader from '../components/Loader'
import Message from '../components/Message'
import {update} from '../actions/userActions'

const HomeScreen = () => {
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [dateOfBirth, setDateOfBirth] = useState('')
	const [currSlot, setCurrSlot] = useState('')
	const [nextSlot, setNextSlot] = useState('')
	const [paymentStatus, setPaymentStatus] = useState(false)

	const dispatch = useDispatch() 
	const navigate = useNavigate()

	const userLogin = useSelector(state => state.userLogin)
    const {loading, error, userInfo} = userLogin

	const redirect = '/login'

	useEffect(() => {
        if (!userInfo) {
            navigate(redirect)
        } else {
			setName(userInfo.name)
			setEmail(userInfo.email)
			setDateOfBirth(userInfo.dateOfBirth)
			setCurrSlot(userInfo.currSlot)
			setNextSlot(userInfo.nextSlot)
			setPaymentStatus(userInfo.paymentStatus)
		}

    }, [navigate, redirect, userInfo])

	const nextSlotHandler = () => {
		dispatch(update(nextSlot, paymentStatus))
	}

	const paymentHandler = () => {
		dispatch(update(nextSlot, true))
	}

	const formatDate = (dateString) => {
		const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
		const formattedDate = new Date(dateString).toLocaleDateString(undefined, options);
		return formattedDate;
	}

    return (
		<FormContainer>
			<h3>User Profile</h3>
			{loading && <Loader />}
			{error && <Message>{error}</Message>}
			<ListGroup>
				<ListGroup.Item>
					<Row>	
						<Col>
							<b>Name:</b>
						</Col>
						<Col>
							{name}
						</Col>
					</Row>
				</ListGroup.Item>
				<ListGroup.Item>
					<Row>	
						<Col>
							<b>Email:</b>
						</Col>
						<Col>
							{email}
						</Col>
					</Row>
				</ListGroup.Item>
				<ListGroup.Item>
					<Row>	
						<Col>
							<b>Date of Birth:</b>
						</Col>
						<Col>
							{formatDate(dateOfBirth)}
						</Col>
					</Row>
				</ListGroup.Item>
				<ListGroup.Item>
					<Row>	
						<Col>
							<b>Current Slot:</b>
						</Col>
						<Col>
							{currSlot}
						</Col>
					</Row>
				</ListGroup.Item>
				<ListGroup.Item>
					<Row>
						<Col>
							<b>This Month's Payment:</b>
						</Col>
						<Col>
							{paymentStatus === true ? 
								<i className='fas fa-check' style={{color: 'green'}}></i>:
								<Button onClick={paymentHandler} className='col-12' variant='success'> <b>Pay <i className="fa fa-inr"></i> 500</b></Button>
							}
						</Col>
					</Row>
				</ListGroup.Item>
				<ListGroup.Item>
					<Row>
						<Col>
							<b>Pick Next Month's Slot:</b>
						</Col>
						<Col>
							<InputGroup>
								<Form.Control 
									as='select'
									className='form-select'
									value={nextSlot}
									required 
									onChange={(e) => setNextSlot(e.target.value)}>
										<option key={'Select your slot from dropdown'} value={''}>{'Select your slot'}</option>
										<option key={'6-7AM'} value={'6-7AM'}>{'6-7AM'}</option>
										<option key={'7-8AM'} value={'7-8AM'}>{'7-8AM'}</option>
										<option key={'8-9AM'} value={'8-9AM'}>{'8-9AM'}</option>
										<option key={'5-6PM'} value={'5-6PM'}>{'5-6PM'}</option>
								</Form.Control>
								<Button onClick={nextSlotHandler}>
									SAVE
								</Button>
							</InputGroup>
						</Col>
					</Row>
				</ListGroup.Item>
			</ListGroup>
		</FormContainer>
    )
}

export default HomeScreen
