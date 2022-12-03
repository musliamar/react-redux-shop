import React from 'react';
import './CategoryPage.css';
import CartIcon from '../../../Images/cart-icon.svg';
import {Link} from 'react-router-dom';
import {useParams} from "react-router-dom";
import {getCategory} from '../../../Queries';
import { connect } from "react-redux";
import { update } from '../../../Store';

class CategoryPage extends React.Component {

  state = {
    addToCart: false,
    overId: '',
    categoryData: '',
    categoryName: ''
  };

  async componentDidMount(){
    
    const {params, defaultCategory, update} = this.props;
    const {categoryData} = this.state;
    const {category: paramsCategory} = params;

    if(paramsCategory && (categoryData === '')){
      const categoryResult = await getCategory(paramsCategory)
      const {category} = categoryResult;

      if(category !== null){
        const {products} = category;
          this.setState({
            ...this.state, 
            categoryData: products, 
            categoryName: paramsCategory})
          update({name: 'currentCategory', value: paramsCategory})
          update({name: 'choosenAttributes', value: []})
      }else{
        this.setState({
          ...this.state, 
          categoryData: null})
      }
    }else if(!paramsCategory && defaultCategory && (categoryData === '')){
      const {name} = defaultCategory;
      const categoryResult = await getCategory(name)
      const {category} = categoryResult;
      const {products} = category;

      this.setState({
        ...this.state, 
        categoryData: products, 
        categoryName: name})
      update({name: 'currentCategory', value: name})
      update({name: 'choosenAttributes', value: []})
    } 
  }

  async componentDidUpdate(prevProps, prevState){
    const {params, defaultCategory, update} = this.props;
    const {categoryData} = this.state;
    const {category: paramsCategory} = params;

    if(paramsCategory && (categoryData === '')){
      const categoryResult = await getCategory(paramsCategory)
      const {category} = categoryResult;
      const {products} = category;

      if(category !== null){
          this.setState({
            ...this.state, 
            categoryData: products, 
            categoryName: paramsCategory})
          update({name: 'currentCategory', value: paramsCategory})
          update({name: 'choosenAttributes', value: []})
      }else{
        this.setState({
          ...this.state, 
          categoryData: null})
      }
    } 
    
    if(!paramsCategory && defaultCategory && (categoryData === '')){
      const {name} = defaultCategory;
      const categoryResult = await getCategory(name)
      const {category} = categoryResult;
      const {products} = category;
      
      this.setState({
        ...this.state, 
        categoryData: products, 
        categoryName: name})
      update({name: 'currentCategory', value: name})
      update({name: 'choosenAttributes', value: []})
    }

    if(paramsCategory !== prevProps.params.category){
      const categoryResult = await getCategory(paramsCategory)
      const {category} = categoryResult;
      const {products} = category;
      if(category !== null){
          this.setState({
            ...this.state, 
            categoryData: products, 
            categoryName: paramsCategory})
          update({name: 'currentCategory', value: paramsCategory})
          update({name: 'choosenAttributes', value: []})
      }else{
        this.setState({
          ...this.state, 
          categoryData: null})
      }
    }
  }

  showAddToCart = (event, props) => {
    const {addToCart} = this.state;
    this.setState({ addToCart: !addToCart, overId: props });
  }

  render() {

    const {categoryData, overId} = this.state
    const {choosenCurrency, currencyToShow, addInBag} = this.props;
    const {symbol} = choosenCurrency;
    const categoryName = this.state.categoryName && this.state.categoryName[0].toUpperCase() + this.state.categoryName.slice(1)
    
    if(categoryData !== null){
      return (<div className='items-container'>
            <h1 className='category-title'>{categoryName}</h1>
            <div className='items'>
              {categoryData && categoryData.map((item) => {
                
                const {id, inStock, category, gallery, brand, name, prices} = item;

                return(
                <div 
                  onMouseEnter={event => this.showAddToCart(event, id)}
                  onMouseLeave={this.showAddToCart}
                  key={id} 
                  className='single-item'>
                    {inStock &&
                      (overId && overId === id) 
                      && <div onClick={() => {addInBag({item: item})}}>
                          <img src={CartIcon} className='cart-icon' alt="Add to cart" />
                        </div>} 
                    <Link 
                      name={id} 
                      className='item' 
                      to={'/'+category+'/'+id}>
                        <div className={inStock ? 'image-wrapper' : 'image-wrapper opacity'}>
                          {!inStock 
                          && <div className='out-of-stock'>
                              Out of stock
                            </div>}
                          <img className='item-image' src={gallery[0]} alt={name} />
                        </div>
                        <div className='item-content'>
                          <div className={inStock ? 'item-name' : 'item-name bleached-text'}>{brand} {name}</div>
                          <div className={inStock ? 'item-price' : 'item-price bleached-text'}>{symbol}{prices[currencyToShow].amount.toFixed(2)}</div>
                        </div>
                    </Link>
                </div>
                )}
              )}
            </div>
          </div>)
    }else{
      return (<div>Sorry, we can't find that category.</div>)
    }
  }
}

const Category = (props) => (
  <CategoryPage
    {...props}
    params={useParams()}
  />)

  const mapStateToProps = (state) => ({
    defaultCategory: state.defaultCategory,
    choosenCurrency: state.choosenCurrency,
    currencyToShow: state.currencyToShow
  })
  
  const mapDispatchToProps = () => ({ 
    update
  });
  
  export default connect(mapStateToProps, mapDispatchToProps())(Category);