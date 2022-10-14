import React from 'react';
import './CategoryPage.css';
import CartIcon from '../../Images/cart-icon.svg';
import {Link} from 'react-router-dom';
import Queries from '../../Queries';
import {  useParams } from "react-router-dom";

class CategoryPage extends React.Component {

  state = {
    addToCart: false,
    overId: '',
    categoryData: '',
    categoryName: ''
  };

  async componentDidMount() {
    if(!this.props.message && this.props.params.category){
      const category = this.props.params.category
      const data = await JSON.parse(JSON.stringify((await Queries.getCategory(category))))
      const categoryData = !(data.category === null) ? Array.from(new Set(data.category.products.map(JSON.stringify))).map(JSON.parse) : null;
      
      this.setState({
        ...this.state,
        categoryName: category,
        categoryData: categoryData
      })
      this.props.resetChoosenAttributes();
    }

    if(this.props.defaultCategory){
      const category = this.props.defaultCategory
      const data = await JSON.parse(JSON.stringify((await Queries.getCategory(category))))
      const categoryData = !(data.category === null) ? Array.from(new Set(data.category.products.map(JSON.stringify))).map(JSON.parse) : null;
      
      this.setState({
        ...this.state,
        categoryName: category,
        categoryData: categoryData
      })
    }
  }

  async componentDidUpdate(prevProps){

    if(!(this.props.defaultCategory === prevProps.defaultCategory)){
      const category = this.props.params.category ? this.props.params.category : this.props.defaultCategory
      const data = await JSON.parse(JSON.stringify((await Queries.getCategory(category))))
      const categoryData = !(data.category === null) ? Array.from(new Set(data.category.products.map(JSON.stringify))).map(JSON.parse) : null;
      
      this.setState({
        ...this.state,
        categoryName: category,
        categoryData: categoryData
      })
      this.props.changeCurrentCategory(category);
    }

    if(this.props.params.category && !(this.props.params.category === prevProps.params.category)){
      const category = this.props.params.category
      const data = await JSON.parse(JSON.stringify((await Queries.getCategory(category))))
      const categoryData = !(data.category === null) ? Array.from(new Set(data.category.products.map(JSON.stringify))).map(JSON.parse) : null;
      
      this.setState({
        ...this.state,
        categoryName: category,
        categoryData: categoryData
      })
      this.props.changeCurrentCategory(category);
    }

  }

  showAddToCart = (event, props) => {
    this.setState({ addToCart: !this.state.addToCart, overId: props });
  }

  render() {

    const {categoryData} = this.state
    const {choosenCurrency, currencyToShow, addInBag} = this.props;
    const categoryName = this.state.categoryName && this.state.categoryName[0].toUpperCase() + this.state.categoryName.slice(1);
      
    return (
        
      this.props.message
      ? <div>{this.props.message}</div>
      : !(categoryData === null)
        ? <div className='items-container'>
            <h1 className='category-title'>{categoryName}</h1>
            <div className='items'>
              {categoryData && categoryData.map((item) => (
                <div key={item.id} name={item.id} className='item' onMouseEnter={event => this.showAddToCart(event, item.id)} onMouseLeave={this.showAddToCart}>
                  <div className='image-wrapper'>
                    <img className='item-image' src={item.gallery[0]} alt={item.name} />
                  </div>
                  {(this.state.overId && this.state.overId === item.id) 
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
                        to={'/product/'+item.id}>
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