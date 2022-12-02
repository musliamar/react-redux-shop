import React from 'react';
import './Header.css'
import logo from '../../Images/logo.svg';
import {Link} from 'react-router-dom';
import SmallCartIcon from '../../Images/small-cart-icon.svg';
import MinicartItems from './MinicartItems'
import MinicartActions from './MinicartActions'
import { connect } from 'react-redux'

class Header extends React.PureComponent {

    constructor(props) {
        super(props);
        this.currencyRef = React.createRef();
        this.minicartRef = React.createRef();
    }

    componentDidUpdate(){
        const {currencyRef, minicartRef} = this;
        const {closeBox} = this.props;

        window.onclick = (event) => {
            if(!event.path.includes(currencyRef.current)
            && !event.path.includes(minicartRef.current))
            closeBox()
        }
    }

    render() {

        const {
            categoriesList,
            currenciesList,
            choosenCurrency, 
            sumOfPrices,
            openBox,
            currentCategory,
            itemsInBag,
            increaseQuantityOfProduct,
            removeFromBag,
            currencyToShow,
            generateListOfAttributes,
            closeBox,
            currentlyOpened,
            numberOfItemsInBag,
            changeCurrency
            } = this.props;
        
        const {length} = itemsInBag;
        const {symbol: choosenCurrencySymbol} = choosenCurrency;
        const { minicartRef, currencyRef } = this;

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
                    <MinicartActions 
                        openBox = { openBox }
                        changeCurrency = { changeCurrency } 
                    />
                    </div>
                    <div ref={minicartRef} className='cart'>
                        <span className="tooltip-text cart-tooltip">My Bag</span>
                        <div onClick={() => {openBox('minicart')}}>
                            {!(numberOfItemsInBag === 0) ? <span className="items-number">{numberOfItemsInBag}</span> : null}
                            <img className='small-cart-icon' src={SmallCartIcon} alt='Your bag' />
                        </div>
                        <div className={
                                currentlyOpened === 'minicart' 
                                ? !(length === 0) ? 'box cart-box display-flex' : 'box empty'
                                : 'box display-none'}>
                            {!(length === 0) 
                            ? <>
                                <div className='minicart-main'>
                                    <div className='title'>
                                        <span className='bold display-inline'>My Bag,</span> {numberOfItemsInBag} items 
                                    </div>
                                    <div className='items'>
                                        <MinicartItems 
                                            increaseQuantityOfProduct = { increaseQuantityOfProduct }
                                            generateListOfAttributes = { generateListOfAttributes }
                                            removeFromBag = { removeFromBag } />
                                    </div>
                                </div>
                                <div className='total-price'>
                                    <span>Total</span>
                                    <span>{choosenCurrencySymbol}{sumOfPrices}</span>
                                </div>
                                <div className='minicart-buttons'>
                                    <Link onClick={closeBox} className='view-bag' to={'/cart'}>
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
}

const mapStateToProps = (state) => {
    return (state)
  }
  
export default connect(mapStateToProps)(Header);
  