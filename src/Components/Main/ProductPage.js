import React from 'react';
import './ProductPage.css';
import {  useParams } from "react-router-dom";
import Queries from '../../Queries';

class ProductPage extends React.Component {

  state = {
      item: ''
    }

  async componentDidMount() {

    const productRaw = await JSON.parse(JSON.stringify((await Queries.getSingleProduct(this.props.params.product))))

    this.setState({
     item: productRaw.product
     
    })
  }

    render() {

       const {choosenCurrency, currencyToShow, generateListOfAttributes, addinBag} = this.props;
        const {item} = this.state;

      return (
        !(item === null)
        ?   <div key={item.id} className='product-page'>
        <div className='gallery'>
            {item.gallery && item.gallery.length > 1
                ?   
                <>
                <div className='all-images'>
                    <div class='small-image'>
                        <img 
                        alt={item.name+' product'}
                        onMouseMove={this.handleMouseMove}
                        style={(this.state.overId === item.id) ? this.state.style : null} 
                        className='item-image' 
                        src={item.gallery[0]} />
                    </div>
                </div>
                </>
                : null}
               <div className='single-image'>
                    <img 
                    alt={item.name+' product'} 
                    className='item-image' 
                    onMouseMove={this.handleMouseMove} 
                    style={(this.state.overId === item.id) ? this.state.style : null} 
                    src={item.gallery && item.gallery[0]} />
                </div>
        </div>  
        <div className='attributes'>
            <div className='brand-name'>
                <span className='brand'>{item.brand}</span>
                <span className='name'>{item.name}</span>
            </div>
            {generateListOfAttributes({attributes: item.attributes, choosenAttributes: ''})}
            <div className='price'>
          <span>{choosenCurrency && choosenCurrency.symbol}{item.prices && item.prices[currencyToShow].amount}</span>
            </div>
            <div className='wide-green-button'>
          <span>Add to cart</span>
            </div>
            <div className='description'>
          <span>{item.description}</span>
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