import Navbar from '../components/Navbar.jsx';
import Hero from '../components/Home.jsx'
import Footer from '../components/Footer.jsx';

import {store} from "../store"

import { Provider } from 'react-redux';
const Landing = () =>{
    return (
        <div>
            <Provider store={store}>
            <Navbar />
            <div>
            <Hero />
            </div>
            <Footer />
            </Provider>
            
        </div>
    )
}


export default Landing;