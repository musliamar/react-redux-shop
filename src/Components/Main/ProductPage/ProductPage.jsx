import React from 'react';
import './ProductPage.css';
import {  useParams } from "react-router-dom";
import parse from 'html-react-parser';
import { getProduct } from '../../../Queries';
import { connect } from "react-redux";
import Attributes from '../Attributes';
import { update, increaseNumberOfItemsInBag, generateDefaultAttributes, addInBag } from '../../../Store'

class ProductPage extends React.Component {

  state = {
    item: '',
    overImage: '',
    productData: ''
  }

  handleMouseClick = (props) => {
    this.setState({...this.state, overImage: props })
  }

  async componentDidMount(){

    window.scrollTo(0, 0);
    const {params, update} = this.props;
    const {product: paramsProduct} = params;

    if(paramsProduct){
      const productResult = await getProduct(paramsProduct)
      const {product} = productResult;

      if(product !== null){
        this.setState({
          ...this.state, 
          productData: product
        })
        /* generateDefaultAttributes({product: product, update: update}) */
      }else{
          this.setState({
            ...this.state, 
            productData: null
      })
    } 
  }
  }

  render() {
    
    const { 
      choosenCurrency, 
      currencyToShow, 
      itemsInBag, 
      notificationArr,
      notificationKey,
      numberOfItemsInBag, 
      choosenAttributes } = this.props;
    const {symbol} = choosenCurrency;
    const {overImage, productData: item} = this.state;

    if(item !== null){
      const {
        id, 
        gallery, 
        name, 
        brand, 
        attributes, 
        prices, 
        inStock, 
        description} = item;

      return (<div key={id} className='product-page'>
            <div className='gallery'>
            {gallery && gallery.length > 1
            && <>
              <div className='all-images'>
                {gallery.map((image) => 
                    image === overImage || (overImage === '' && image === gallery[0])
                    ? <div key={image} onClick={() => {this.handleMouseClick(image)}} className='small-image'>
                    <img alt={name+' product gallery item'} className='item-image' src={image} />
                    </div>
                    : <div key={image} onClick={() => {this.handleMouseClick(image)}} className='small-image'>
                    <img alt={name+' product gallery item'} className='item-image opacity' src={image} />
                    </div>)}
              </div>
              </>}
              <div className='single-image'>
                {!inStock
                && <div className='out-of-stock-text'>
                    Out of stock
                  </div>}
                <img 
                  alt={name+' product'} 
                  className={inStock ? 'item-image' : 'item-image opacity'}
                  src={(overImage !== '') ? overImage : (gallery && gallery[0])} />
              </div>
            </div> 
          <div className='summary' >
            <div className='brand-name'>
              <span className={inStock ? 'brand' : 'brand bleached-text'}>{brand}</span>
              <span className={inStock ? 'name' : 'name bleached-text'}>{name}</span>
            </div>
            <div className='attributes'>
            <Attributes 
                attributes = {attributes} 
                from = { 'product-page' } 
                inStock = { inStock } />
            </div>
            <div className='attribute'>
              <span className={inStock ? 'attribute-name in-stock' : 'attribute-name bleached-text'}>Price:</span>
              <span className={inStock ? 'price' : 'price bleached-text'}>{symbol}{prices && prices[currencyToShow].amount.toFixed(2)}</span>
            </div>
            {inStock
            ? <div onClick={() => addInBag({
              item: item,
              choosenAttributes: choosenAttributes, 
              itemsInBag: itemsInBag, 
              numberOfItemsInBag: numberOfItemsInBag, 
              increaseNumberOfItemsInBag: increaseNumberOfItemsInBag, 
              notificationArr: notificationArr,
              notificationKey: notificationKey,
              update: update
            })} className='add-to-cart'>
                <span>Add to cart</span>
              </div>
            : <div className='wide-green-button out-of-stock'>
                <span>Out of stock</span>
              </div>}  
            <div className={inStock ? 'description in-stock' : 'description bleached-text'}>{description && parse(description)}</div>
          </div>
        </div>)
    }else{
      return(<div>Sorry, we can't find that product.</div>)
    }
  }
}

const Product = (props) => (
  <ProductPage
    {...props}
    params={useParams()}
  />)

const mapStateToProps = (state) => ({
    choosenCurrency: state.choosenCurrency,
    currencyToShow: state.currencyToShow,
    itemsInBag: state.itemsInBag,
    numberOfItemsInBag: state.numberOfItemsInBag,
    choosenAttributes: state.choosenAttributes,
    notificationArr: state.notificationArr,
    notificationKey: state.notificationKey,
})

const mapDispatchToProps = () => ({ 
  update,
  increaseNumberOfItemsInBag
});

export default connect(mapStateToProps, mapDispatchToProps())(Product);