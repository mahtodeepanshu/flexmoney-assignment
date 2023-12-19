import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import Header from './components/Header';
import Footer from './components/Footer';
import HomeScreen from './screens/HomeScreen';
import LogInScreen from './screens/LogInScreen';
import RegisterScreen from './screens/RegisterScreen';

const App = () => {
	return (
		<Router>
			<Header/>
			<main className='py-3'>
				<Container>
					<Routes>
						<Route path='/signup' Component={RegisterScreen}/>
						<Route path='/login' Component={LogInScreen}/>
						<Route path='/' Component={HomeScreen} exact/>
					</Routes>
				</Container>
			</main>
			<Footer/>
		</Router>
	);
}

export default App;
