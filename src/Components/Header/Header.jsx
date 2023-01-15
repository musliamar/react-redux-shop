import React, { useEffect, useRef } from 'react';
import './Header.css'
import logo from '../../Images/logo.svg';
import {Link} from 'react-router-dom';
import CurrencySwitcher from './CurrencySwitcher'
import { useSelector, useDispatch } from "react-redux";
import { update } from '../../Store';
import Minicart from './Minicart';

function Header() {

    const currencyRef = useRef(null);
    const minicartRef = useRef(null);
    const dispatch = useDispatch();
    const categoriesList = useSelector((state) => state.categoriesList)
    const currentCategory = useSelector((state) => state.currentCategory)
    const currentlyOpen = useSelector((state) => state.currentlyOpen)
    const closeBox = () => dispatch(update({name: 'currentlyOpen', value: ''}))

    const openBox = ({toOpen}) => {
        if(currentlyOpen === toOpen){
            dispatch(update({name: 'currentlyOpen', value: ''}))
        }else{
            dispatch(update({name: 'currentlyOpen', value: toOpen}))
        }
    }

    useEffect(() => {
        window.onclick = (event) => {
            if(!event.path.includes(currencyRef.current)
            && !event.path.includes(minicartRef.current))
            closeBox()
        }
    })

      return (
        <header>
            <div className='container'>
                <nav className='categories'>
                {categoriesList.map((category) => {
                    const {name} = category;
                    return (
                        <li key={name}>
                            <Link 
                            key={name} 
                            to={name}
                            className={(name === currentCategory) ? 'category-label selected' : 'category-label'}>  
                                {name}
                            </Link>
                        </li>
                    )}
                )} 
                </nav>
                <div className='logo'><img src={logo} className='logo-icon' alt="logo" /></div>
                <div className='actions'>
                    <div ref={currencyRef} className='currency'>
                    <CurrencySwitcher openBox={ openBox } />
                    </div>
                    <div ref={minicartRef} className='cart'>
                    <Minicart openBox={ openBox } closeBox={ closeBox } />    
                    </div>
                </div>
            </div>
        </header>
    );
  }
 
export default Header;
  