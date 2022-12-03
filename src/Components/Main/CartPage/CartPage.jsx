import React from 'react';
import './CartPage.css';
import CartItem from './CartSingleItem'
import { connect } from 'react-redux'

class CartPage extends React.Component {
      
    render() {
        const {
            itemsInBag, 
            choosenCurrency,
            sumOfPrices,
            numberOfItemsInBag } = this.props;

        const {length: itemsLength} = itemsInBag;
        const {symbol} = choosenCurrency;
        const taxRaw = 0.21 * sumOfPrices;
        const tax = taxRaw.toFixed(2);
        const sumRaw = parseFloat(sumOfPrices) + taxRaw;
        const sum = sumRaw.toFixed(2);

        return (
        
            <div className='cart-container'>
                <h1 className='cart-title'>Cart</h1>
                <div className='cart-page-items'>
                {(itemsLength !== 0)
                ? <>
                    {itemsInBag.map((item) => {
                        return(<CartItem
                            key={item.cartId}
                            item = { item } />)
                    })}
                    <div className='divider'></div>
                    <div className='price-summary'>
                        <div className='labels'>
                            <span>Tax 21%:</span>
                            <span>Quantity:</span>
                            <span>Total:</span>
                        </div>
                        <div className='values'>
                            <span className='bold'>{symbol}{tax}</span>
                            <span className='bold'>{numberOfItemsInBag}</span>
                            <span className='bold'>{symbol}{sum}</span>
                        </div>
                    </div>
                    <div className='wide-green-button'>
                        <span>Order</span>
                    </div>
                </>
                : <span>Your cart is currently empty.</span>}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    itemsInBag: state.itemsInBag,
    choosenCurrency: state.choosenCurrency,
    numberOfItemsInBag: state.numberOfItemsInBag
  })
  
export default connect(mapStateToProps)(CartPage);
  