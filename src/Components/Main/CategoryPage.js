import React from 'react';
import './CategoryPage.css';
import CartIcon from '../../Images/cart-icon.svg';

class CategoryPage extends React.PureComponent {

  state = {
    showBox: false,
    overId: ''
  };

  handleBoxToggle = (event, props) => {
    this.setState({ showBox: !this.state.showBox, overId: props });
  }

    render() {

      const {choosenCurrency, currentCategoryData} = this.props;
      const categoryName = this.props.currentCategory && this.props.currentCategory[0].toUpperCase() + this.props.currentCategory.slice(1);

      const sampleProduct = currentCategoryData && currentCategoryData[0].prices;
      let currencyToShow;

      for(const priceLabel in sampleProduct){
        if(choosenCurrency.label === sampleProduct[priceLabel].currency.label){
          currencyToShow = priceLabel;
        }
      }

      return (
        
        <div className='items-container'>
            <h1 className='category-title'>{categoryName}</h1>
            <div className='items'>
              {currentCategoryData && currentCategoryData.map((item) => (
                 <div key={item.id} className='item' onMouseEnter={event => this.handleBoxToggle(event, item.id)} onMouseLeave={this.handleBoxToggle}>
                   <div className='image-wrapper'>
                    <img className='item-image' src={item.gallery[0]} alt={item.name} />
                   </div>
                   {(this.state.overId && this.state.overId === item.id) ? 
                   <img src={CartIcon} className='cart-icon' alt="Add to cart" /> : null}
                   <div className='item-content'>
                    <div className='item-name'>{item.brand} {item.name}</div>
                    <div className='item-price'>{choosenCurrency.symbol} {item.prices[currencyToShow] && item.prices[currencyToShow].amount}</div>
                   </div>
                 </div>
                ))}
            </div>
        </div>

    );
  }}

  export default CategoryPage;