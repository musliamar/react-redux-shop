import './App.css';
import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';
import CategoryPage from './Components/Main/CategoryPage/CategoryPage';
import CartPage from './Components/Main/CartPage/CartPage';
import ProductPage from './Components/Main/ProductPage/ProductPage';
import { useSelector, useDispatch } from "react-redux";
import { update } from './Store';
import { getCategoriesList, getCurrenciesList, getCategory } from './Queries'
import parse from 'html-react-parser';

function App() {

  const dispatch = useDispatch();
  const categoriesList = useSelector((state) => state.categoriesList)
  const currenciesList = useSelector((state) => state.currenciesList)
  const currentlyOpen = useSelector((state) => state.currentlyOpen)
  const notificationArr = useSelector((state) => state.notificationArr)
  const [notificationsArray, setNotificationsArray] = useState({});
  
  const runOnFirstVisitWithoutLocalStorage = async () => {
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

    dispatch(update({name: 'categoriesList', value: categoriesList}))
    dispatch(update({name: 'currenciesList', value: currenciesList}))
    dispatch(update({name: 'currencyToShow', value: currencyToShow}))
    dispatch(update({name: 'choosenCurrency', value: currenciesList[0]}))
    dispatch(update({name: 'defaultCategory', value: {name: defaultCategoryName, sampleProductPrice: sampleProductPrice}}))
  }
 
  useEffect(() => {
      if(currenciesList.length === 0 && categoriesList.length === 0){
        runOnFirstVisitWithoutLocalStorage();
      }

      window.onmouseout = (event) => {
        const {relatedTarget, toElement} = event;
        let target = relatedTarget || toElement;
  
        if (!target || target.nodeName === "HTML") {
          setNotificationsArray({
            ...notificationsArray,
            notificationArr: [],
            notificationKey: 0
          })
        }
      }

  })

    const parsedNotifications = notificationArr.map((n) => parse(n))

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

export default App;
