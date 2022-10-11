import React from 'react';
import './CategoryPage.css';
import CartIcon from '../../Images/cart-icon.svg';
import {NavLink} from 'react-router-dom';

class CategoryPage extends React.PureComponent {

  state = {
    addToCart: false,
    overId: ''
  };

  showAddToCart = (event, props) => {
    this.setState({ addToCart: !this.state.addToCart, overId: props });
  }

    render() {

      const {choosenCurrency, currentCategoryData, addInBag} = this.props;
      const categoryName = this.props.currentCategory && this.props.currentCategory[0].toUpperCase() + this.props.currentCategory.slice(1);

      const sampleProduct = currentCategoryData && currentCategoryData[0].prices;
      let currencyToShow;

      for(const priceLabel in sampleProduct){
        if(choosenCurrency.label === sampleProduct[priceLabel].currency.label){
          currencyToShow = priceLabel;
        }
      }

      return (
        
        <div className='items-container'>
            <h1 className='category-title'>{categoryName}</h1>
            <div className='items'>
              {currentCategoryData && currentCategoryData.map((item) => (
  
                 <div key={item.id} name={item.id} className='item' onMouseEnter={event => this.showAddToCart(event, item.id)} onMouseLeave={this.showAddToCart}>
                   <div className='image-wrapper'>
                    <img className='item-image' src={item.gallery[0]} alt={item.name} />
                   </div>
                  {(this.state.overId && this.state.overId === item.id) ? 
                      item.inStock 
                      ?    <div onClick={() => {addInBag(item)}}>
                            <img src={CartIcon} className='cart-icon' alt="Add to cart" />
                          </div> 
                     :  <div className='cart-icon out-of-stock'>
                            <span>Out of stock</span>
                          </div> 
                   : null} 
                   <div className='item-content'>
                   <NavLink 
                 key={item.id} 
                 to={'/product/'+item.id}>
                  <div className='item-name'>{item.brand} {item.name}</div>
                 </NavLink>
                    <div className='item-price'>{choosenCurrency.symbol}{item.prices[currencyToShow] && item.prices[currencyToShow].amount}</div>
                   </div>
                 </div>
                ))}
            </div>
        </div>

    );
  }}

  export default CategoryPage;