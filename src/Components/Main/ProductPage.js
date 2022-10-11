import React from 'react';
import './ProductPage.css';

class ProductPage extends React.PureComponent {

    render() {

        const {item} = this.props;

        console.log(this.props)

      return (
        
        <div name={item.id} className='item'>
                   <div className='image-wrapper'>
                    <img className='item-image' src={item.gallery[0]} alt={item.name} />
                   </div>
                 
                   <div className='item-content'>
                    <div className='item-name'>{item.brand} {item.name}</div>
                   {/*  <div className='item-price'>{choosenCurrency.symbol}{item.prices[currencyToShow] && item.prices[currencyToShow].amount}</div>
                   */} </div>
                 </div>

    );
  }}

  export default ProductPage;