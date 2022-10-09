import React from 'react';
import './CartPage.css';


class CartPage extends React.Component {


    render() {


      return (
        
        <div className='items-container'>
            <h1 className='cart-title'>Cart</h1>
            <div className='cart-page-items'>
            {this.props.itemsInBag && this.props.itemsInBag.map((item) => {
                
                const attributes = {attributes: item.attributes, choosenAttributes: item.choosenAttributes};

                return (
                <>
                <div key={item.id+'-divider'} className='divider'></div>
                <div key={item.id} className='single'>
                    <div className='attributes'>
                        <div className='brand-name'>
                            <span className='brand'>{item.brand}</span>
                            <span className='name'>{item.name}</span>
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
                </div>
                </>)})}
            </div>
        </div>

    );
  }}

  export default CartPage;