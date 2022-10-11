import React from 'react';
import './Header.css'
import logo from '../../Images/logo.svg';
import {Link} from 'react-router-dom';
import SmallCartIcon from '../../Images/small-cart-icon.svg';
import ArrowUp from '../../Images/arrow-up.svg';
import ArrowDown from '../../Images/arrow-down.svg';

class Header extends React.PureComponent {

    constructor(props) {
        super(props);

        this.currencyRef = React.createRef();
        this.minicartRef = React.createRef();

    }

    generateListOfItems(props){

         return props && props.map((item) => {
                
                const attributes = {attributes: item.attributes, choosenAttributes: item.choosenAttributes};

                return (<div key={item.id} className='single'>
                    <div className='attributes'>
                        <div className='brand-name'>
                            <span>{item.brand}</span>
                            <span>{item.name}</span>
                        </div>
                        <div className='price'>
                        <span style={{fontWeight: 'normal', fontSize: 14}}>per unit {this.props.choosenCurrency && this.props.choosenCurrency.symbol}{item.prices[this.props.currencyToShow] && item.prices[this.props.currencyToShow].amount}</span>
                        <span>{this.props.choosenCurrency && this.props.choosenCurrency.symbol}{item.sumPriceOfItemFixed}</span>
                        </div>
                        {this.props.generateListOfAttributes(attributes)}  
                    </div>
                    <div className='quantity'>
                        <span onClick={() => {this.props.increaseQuantityOfProduct(item.id)}} className='attribute-option text plus-minus'>
                            +
                        </span>
                        <span className='attribute-number'>
                            {item.quantity}
                        </span>
                        <span onClick={() => {this.props.removeFromBag(item.id)}} className='attribute-option text plus-minus'>
                            -
                        </span>
                    </div>
                    <div className='gallery'>
                        <span>
                            <img className='item-image' src={item.gallery && item.gallery[0]} />
                        </span>
                    </div>
                </div>)})
    }

    componentDidUpdate(prevProps){

        window.onclick = (event) => {
            if(!event.path.includes(this.currencyRef.current)
            && !event.path.includes(this.minicartRef.current))
            {this.props.closeBox()}
        }
    }

    render() {

        const {
            changeCurrentCategory, 
            categoriesList,
            currenciesList,
            currentCategory, 
            choosenCurrency, 
            sumOfPrices,
            openBox,
            itemsInBag,
            currentlyOpened,
            numberOfItemsInBag,
            changeCurrency
            } = this.props;

      return (
       
        <header>
            <div className='container'>
                <nav className='categories'>
                {categoriesList && categoriesList.map((category) => (
                    <li key={category.name}>
                    <Link 
                    key={category.name} 
                    onClick={() => {changeCurrentCategory(category.name)}} 
                    to={'/category/'+category.name}
                    className={(category.name === currentCategory) ? 'category-label selected' : 'category-label'}>  
                        {category.name}
                    </Link>
                    </li>
                ))}
                </nav>
            <div className='logo'><img src={logo} className='logo-icon' alt="logo" /></div>
            <div className='actions'>
                <div ref={this.currencyRef} className='currency'>
                        <span className="tooltip-text currency-tooltip">Change currency</span>
                        <div onClick={() => {openBox('currency')}} className='first-currency'>
                            <span>{choosenCurrency && choosenCurrency.symbol}</span>
                            {currentlyOpened === 'currency' 
                            ? <img className='currency-arrow-icon' src={ArrowUp} alt='Currency switcher arrow up'/>
                            : <img className='currency-arrow-icon' src={ArrowDown} alt='Currency switcher arrow down'/>}
                        </div>
                        <ul className={currentlyOpened === 'currency' ? 'box currency-box display-flex' : 'box display-none'}>
                        {currenciesList && currenciesList.map((currency) => (
                        <li onClick={() => {changeCurrency(currency)}} key={currency.symbol}>{currency.symbol} {currency.label}</li>
                        ))}
                </ul>
                </div>
                <div ref={this.minicartRef} className='cart'>
                    <span className="tooltip-text cart-tooltip">My Bag</span>
                    <div onClick={() => {openBox('minicart')}}>
                    {!(numberOfItemsInBag === 0) ? <span className="items-number">{numberOfItemsInBag}</span> : null}
                        <img className='small-cart-icon' src={SmallCartIcon} alt='Your bag' />
                    </div>
                    <div 
                    className={currentlyOpened === 'minicart' 
                    ? !(itemsInBag.length === 0) ? 'box cart-box display-flex' : 'box empty'
                    : 'box display-none'}>
                        {!(itemsInBag.length === 0) 
                        ? <>
                            <div className='minicart-main'>
                            <div className='title'>
                                <span style={{display: 'inline'}} className='bold'>My Bag,</span> {numberOfItemsInBag} items 
                            </div>
                            
                                <div className='items'>
                                    {this.generateListOfItems(itemsInBag)}
                                </div>
                        </div>
                        <div className='total-price'>
                                 <span>Total</span>
                            <span>{choosenCurrency && choosenCurrency.symbol}{sumOfPrices}</span>
                            </div>
                        <div className='minicart-buttons'>
                            <Link onClick={this.props.closeBox} className='view-bag' to={'/cart'}>
                                View Bag   
                            </Link>
                            <div className='checkout'>
                            <span>Check out</span>
                            </div>
                        </div>
                        </>
                        : <div className='minicart-main'>
                            <div className='title'>
                            <span style={{display: 'inline'}}>Your bag is currently empty.</span>
                            </div>
                        </div>}
                    </div>
                </div>
            </div>
            </div>
        </header>
    );
  }}

  export default Header;