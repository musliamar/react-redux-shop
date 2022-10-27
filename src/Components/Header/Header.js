import React from 'react';
import './Header.css'
import logo from '../../Images/logo.svg';
import {Link} from 'react-router-dom';
import SmallCartIcon from '../../Images/small-cart-icon.svg';
import ArrowUp from '../../Images/arrow-up.svg';

class Header extends React.PureComponent {

    constructor(props) {
        super(props);
        this.currencyRef = React.createRef();
        this.minicartRef = React.createRef();
    }

    generateListOfItems(props){
        const {choosenCurrency, increaseQuantityOfProduct, removeFromBag, currencyToShow, generateListOfAttributes} = this.props;
        const {symbol} = choosenCurrency;

         return props.map((item) => {
                const {cartId, brand, name, prices, gallery, inStock, choosenAttributes, quantity, attributes: itemAttributes} = item;
                const attributes = {attributes: itemAttributes, choosenAttributes: choosenAttributes, from: 'minicart', inStock: inStock};

                return (<div key={cartId} className='single'>
                    <div className='attributes'>
                        <div className='brand-name'>
                            <span>{brand}</span>
                            <span>{name}</span>
                        </div>
                        <div className='price'>
                            <span>{symbol}{prices[currencyToShow].amount.toFixed(2)}</span>
                        </div>
                        {generateListOfAttributes(attributes)}  
                    </div>
                    <div className='quantity'>
                        <span onClick={() => {increaseQuantityOfProduct(cartId)}} className='attribute-option text plus-minus'>
                            +
                        </span>
                        <span className='attribute-number'>
                            {quantity}
                        </span>
                        <span onClick={() => {removeFromBag(cartId)}} className='attribute-option text plus-minus'>
                            -
                        </span>
                    </div>
                    <div className='gallery'>
                        <span>
                            <img alt='Item preview' className='item-image' src={gallery[0]} />
                        </span>
                    </div>
                </div>)})
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
            closeBox,
            currentlyOpened,
            numberOfItemsInBag,
            changeCurrency
            } = this.props;
        
        const {length} = itemsInBag;
        const {label: choosenCurrencyLabel, symbol: choosenCurrencySymbol} = choosenCurrency;
        const {currencyRef, minicartRef} = this;

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
                        <span className="tooltip-text currency-tooltip">Change currency</span>
                        <div onClick={() => {openBox('currency')}} className='first-currency'>
                            <span>{choosenCurrencySymbol}</span>
                                {currentlyOpened === 'currency' 
                                ? <img className='currency-arrow-icon' src={ArrowUp} alt='Currency switcher arrow up'/>
                                : <img className='currency-arrow-icon rotate' src={ArrowUp} alt='Currency switcher arrow down'/>}
                        </div>
                        <ul className={currentlyOpened === 'currency' ? 'box currency-box display-flex' : 'box display-none'}>
                        {currenciesList.map((currency) => {
                            const {label: currencyLabel, symbol: currencySymbol} = currency;
                            return (
                                <li 
                                className={choosenCurrencyLabel === currencyLabel ? 'selected': null}
                                onClick={() => {changeCurrency(currency)}} 
                                key={currencySymbol}>
                                    {currencySymbol} {currencyLabel}
                                </li>
                        )})}
                        </ul>
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
                                        {this.generateListOfItems(itemsInBag)}
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

export default Header;