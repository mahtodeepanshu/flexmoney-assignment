import React from 'react'
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'
import { logout } from '../actions/userActions'
import { useDispatch, useSelector } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'

const Header = () => {
    const dispatch = useDispatch()

    const userLogin = useSelector(state => state.userLogin)
    const {userInfo} = userLogin

    const logoutHandler = () => {
        dispatch(logout())
    }

    return (
        <header>
        <Navbar bg='dark' variant='dark' expand='lg' collapseOnSelect>
            <Container>
            <LinkContainer to='/'>
                <Navbar.Brand>
                    Yoga Classes
                </Navbar.Brand>
            </LinkContainer>
            <Navbar.Toggle aria-controls='basic-navbar-nav' />
            <Navbar.Collapse id='basic-navbar-nav'>
                <Nav className='ms-auto'>
                {userInfo ? (
                    <NavDropdown title={userInfo.name} id='username'>
                        <NavDropdown.Item onClick={logoutHandler}>
                        Logout
                        </NavDropdown.Item>
                    </NavDropdown>
                ) : (
                    <LinkContainer to='/login'>
                        <Nav.Link>
                            <i className='fas fa-user'></i> Sign In
                        </Nav.Link>
                    </LinkContainer>
                )}
                </Nav>
            </Navbar.Collapse>
            </Container>
        </Navbar>
        </header>
    )
}


export default Header
