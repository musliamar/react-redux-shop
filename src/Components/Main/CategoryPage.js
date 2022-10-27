import React from 'react';
import './CategoryPage.css';
import CartIcon from '../../Images/cart-icon.svg';
import {Link} from 'react-router-dom';
import {useParams} from "react-router-dom";
import Queries from '../../Queries';

class CategoryPage extends React.Component {

  state = {
    addToCart: false,
    overId: '',
    categoryData: '',
    categoryName: ''
  };

  async componentDidMount(){
    if(this.props.params.category && (this.state.categoryData === '')){
      const categoryResult = await Queries.getCategory(this.props.params.category)
      const category = categoryResult.category;

      if(category !== null){
          this.setState({
            ...this.state, 
            categoryData: category.products, 
            categoryName: this.props.params.category})
          this.props.updateStateFromChild({name: 'currentCategory', value: this.props.params.category})
      }else{
        this.setState({
          ...this.state, 
          categoryData: null})
      }
    }else if(!this.props.params.category && this.props.defaultCategory && (this.state.categoryData === '')){
      const categoryResult = await Queries.getCategory(this.props.defaultCategory.name)
      const category = categoryResult.category;
      this.setState({
        ...this.state, 
        categoryData: category.products, 
        categoryName: this.props.defaultCategory.name})
      this.props.updateStateFromChild({name: 'currentCategory', value: this.props.defaultCategory.name})
    } 
  }

  async componentDidUpdate(prevProps, prevState){
    if(this.props.params.category && (this.state.categoryData === '')){
      const categoryResult = await Queries.getCategory(this.props.params.category)
      const category = categoryResult.category;
      if(category !== null){
          this.setState({
            ...this.state, 
            categoryData: category.products, 
            categoryName: this.props.params.category})
          this.props.updateStateFromChild({name: 'currentCategory', value: this.props.params.category})
      }else{
        this.setState({
          ...this.state, 
          categoryData: null})
      }
    } 
    
    if(!this.props.params.category && this.props.defaultCategory && (this.state.categoryData === '')){
      const categoryResult = await Queries.getCategory(this.props.defaultCategory.name)
      const category = categoryResult.category;
      this.setState({
        ...this.state, 
        categoryData: category.products, 
        categoryName: this.props.defaultCategory.name})
      this.props.updateStateFromChild({name: 'currentCategory', value: this.props.defaultCategory.name})
    }

    if(this.props.params.category !== prevProps.params.category){
      const categoryResult = await Queries.getCategory(this.props.params.category)
      const category = categoryResult.category;
      if(category !== null){
          this.setState({
            ...this.state, 
            categoryData: category.products, 
            categoryName: this.props.params.category})
          this.props.updateStateFromChild({name: 'currentCategory', value: this.props.params.category})
      }else{
        this.setState({
          ...this.state, 
          categoryData: null})
      }
    }
  }

  showAddToCart = (event, props) => {
    this.setState({ addToCart: !this.state.addToCart, overId: props });
  }

  render() {

    const {categoryData, overId} = this.state
    const {choosenCurrency, currencyToShow, addInBag} = this.props;
    const categoryName = this.state.categoryName && this.state.categoryName[0].toUpperCase() + this.state.categoryName.slice(1)
      
    return (
        
      !(categoryData === null)
        ? <div className='items-container'>
            <h1 className='category-title'>{categoryName}</h1>
            <div className='items'>
              {categoryData && categoryData.map((item) => (
                <div 
                onMouseEnter={event => this.showAddToCart(event, item.id)}
                onMouseLeave={this.showAddToCart}
                key={item.id} 
                className='single-item'>
                  {item.inStock ?
                    (overId && overId === item.id) 
                    ? <div onClick={() => {addInBag({item: item})}}>
                          <img src={CartIcon} className='cart-icon' alt="Add to cart" />
                        </div> 
                    : null 
                  : null} 
                <Link 
                name={item.id} 
                className='item' 
                to={'/'+item.category+'/'+item.id}>
                  <div className={item.inStock ? 'image-wrapper' : 'image-wrapper opacity'}>
                  {!item.inStock 
                    ? <div className='out-of-stock'>
                        Out of stock
                      </div>
                    : null}
                    <img className='item-image' src={item.gallery[0]} alt={item.name} />
                  </div>
      
                  <div className='item-content'>
                        <div className={item.inStock ? 'item-name' : 'item-name bleached-text'}>{item.brand} {item.name}</div>
                      <div className={item.inStock ? 'item-price' : 'item-price bleached-text'}>{choosenCurrency && choosenCurrency.symbol}{item.prices[currencyToShow] && item.prices[currencyToShow].amount.toFixed(2)}</div>
                  </div>
                </Link>
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