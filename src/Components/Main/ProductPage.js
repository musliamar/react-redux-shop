import React from 'react';
import './ProductPage.css';
import {  useParams } from "react-router-dom";
import parse from 'html-react-parser';
import {getProduct} from '../../Queries';

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
    const {params, generateDefaultAttributes} = this.props;
    const {product: paramsProduct} = params;

    if(paramsProduct){
      const productResult = await getProduct(paramsProduct)
      const {product} = productResult;

      if(product !== null){
        this.setState({
          ...this.state, 
          productData: product
        })
        generateDefaultAttributes(product)
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
    const {symbol} = choosenCurrency;
    const {overImage, productData: item} = this.state;
    const {id, gallery, name, brand, attributes, prices, inStock, description} = item;

    return (

      !(item === null)
        ? <div key={id} className='product-page'>
            <div className='gallery'>
            {gallery && gallery.length > 1
            ? <>
              <div className='all-images'>
                {gallery.map((image) => 
                    image === overImage || (overImage === '' && image === gallery[0])
                    ? <div key={image} onClick={() => {this.handleMouseClick(image)}} className='small-image'>
                    <img alt={name+' product gallery item'} className='item-image' src={image} />
                    </div>
                    : <div key={image} onClick={() => {this.handleMouseClick(image)}} className='small-image'>
                    <img alt={name+' product gallery item'} style={{opacity: 0.5}} className='item-image' src={image} />
                    </div>)}
              </div>
              </>
            : null}
              <div className='single-image'>
                <img 
                  alt={name+' product'} 
                  className='item-image' 
                  src={!(overImage === '') ? overImage : (gallery && gallery[0])} />
              </div>
            </div> 
          <div className='summary' >
            <div className='brand-name'>
              <span className='brand'>{brand}</span>
              <span className='name'>{name}</span>
            </div>
            <div className='attributes'>
              {generateListOfAttributes({attributes: attributes, from: 'product-page', item: item})}
            </div>
            <div className='attribute'>
              <span className='attribute-name'>Price:</span>
              <span className='price'>{symbol}{prices && prices[currencyToShow].amount.toFixed(2)}</span>
            </div>
            {inStock
            ? <div onClick={() => addInBag({item: item})} className='add-to-cart'>
                <span>Add to cart</span>
              </div>
            : <div className='wide-green-button out-of-stock'>
                <span>Out of stock</span>
              </div>}  
            <div className='description'>{description && parse(description)}</div>
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