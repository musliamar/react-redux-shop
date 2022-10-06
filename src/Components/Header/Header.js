import React from 'react';
import './Header.css'
import logo from '../../Images/logo.svg';
import {NavLink} from 'react-router-dom';
import SmallCartIcon from '../../Images/small-cart-icon.svg';
import ArrowUp from '../../Images/arrow-up.svg';
import ArrowDown from '../../Images/arrow-down.svg';

class Header extends React.PureComponent {

    constructor(props) {
        super(props);
        this.currencyRef = React.createRef();
        this.minicartRef = React.createRef();
    }

    componentDidUpdate(){
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
            openBox,
            currentlyOpened,
            changeCurrency
            } = this.props;
            console.log(currentlyOpened)
      return (
       
        <nav>
            <div className='container'>
                <ul className='categories'>
                {categoriesList && categoriesList.map((category) => (
                    <NavLink onClick={() => {changeCurrentCategory(category.category)}} to={'/category/'+category.category}>
                    <li key={category.category} className={(category.category === currentCategory) ? 'category-label selected' : 'category-label'}>
                        {category.category}
                    </li>
                    </NavLink>
                ))}
                </ul>
            <div className='logo'><img src={logo} className='logo-icon' alt="logo" /></div>
            <div className='actions'>
                <div ref={this.currencyRef} className='currency'>
                        <span class="tooltip-text currency-tooltip">Change currency</span>
                        <div onClick={() => {openBox('currency')}} className='first-currency'>
                            <span>{choosenCurrency && choosenCurrency.symbol}</span>
                            {currentlyOpened === 'currency' 
                            ? <img className='currency-arrow-icon' src={ArrowUp} alt='Currency switcher arrow up'/>
                            : <img className='currency-arrow-icon' src={ArrowDown} alt='Currency switcher arrow down'/>}
                        </div>
                        <ul className={currentlyOpened === 'currency' ? 'box display-block' : 'box display-none'}>
                        {currenciesList && currenciesList.map((currency) => (
                        <li onClick={() => {changeCurrency(currency)}} key={currency.symbol}>{currency.symbol} {currency.label}</li>
                        ))}
                </ul>
                </div>
                <div ref={this.minicartRef} className='cart'>
                    <span class="tooltip-text cart-tooltip">View cart</span>
                    <div onClick={() => {openBox('minicart')}}>
                        <img className='small-cart-icon' src={SmallCartIcon} alt='View cart' />
                    </div>
                    <div className={currentlyOpened === 'minicart' ? 'box display-block' : 'box display-none'}>
                        aaaaaaaa
                    </div>
                </div>
            </div>
            </div>
        </nav>
    );
  }}

  export default Header;