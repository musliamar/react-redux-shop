import React from 'react';
import './ProductPage.css';
import {  useParams } from "react-router-dom";

class ProductPage extends React.Component {

  state = {
      item: '',
      overImage: '',
      reload: false,
      productData: ''
  }

  handleMouseClick = (props) => {
      this.setState({...this.state, overImage: props })
  }

  async componentDidMount(){

    const categoriesData = this.props.categoriesData;

    if((categoriesData.length !== 0)){
        let found = false;
        for(const category in categoriesData){
          if(categoriesData[category].name === this.props.params.category){
            const foundCategory = categoriesData[category].products;
            for(const product in foundCategory){
              if(foundCategory[product].id === this.props.params.product){
                found = true;
                this.setState({
                  ...this.state, 
                  productData: foundCategory[product]
                  })
                this.props.generateDefaultAttributes(foundCategory[product])
              }
            }
          }
        }
        if(!found){
          this.setState({
            ...this.state, 
            productData: null
            })
        }
    }
  }

  async componentDidUpdate(prevProps, prevState){
    if((this.props.categoriesData !== prevProps.categoriesData)){
      const categoriesData = this.props.categoriesData;
      let found = false;
        for(const category in categoriesData){
          if(categoriesData[category].name === this.props.params.category){
            const foundCategory = categoriesData[category].products;
            for(const product in foundCategory){
              if(foundCategory[product].id === this.props.params.product){
                found = true;
                this.setState({
                  ...this.state, 
                  productData: foundCategory[product]
                  })
                this.props.generateDefaultAttributes(foundCategory[product])
                this.props.updateStateFromChild({name: 'currentCategory', value: categoriesData[category].name})  
              }
            }
          }
        }
       if(!found){
          this.setState({
            ...this.state, 
            productData: null
            })
        }
    }
  }

  render() {

    const {choosenCurrency, currencyToShow, choosenAttributes, generateListOfAttributes, addInBag} = this.props;
    const item = this.state.productData;

    return (

      this.props.message
      ? <div>{this.props.message}</div>
      : !(item === null)
        ? <div key={item.id} className='product-page'>
            <div className='gallery'>
            {item.gallery && item.gallery.length > 1
            ? <>
              <div className='all-images'>
                {item.gallery.map((image) => 
                    image === this.state.overImage || (this.state.overImage === '' && image === item.gallery[0])
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
                  src={!(this.state.overImage === '') ? this.state.overImage : item.gallery && item.gallery[0]} />
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
              <span className='price'>{choosenCurrency && choosenCurrency.symbol}{item.prices && item.prices[currencyToShow].amount}</span>
            </div>
            <div onClick={() => this.props.addInBag({item: item})} className='wide-green-button'>
              <span>Add to cart</span>
            </div>
            <div dangerouslySetInnerHTML={{ __html: item.description}} className='description'></div>
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