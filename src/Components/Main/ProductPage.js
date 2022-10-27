import React from 'react';
import './ProductPage.css';
import {  useParams } from "react-router-dom";
import parse from 'html-react-parser';
import Queries from '../../Queries';

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

    if(this.props.params.product){
      const productResult = await Queries.getProduct(this.props.params.product)
      const {product} = productResult;

      if(product !== null){
        this.setState({
          ...this.state, 
          productData: product
        })
        this.props.generateDefaultAttributes(product)
      }else{
          this.setState({
            ...this.state, 
            productData: null
      })
    } 
  }
}

  render() {

    const {choosenCurrency, currencyToShow, addInBag, generateListOfAttributes} = this.props;
    const {overImage, productData: item} = this.state;

    return (

      !(item === null)
        ? <div key={item.id} className='product-page'>
            <div className='gallery'>
            {item.gallery && item.gallery.length > 1
            ? <>
              <div className='all-images'>
                {item.gallery.map((image) => 
                    image === overImage || (overImage === '' && image === item.gallery[0])
                    ? <div key={image} onClick={() => {this.handleMouseClick(image)}} className='small-image'>
                    <img alt={item.name+' product gallery item'} className='item-image' src={image} />
                    </div>
                    : <div key={image} onClick={() => {this.handleMouseClick(image)}} className='small-image'>
                    <img alt={item.name+' product gallery item'} style={{opacity: 0.5}} className='item-image' src={image} />
                    </div>)}
              </div>
              </>
            : null}
              <div className='single-image'>
                <img 
                  alt={item.name+' product'} 
                  className='item-image' 
                  src={!(overImage === '') ? overImage : item.gallery && item.gallery[0]} />
              </div>
            </div> 
          <div className='summary' >
            <div className='brand-name'>
              <span className='brand'>{item.brand}</span>
              <span className='name'>{item.name}</span>
            </div>
            <div className='attributes'>
              {generateListOfAttributes({attributes: item.attributes, from: 'product-page', item: item})}
            </div>
            <div className='attribute'>
              <span className='attribute-name'>Price:</span>
              <span className='price'>{choosenCurrency && choosenCurrency.symbol}{item.prices && item.prices[currencyToShow].amount.toFixed(2)}</span>
            </div>
            {item.inStock
            ? <div onClick={() => addInBag({item: item})} className='add-to-cart'>
                <span>Add to cart</span>
              </div>
            : <div className='wide-green-button out-of-stock'>
                <span>Out of stock</span>
              </div>}  
            <div className='description'>{item.description && parse(item.description)}</div>
          </div>
        </div>
        : <div>Sorry, we can't find that product.</div>
    );
  }}

  const Product = (props) => (
    <ProductPage
        {...props}
        params={useParams()}
    />)

  export default Product;