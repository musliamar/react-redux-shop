import './App.css';
import React from 'react';
import {Routes, Route} from 'react-router-dom';
import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';
import CategoryPage from './Components/Main/CategoryPage/CategoryPage';
import CartPage from './Components/Main/CartPage/CartPage';
import ProductPage from './Components/Main/ProductPage/ProductPage';
import { connect } from "react-redux";
import { update } from './Store';
import { getCategoriesList, getCurrenciesList, getCategory } from './Queries'

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {   
      notificationArr: [],
      notificationKey: 0
    } 
  }

 /* setState(state) {
    window.localStorage.setItem('redux-store', JSON.stringify(state));
    super.setState(state);
  } */

  // notification will show only if new product is added in bag
  // if choosen product is already in bag, addInBag function will only increase its quantity
  // and notification will not be shown 
  // if user add same product but with different attributes, notification will be shown

  async runOnFirstVisitWithoutLocalStorage(){
    const { update } = this.props
    const categories = await getCategoriesList();
    const currencies = await getCurrenciesList();
    const {categories: categoriesList} = categories;
    const {currencies: currenciesList} = currencies;
    const {name: defaultCategoryName} = categoriesList[0];
    const defaultCategoryResult = await getCategory(defaultCategoryName)
    const {category: defaultCategory} = defaultCategoryResult;
    const {products: defaultCategoryProducts} = defaultCategory;
    const {prices: sampleProductPrice} = defaultCategoryProducts[0];
    const {label: defaultCurrencyLabel} = currenciesList[0];
    let currencyToShow;

    for(const priceLabel in sampleProductPrice){
      const {currency} = sampleProductPrice[priceLabel];
      const {label} = currency;
      if(defaultCurrencyLabel === label){
         currencyToShow = priceLabel;
      }
    }

    update({name: 'categoriesList', value: categoriesList})
    update({name: 'currenciesList', value: currenciesList})
    update({name: 'currencyToShow', value: currencyToShow})
    update({name: 'choosenCurrency', value: currenciesList[0]})
    update({name: 'defaultCategory', value: {name: defaultCategoryName, sampleProductPrice: sampleProductPrice}})
  }
 
  async componentDidMount() {
    const { currenciesList, categoriesList } = this.props
      if(currenciesList.length === 0 && categoriesList.length === 0){
        this.runOnFirstVisitWithoutLocalStorage();
      }
  }

  componentDidUpdate(){
    window.onmouseout = (event) => {
      const {relatedTarget, toElement} = event;
      let target = relatedTarget || toElement;

      if (!target || target.nodeName === "HTML") {
        this.setState({
          ...this.state,
          notificationArr: [],
          notificationKey: 0
        })
      }
    }
  }

  render() {

    const {
      itemsInBag, 
      currencyToShow,
      currentlyOpen,
    } = this.props;
    
    const { notificationArr: notifications } = this.state

    let sumOfAllPricesRaw = 0;

    for(const item in itemsInBag){
        const {prices, quantity} = itemsInBag[item];
        itemsInBag[item].sumPriceOfItem = prices[currencyToShow].amount * quantity;
        itemsInBag[item].sumPriceOfItemFixed = itemsInBag[item].sumPriceOfItem.toFixed(2);
        sumOfAllPricesRaw = sumOfAllPricesRaw + itemsInBag[item].sumPriceOfItem;
    }

    const sumOfPrices = sumOfAllPricesRaw.toFixed(2);

    return (
      <div className='App'>
        <Header sumOfPrices={sumOfPrices} />
        <main> 
        {currentlyOpen === 'minicart' && <div id="overlay"></div>} 
          <Routes>
            <Route path="/">
              <Route index element={ <CategoryPage /> } />
              <Route path=":category">
                <Route index element={ <CategoryPage /> } />
                <Route path=":product" element={ <ProductPage /> } />
              </Route>
              <Route path='/cart' element={ <CartPage sumOfPrices={sumOfPrices} /> } />
            </Route>
          </Routes>
          <div className='notification'>
            <div className='container'>
              {notifications}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  currenciesList: state.currenciesList,
  categoriesList: state.categoriesList,
  itemsInBag: state.itemsInBag,
  currencyToShow: state.currencyToShow,
  currentlyOpen: state.currentlyOpen
})

const mapDispatchToProps = () => ({ 
  update
});

export default connect(mapStateToProps, mapDispatchToProps())(App);
