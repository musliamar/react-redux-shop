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
import parse from 'html-react-parser';

class App extends React.Component {

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

    const { currentlyOpen, notificationArr: notifications } = this.props;
    const parsedNotifications = notifications.map((n) => parse(n))

    return (
      <div className='App'>
        <Header />
        <main> 
        {currentlyOpen === 'minicart' && <div id="overlay"></div>} 
          <Routes>
            <Route path="/">
              <Route index element={ <CategoryPage /> } />
              <Route path=":category">
                <Route index element={ <CategoryPage /> } />
                <Route path=":product" element={ <ProductPage /> } />
              </Route>
              <Route path='/cart' element={ <CartPage /> } />
            </Route>
          </Routes>
          <div className='notification'>
            <div className='container'>
              {parsedNotifications}
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
  currentlyOpen: state.currentlyOpen,
  notificationArr: state.notificationArr
})

const mapDispatchToProps = () => ({ 
  update
});

export default connect(mapStateToProps, mapDispatchToProps())(App);
