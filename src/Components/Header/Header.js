import React from 'react';
import './Header.css'
import logo from '../../Images/logo.svg';
import {NavLink} from 'react-router-dom';
import SmallCartIcon from '../../Images/small-cart-icon.svg';
import ArrowUp from '../../Images/arrow-up.svg';
import ArrowDown from '../../Images/arrow-down.svg';
import Queries from '../../Queries.js';

class Header extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {   
            itemsInBag: [],
            currencyToShow: '',
        } 

        this.currencyRef = React.createRef();
        this.minicartRef = React.createRef();

    }

    generateListOfItems(props){

         return props && props.map((item) =>
                <div key={item.id} className='single'>
                    <div className='attributes'>
                        <div className='brand-name'>
                            {item.brand}<br></br>
                            {item.name}
                        </div>
                        <div className='price'>
                            {this.props.choosenCurrency && this.props.choosenCurrency.symbol} {item.prices[this.state.currencyToShow] && item.prices[this.state.currencyToShow].amount}
                        </div>
                        {this.generateListOfAttributes(item.attributes)}  
                    </div>
                    <div className='quantity'>
                        <span className='attribute-option text plus-minus'>
                            +
                        </span>
                        <span className='attribute-number'>
                            1
                        </span>
                        <span className='attribute-option text plus-minus'>
                            -
                        </span>
                    </div>
                    <div className='gallery'>
                        <span>
                            <img className='item-image' src={item.gallery && item.gallery[0]} />
                        </span>
                    </div>
                </div>)
    }

    generateListOfAttributes(attributes) {

        return attributes && attributes.map((attribute, index) => 
         
            <div key={attribute.id} className='attribute'>
                <span className='attribute-name'>{attribute.name}</span>
                <div className='attribute-options'>
                    {attribute.items && attribute.items.map((item) => {
                    
                    const color = item.value;

                    return (attribute.type === 'swatch'
                    ? <span key={item.id} style={{backgroundColor: color}} className='attribute-option swatch'></span>
                    : <span key={item.id} className='attribute-option text'>{item.value}</span>
                    )})}
                </div>
            </div>)
        } 

    componentDidUpdate(prevProps){
        window.onclick = (event) => {
            if(!event.path.includes(this.currencyRef.current)
            && !event.path.includes(this.minicartRef.current))
            {this.props.closeBox()}
        }

        const sampleProductPrice = this.state.itemsInBag[0] && this.state.itemsInBag[0].prices;
        let currencyToShow;
 
        for(const priceLabel in sampleProductPrice){
            if(this.props.choosenCurrency.label === sampleProductPrice[priceLabel].currency.label){
                currencyToShow = priceLabel;
            }
        }
 
        this.setState({
         ...this.state,
         currencyToShow: currencyToShow
        })
    }

    async componentDidMount() {

        const itemsInBag = [];
        const product1 = await JSON.parse(JSON.stringify((await Queries.getSingleProduct('huarache-x-stussy-le'))))
        const product2 = await JSON.parse(JSON.stringify((await Queries.getSingleProduct('apple-iphone-12-pro'))))
        const product3 = await JSON.parse(JSON.stringify((await Queries.getSingleProduct('jacket-canada-goosee'))))

       itemsInBag.push(product1.product)
       itemsInBag.push(product2.product)
       itemsInBag.push(product3.product)

       const sampleProductPrice = itemsInBag[0] && itemsInBag[0].prices;
       let currencyToShow;

       for(const priceLabel in sampleProductPrice){
           if(this.props.choosenCurrency.label === sampleProductPrice[priceLabel].currency.label){
               currencyToShow = priceLabel;
           }
       }

       this.setState({
        itemsInBag: itemsInBag,
        currencyToShow: currencyToShow
       })
  }

    render() {

        const {
            itemsInBag
            } = this.state;

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

            console.log(this.state.itemsInBag)

      return (
       
        <header>
            <div className='container'>
                <nav className='categories'>
                {categoriesList && categoriesList.map((category) => (
                    <NavLink key={category.category} onClick={() => {changeCurrentCategory(category.category)}} to={'/category/'+category.category}>
                    <li key={category.category} className={(category.category === currentCategory) ? 'category-label selected' : 'category-label'}>
                        {category.category}
                    </li>
                    </NavLink>
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
                    <span className="tooltip-text cart-tooltip">View cart</span>
                    <div onClick={() => {openBox('minicart')}}>
                        <img className='small-cart-icon' src={SmallCartIcon} alt='Your bag' />
                    </div>
                    <div className={currentlyOpened === 'minicart' ? 'box cart-box display-flex' : 'box display-none'}>
                        <div className='minicart-main'>
                            <div className='title'>
                                <span className='bold'>My Bag,</span> number of items 
                            </div>
                            
                                <div className='items'>
                                    {this.generateListOfItems(itemsInBag)}
                                </div>
                           
                            <div className='minicart-total-price'>
                                <span className='total-label'>aaaaaaaaaa</span>
                                <span className='total-value'>aaaaaaaaa</span>
                            </div>
                        </div>
                        <div className='minicart-buttons'>
                            <div className='view-bag'>
                            
                            </div>
                            <div className='checkout'>
                            
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </header>
    );
  }}

  export default Header;