import React, {useState, useEffect} from 'react'
import {Form, Button, Row, Col} from 'react-bootstrap'
import {useDispatch, useSelector} from 'react-redux'
import Message from '../components/Message.js'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import {login} from '../actions/userActions'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const LogInScreen = () => {
	const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

	const dispatch = useDispatch() 
	const navigate = useNavigate()

	const userLogin = useSelector(state => state.userLogin)
    const {loading, error, userInfo} = userLogin

	const { search } = useLocation()
	const sp = new URLSearchParams(search)
	const redirect = sp.get('redirect') || '/'

	useEffect(() => {
        if(userInfo){
            navigate(redirect)
        }

    }, [navigate, redirect, userInfo])

	const loginHandler = (e) => {
        e.preventDefault()
        dispatch(login(email, password))
    }

    return (
		<FormContainer>
			<h2>User Sign In</h2>
			{loading && <Loader />}
            {error && <Message variant='danger'> {error} </Message>}
			<Form onSubmit={loginHandler}>
				<Form.Group className='my-2' controlId='email'>
                    <Form.Label> Email Address </Form.Label>
                    <Form.Control 
                        type='email' 
                        placeholder='Enter Email'   
                        value={email} onChange={(e) => setEmail(e.target.value)}>
                    </Form.Control>
                </Form.Group>
                <Form.Group className='my-2' controlId='password'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                        type='password' 
                        placeholder='Enter Password' 
                        value={password} onChange={(e) => setPassword(e.target.value)}>
                    </Form.Control>
                </Form.Group>
                <p> </p>
                <Button type='submit' variant='primary'>
                    Sign In
                </Button>
            </Form>

			<Row className='py-3'>
				<Col>
				Don't have an account?{' '}
				<Link to={redirect ? `/signup?redirect=${redirect}` : '/signup'}>
					Sign Up
				</Link>
				</Col>
			</Row>
		</FormContainer>
    )
}

export default LogInScreen
