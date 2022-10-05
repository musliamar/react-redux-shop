import React from 'react';
import './Header.css'
import Queries from '../../Queries';
import logo from '../../Images/logo.svg';
import {NavLink} from 'react-router-dom';
import SmallCartIcon from '../../Images/small-cart-icon.svg';

class Header extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {      
            categoriesList: [],
            currenciesList: [],
        }
    }

    async componentDidMount() {
    
        const categories = await JSON.parse(JSON.stringify((await Queries.getCategoriesList())))
        const currencies = await JSON.parse(JSON.stringify((await Queries.getAllCurrencies())))
        const categoriesList = Array.from(new Set(categories.category.products.map(JSON.stringify))).map(JSON.parse);
        const currenciesList = Array.from(new Set(currencies.currencies.map(JSON.stringify))).map(JSON.parse);

        this.setState({
         categoriesList: categoriesList, 
         currenciesList: currenciesList           
        });   

        this.props.changeCurrency(currenciesList[0]);
              
      }

    render() {

        const {changeCurrentCategory, currentCategory, choosenCurrency, changeCurrency} = this.props;
        const {categoriesList, currenciesList} = this.state;

      return (
       
        <nav>
            <div className='container'>
                <ul className='categories'>
                {categoriesList.map((category) => (
                    <NavLink onClick={() => {changeCurrentCategory(category.category)}} to={'/category/'+category.category}>
                    <li key={category.category} className={(category.category === currentCategory) ? 'category-label selected' : 'category-label'}>
                        {category.category}
                    </li>
                    </NavLink>
                ))}
                </ul>
            <div className='logo'><img src={logo} className='logo-icon' alt="logo" /></div>
            <div className='actions'>
                <div className='currency'>
                        <span className='first-currency'>{currenciesList[0] && currenciesList[0].symbol}</span>
                        <ul className='other-currencies'>
                        {currenciesList.map((currency) => (
                        <li onClick={() => {changeCurrency(currency)}} key={currency.symbol}>{currency.symbol} {currency.label}</li>
                        ))}
                        </ul>
                </div>
                <div className='cart'><img className='small-cart-icon' src={SmallCartIcon} alt='View cart' /></div>
            </div>
            </div>
        </nav>
    );
  }}

  export default Header;