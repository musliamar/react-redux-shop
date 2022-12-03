import { Component } from 'react'
import { connect } from 'react-redux'
import { increaseQuantityOfProduct, removeFromBag } from '../../Utils'
import Attributes from '../Main/Attributes';

class Items extends Component {

    render() {

        const {
            choosenCurrency, 
            itemsInBag, 
            dispatch,
            currencyToShow } = this.props;
        const {symbol} = choosenCurrency;

         return itemsInBag?.map((item) => {
                const {cartId, brand, name, prices, gallery, inStock, choosenAttributes, quantity, attributes: itemAttributes} = item;
                
                return (<div key={cartId} className='single'>
                    <div className='attributes'>
                        <div className='brand-name'>
                            <span>{brand}</span>
                            <span>{name}</span>
                        </div>
                        <div className='price'>
                            <span>{symbol}{prices[currencyToShow].amount.toFixed(2)}</span>
                        </div>
                        <Attributes 
                            attributes = {itemAttributes} 
                            choosenAttributesFromCart = { choosenAttributes }
                            from = { 'minicart' } 
                            inStock = { inStock } />
                    </div>
                    <div className='quantity'>
                        <span onClick={() => {increaseQuantityOfProduct({cartId: cartId, itemsInBag: itemsInBag, dispatch: dispatch})}} className='attribute-option text plus-minus'>
                            +
                        </span>
                        <span className='attribute-number'>
                            {quantity}
                        </span>
                        <span onClick={() => {removeFromBag({cartId: cartId, itemsInBag: itemsInBag, dispatch: dispatch})}} className='attribute-option text plus-minus'>
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

const mapStateToProps = (state) => ({
    choosenCurrency: state.choosenCurrency,
    itemsInBag: state.itemsInBag,
    currencyToShow: state.currencyToShow
  })
  
export default connect(mapStateToProps)(Items);
  