import React from 'react';
import './ProductPage.css';
import {  useParams } from "react-router-dom";
import Queries from '../../Queries';

class ProductPage extends React.Component {

  state = {
      item: '',
      overImage: '',
      reload: false
    }

   handleMouseClick = (props) => {
      this.setState({...this.state, overImage: props })
    }

  async componentDidMount() {

    if(!this.props.message){
      const productRaw = await JSON.parse(JSON.stringify((await Queries.getSingleProduct(this.props.params.product))))
      this.setState({
      ...this.state,
      item: productRaw.product
      })
    }
    this.props.resetChoosenAttributes();
  } 

  addProductInBag(props){
   /* window.location.reload(false); */
     this.props.addInBag(props);
  }

    render() {

       const {choosenCurrency, currencyToShow, choosenAttributes, generateListOfAttributes, addInBag} = this.props;
      const {item} = this.state;

      return (

        this.props.message
        ? <div>{this.props.message}</div>
        : !(item === null)
          ?   <div key={item.id} className='product-page'>
        <div className='gallery'>
            {item.gallery && item.gallery.length > 1
                ?   
                <>
                <div className='all-images'>
                   {item.gallery.map((image) => {

                    return (
                    image === this.state.overImage || (this.state.overImage === '' && image === item.gallery[0])
                    ? <div key={image} onClick={() => {this.handleMouseClick(image)}} className='small-image'>
                    <img alt={item.name+' product gallery item'} className='item-image' src={image} />
                    </div>
                    : <div key={image} onClick={() => {this.handleMouseClick(image)}} className='small-image'>
                    <img alt={item.name+' product gallery item'} style={{opacity: 0.5}} className='item-image' src={image} />
                    </div>)})}
                </div>
                </>
                : null}
               <div className='single-image'>
                    <img 
                    alt={item.name+' product'} 
                    className='item-image' 
                    src={!(this.state.overImage === '') ? this.state.overImage : item.gallery && item.gallery[0]} />
                </div>
        </div> 
        <div className='summary' >
        <div className='brand-name'>
                <span className='brand'>{item.brand}</span>
                <span className='name'>{item.name}</span>
            </div>
        <div className='attributes'>
            {generateListOfAttributes({attributes: item.attributes, from: 'product-page'})}
        </div>
        <div className='attribute'>
            <span className='attribute-name'>Price:</span>
          <span className='price'>{choosenCurrency && choosenCurrency.symbol}{item.prices && item.prices[currencyToShow].amount}</span>
            </div>
            <div onClick={() => {this.addProductInBag({item: item})}} className='wide-green-button'>
          <span>Add to cart</span>
            </div>
            <div dangerouslySetInnerHTML={{ __html: item.description}} className='description'>
            </div>
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