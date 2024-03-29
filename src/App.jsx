import './App.css';
import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';
import CategoryPage from './Components/Main/CategoryPage/CategoryPage';
import CartPage from './Components/Main/CartPage/CartPage';
import ProductPage from './Components/Main/ProductPage/ProductPage';
import { update } from './Store';
import { getCategoriesList, getCurrenciesList, getCategory } from './Queries';
import SmallCartIcon from './Images/small-cart-icon.svg';

function App() {
  const dispatch = useDispatch();
  const categoriesList = useSelector((state) => state.categoriesList);
  const currenciesList = useSelector((state) => state.currenciesList);
  const currencyToShow = useSelector((state) => state.currencyToShow);
  const currentlyOpen = useSelector((state) => state.currentlyOpen);
  const notificationArr = useSelector((state) => state.notificationArr);
  const itemsInBag = useSelector((state) => state.itemsInBag);

  const runOnFirstVisitWithoutLocalStorage = async () => {
    const categories = await getCategoriesList();
    const currencies = await getCurrenciesList();
    const { categories: newCategoriesList } = categories;
    const { currencies: newCurrenciesList } = currencies;
    const { name: defaultCategoryName } = newCategoriesList[0];
    const defaultCategoryResult = await getCategory(defaultCategoryName);
    const { category: defaultCategory } = defaultCategoryResult;
    const { products: defaultCategoryProducts } = defaultCategory;
    const { prices: sampleProductPrice } = defaultCategoryProducts[0];
    const { label: defaultCurrencyLabel } = newCurrenciesList[0];

    const newCurrencyToShow = Object.values(sampleProductPrice)
      .findIndex((sample) => defaultCurrencyLabel === sample.currency.label);

    dispatch(update({ name: 'categoriesList', value: newCategoriesList }));
    dispatch(update({ name: 'currenciesList', value: newCurrenciesList }));
    dispatch(update({ name: 'currencyToShow', value: newCurrencyToShow }));
    dispatch(update({ name: 'choosenCurrency', value: newCurrenciesList[0] }));
    dispatch(update({ name: 'defaultCategory', value: { name: defaultCategoryName, sampleProductPrice } }));
  };

  useEffect(() => {
    if (currenciesList.length === 0 && categoriesList.length === 0) {
      runOnFirstVisitWithoutLocalStorage();
    }

    window.onmouseout = (event) => {
      const { relatedTarget, toElement } = event;
      const target = relatedTarget || toElement;
      if (!target || target.nodeName === 'HTML') {
        dispatch(update({ name: 'notificationArr', value: [] }));
      }
    };
  });

  useEffect(() => {
    const items = [...itemsInBag];
    let sumOfAllPricesRaw = 0;

    Object.values(items).forEach((item) => {
      const { prices, quantity } = item;
      const sumPriceOfItem = prices[currencyToShow].amount * quantity;
      sumOfAllPricesRaw += sumPriceOfItem;
    });

    dispatch(update({ name: 'sumOfPrices', value: sumOfAllPricesRaw.toFixed(2) }));
  }, [itemsInBag]);

  useEffect(() => {
    const startFetch = setTimeout(() => {
      const newArr = notificationArr.length
        ? notificationArr.slice(1)
        : [];

      dispatch(update({ name: 'notificationArr', value: newArr }));
    }, 2000);
    return () => clearTimeout(startFetch);
  }, [notificationArr.length]);

  const showNotifications = notificationArr.map((notification) => {
    const { brand, name, cartId } = notification;
    return (
      <div key={cartId} className="message">
        <p>
          <img src={SmallCartIcon} className="cart-icon" alt="Cart icon in notification" />
          Product
          {' '}
          {brand}
          {' '}
          {name}
          {' '}
          has been added in bag.
        </p>
      </div>
    );
  }).reverse();

  return (
    <div className="App">
      <Header />
      <main>
        {currentlyOpen === 'minicart' && <div id="overlay" />}
        <Routes>
          <Route path="/">
            <Route index element={<CategoryPage />} />
            <Route path=":category">
              <Route index element={<CategoryPage />} />
              <Route path=":product" element={<ProductPage />} />
            </Route>
            <Route path="/cart" element={<CartPage />} />
          </Route>
        </Routes>
        <div className="notification">
          <div className="container">
            {showNotifications}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
