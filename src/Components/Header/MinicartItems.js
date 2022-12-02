import { Component } from 'react'
import { connect } from 'react-redux'

class Items extends Component {

    render() {
        const {
            choosenCurrency, 
            itemsInBag, 
            increaseQuantityOfProduct, 
            generateListOfAttributes,
            removeFromBag, 
            currencyToShow } = this.props;
        const {symbol} = choosenCurrency;

         return itemsInBag?.map((item) => {
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
                </div>)})}
}

const mapStateToProps = (state) => {
    return (state)
  }
  
export default connect(mapStateToProps)(Items);
  