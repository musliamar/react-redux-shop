import React from 'react';
import './CategoryPage.css';
import CartIcon from '../../Images/cart-icon.svg';
import {Link} from 'react-router-dom';
import {  useParams } from "react-router-dom";

class CategoryPage extends React.Component {

  state = {
    addToCart: false,
    overId: '',
    categoryData: '',
    categoryName: ''
  };

  async componentDidMount(){

    const categoriesData = this.props.categoriesData;

    if((categoriesData.length !== 0)){
      if(this.props.params.category){
        let found = false;
        for(const category in categoriesData){
          if(categoriesData[category].name === this.props.params.category){
            found = true;
            this.setState({
              ...this.state, 
              categoryData: categoriesData[category].products, 
              categoryName: categoriesData[category].name})
            this.props.updateStateFromChild({name: 'currentCategory', value: categoriesData[category].name})
          }
        }
        if(!found){
          this.setState({
            ...this.state, 
            categoryData: null})
        }
      }else if(!this.props.params.category){
        this.setState({
          ...this.state, 
          categoryData: categoriesData[0].products, 
          categoryName: categoriesData[0].name})
        this.props.updateStateFromChild({name: 'currentCategory', value: categoriesData[0].name})
      }
    }
  }

  async componentDidUpdate(prevProps, prevState){

    if(this.props.params.category !== prevProps.params.category){
      const categoriesData = this.props.categoriesData;
      if(this.props.params.category){
        for(const category in categoriesData){
          if(categoriesData[category].name === this.props.params.category){
            this.setState({
              ...this.state, 
              categoryData: categoriesData[category].products, 
              categoryName: categoriesData[category].name})
            this.props.updateStateFromChild({name: 'currentCategory', value: categoriesData[category].name})
          }
        }
      }
    }

    if((this.props.categoriesData !== prevProps.categoriesData)){
      const categoriesData = this.props.categoriesData;
      if(this.props.params.category){
        for(const category in categoriesData){
          if(categoriesData[category].name === this.props.params.category){
            this.setState({
              ...this.state, 
              categoryData: categoriesData[category].products, 
              categoryName: categoriesData[category].name})
            this.props.updateStateFromChild({name: 'currentCategory', value: categoriesData[category].name})
          }
        }
      }else if(!this.props.params.category){
       this.setState({
          ...this.state, 
          categoryData: categoriesData[0].products, 
          categoryName: categoriesData[0].name})
      this.props.updateStateFromChild({name: 'currentCategory', value: categoriesData[0].name})
      }
    }
  }

  showAddToCart = (event, props) => {
    this.setState({ addToCart: !this.state.addToCart, overId: props });
  }

  render() {

    const {categoryData, overId} = this.state
    const {choosenCurrency, currencyToShow, addInBag} = this.props;
    const categoryName = this.state.categoryName && this.state.categoryName[0].toUpperCase() + this.state.categoryName.slice(1);
      
    return (
        
      !(categoryData === null)
        ? <div className='items-container'>
            <h1 className='category-title'>{categoryName}</h1>
            <div className='items'>
              {categoryData && categoryData.map((item) => (
                <div key={item.id} name={item.id} className='item' onMouseEnter={event => this.showAddToCart(event, item.id)} onMouseLeave={this.showAddToCart}>
                  <div className='image-wrapper'>
                    <img className='item-image' src={item.gallery[0]} alt={item.name} />
                  </div>
                  {(overId && overId === item.id) 
                    ? item.inStock 
                      ? <div onClick={() => {addInBag({item: item})}}>
                          <img src={CartIcon} className='cart-icon' alt="Add to cart" />
                        </div> 
                      : <div className='cart-icon out-of-stock'>
                          <span>Out of stock</span>
                        </div> 
                  : null} 
                  <div className='item-content'>
                      <Link 
                        key={item.id} 
                        to={'/'+item.category+'/'+item.id}>
                        <div className='item-name'>{item.brand} {item.name}</div>
                      </Link>
                      <div className='item-price'>{choosenCurrency && choosenCurrency.symbol}{item.prices[currencyToShow] && item.prices[currencyToShow].amount}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        : <div>Sorry, we can't find that category.</div>
    );
  }}

  const Category = (props) => (
    <CategoryPage
      {...props}
      params={useParams()}
    />)

  export default Category;