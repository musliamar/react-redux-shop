import React from 'react';
import Query from '../../Queries';
import './CategoryPage.css';
import CartIcon from '../../Images/cart-icon.svg';

class CategoryPage extends React.PureComponent {

  constructor(props) {

    super(props);
    
    this.state = {   
      currentCategoryData: ''
    }   
  }

  state = {
    showBox: false,
    overId: ''
  };

  handleBoxToggle = (event, props) => {
    this.setState({ showBox: !this.state.showBox, overId: props });
  }

    async componentDidMount() {
        
        const category = this.props.currentCategory === '' ? 'aaa' : this.props.currentCategory;
        const result = await JSON.parse(JSON.stringify((await Query.getCategory(category))))
        const data = Array.from(new Set(result.category.products.map(JSON.stringify))).map(JSON.parse);

        this.setState({
          currentCategoryData: data             
        });      
              
      }

      async componentDidUpdate(prevProps) {
        
        if(!(this.props.currentCategory === prevProps.currentCategory)){
          const category = this.props.currentCategory === '' ? 'aaa' : this.props.currentCategory;
          const result = await JSON.parse(JSON.stringify((await Query.getCategory(category))))
          const data = Array.from(new Set(result.category.products.map(JSON.stringify))).map(JSON.parse);
  
          this.setState({
            currentCategoryData: data             
          });   
        }
              
      }

    render() {

      const {choosenCurrency} = this.props;
      const {currentCategoryData} = this.state;
      const categoryName = this.props.currentCategory[0] && this.props.currentCategory[0].toUpperCase() + this.props.currentCategory.slice(1);

      const sampleProduct = currentCategoryData[0] && currentCategoryData[0].prices;
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
                 <div id={item.id} className='item' onMouseEnter={event => this.handleBoxToggle(event, item.id)} onMouseLeave={this.handleBoxToggle}>
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