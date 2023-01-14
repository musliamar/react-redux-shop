import React, { useEffect, useRef } from 'react';
import './Header.css'
import logo from '../../Images/logo.svg';
import {Link} from 'react-router-dom';
import SmallCartIcon from '../../Images/small-cart-icon.svg';
import MinicartItems from './MinicartItems'
import MinicartActions from './MinicartActions'
import { useSelector, useDispatch } from "react-redux";
import { update } from '../../Store';

function Header() {

    const currencyRef = useRef(null);
    const minicartRef = useRef(null);
    const dispatch = useDispatch();
    const categoriesList = useSelector((state) => state.categoriesList)
    const choosenCurrency = useSelector((state) => state.choosenCurrency)
    const sumOfPrices = useSelector((state) => state.sumOfPrices)
    const currentCategory = useSelector((state) => state.currentCategory)
    const itemsInBag = useSelector((state) => state.itemsInBag)
    const currentlyOpen = useSelector((state) => state.currentlyOpen)
    const numberOfItemsInBag = useSelector((state) => state.numberOfItemsInBag)
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
        
        const {length} = itemsInBag;
        const {symbol: choosenCurrencySymbol} = choosenCurrency;

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
                    <MinicartActions openBox={ openBox } />
                    </div>
                    <div ref={minicartRef} className='cart'>
                        <span className="tooltip-text cart-tooltip">My Bag</span>
                        <div onClick={() => openBox({toOpen: 'minicart'})}>
                            {(numberOfItemsInBag !== 0) && <span className="items-number">{numberOfItemsInBag}</span>}
                            <img className='small-cart-icon' src={SmallCartIcon} alt='Your bag' />
                        </div>
                        <div className={
                                currentlyOpen === 'minicart' 
                                ? (length !== 0) ? 'box cart-box display-flex' : 'box empty'
                                : 'box display-none'}>
                            {(length !== 0) 
                            ? <>
                                <div className='minicart-main'>
                                    <div className='title'>
                                        <span className='bold display-inline'>My Bag,</span> {numberOfItemsInBag} items 
                                    </div>
                                    <div className='items'>
                                        <MinicartItems />
                                    </div>
                                </div>
                                <div className='total-price'>
                                    <span>Total</span>
                                    <span>{choosenCurrencySymbol}{sumOfPrices}</span>
                                </div>
                                <div className='minicart-buttons'>
                                    <Link onClick={() => closeBox()} className='view-bag' to={'/cart'}>
                                        View Bag   
                                    </Link>
                                    <div className='checkout'>
                                        <span>Check out</span>
                                    </div>
                                </div>
                            </>
                            : <div className='minicart-main'>
                                <div className='title'>
                                    <span className='display-inline'>Your bag is currently empty.</span>
                                </div>
                            </div>}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
  }
 
export default Header;
  