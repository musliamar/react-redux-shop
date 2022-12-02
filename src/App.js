import './App.css';
import React from 'react';
import {Routes, Route} from 'react-router-dom';
import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';
import CategoryPage from './Components/Main/CategoryPage';
import CartPage from './Components/Main/CartPage';
import ProductPage from './Components/Main/ProductPage';
import { getCategoriesList, getCurrenciesList, getCategory } from './Queries';
import SmallCartIcon from './Images/small-cart-icon.svg';
import { connect } from "react-redux";
import { update, increaseNumberOfItemsInBag, decreaseNumberOfItemsInBag } from './Store';

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {   
      notificationArr: [],
      notificationKey: 0
    } 
    
    this.changeCurrency = this.changeCurrency.bind(this);
    this.openBox = this.openBox.bind(this);
    this.closeBox = this.closeBox.bind(this);
    this.addInBag = this.addInBag.bind(this);
    this.removeFromBag = this.removeFromBag.bind(this);
    this.increaseQuantityOfProduct = this.increaseQuantityOfProduct.bind(this);
    this.generateListOfAttributes = this.generateListOfAttributes.bind(this);
    this.generateDefaultAttributes = this.generateDefaultAttributes.bind(this);
    this.addNotification = this.showNotificationAndUpdateCart.bind(this);
    this.removeNotification = this.removeNotification.bind(this);
  }

 /* setState(state) {
    window.localStorage.setItem('redux-graphql-store', JSON.stringify(state));
    super.setState(state);
  } */

  // notification will show only if new product is added in bag
  // if choosen product is already in bag, addInBag function will only increase its quantity
  // and notification will not be shown 
  // if user add same product but with different attributes, notification will be shown

  showNotificationAndUpdateCart(props) {
    const { dispatch } = props;
    const {notificationKey, notificationArr} = this.state;
    const {removeNotification} = this;
    const {product, itemsInBag, numberOfItemsInBag} = props;
    const {brand, name} = product;

    const notification =
      <div key={notificationKey} className='message'>
        <p><img src={SmallCartIcon} className='cart-icon' alt='Cart icon in notification' /> 
        Product {brand} {name} has been added in bag.</p>
      </div>;

    this.setState({
      ...this.state, 
      notificationArr: notificationArr.concat(notification),
      notificationKey: notificationKey + 1
    });

    dispatch(update({name: 'itemsInBag', value: itemsInBag}))
    dispatch(update({name: 'numberOfItemsInBag', value: numberOfItemsInBag}))
    setTimeout(removeNotification, 3000);
  }

  removeNotification() {
    const {notificationArr, notificationKey} = this.state;
    const {length} = notificationArr;
    const newArr = length ? notificationArr.slice(0, length - 1) : [];

   this.setState({
      ...this.state,
      notificationArr: newArr,
      notificationKey: notificationKey - 1
    });
  }

  openBox(props){
    const { currentlyOpen, dispatch } = this.props;
    if(currentlyOpen === props){
      dispatch(update({name: 'currentlyOpen', value: ''}))
    }else{
      dispatch(update({name: 'currentlyOpen', value: props}))
    }
  }

  closeBox(){
    const { dispatch } = this.props;
    dispatch(update({name: 'currentlyOpen', value: ''}))
  }

  changeCurrency(currency) {   
    const { defaultCategory, dispatch } = this.props;
    const {sampleProductPrice} = defaultCategory;
    const {label: currencyLabel} = currency;
    let currencyToShow;
    for(const priceLabel in sampleProductPrice){
      const {currency} = sampleProductPrice[priceLabel];
      const {label} = currency;

      if(currencyLabel === label){
        currencyToShow = priceLabel;
      }
    }

    dispatch(update({name: 'choosenCurrency', value: currency}))
    dispatch(update({name: 'currentlyOpen', value: ''}))
    dispatch(update({name: 'currencyToShow', value: currencyToShow}))
  }

  selectAttribute(props){
    const { choosenAttributes, dispatch } = this.props;
    const {id, item} = props;
    let newArray = [];

    choosenAttributes.forEach((key) =>
        {if(Object.keys(key)[0] === id){
          newArray.push({[id]: item})
        }else{
          newArray.push({[Object.keys(key)[0]]: Object.values(key)[0]})
        }}
    )

    dispatch(update({name: 'choosenAttributes', value: newArray}))
  }

  generateDefaultAttributes(props){
    const { dispatch } = this.props
    const {category} = props;
    const choosenAttributes = [];
    Object.keys(props).forEach((item) => {
      if((item === 'attributes')){
        Object.values(props[item]).forEach((attribute) => {
          const {id, items} = attribute;
          const attributeToAdd = {[id]: items[0]}
          choosenAttributes.push(attributeToAdd)
        })
      }
    })

    dispatch(update({name: 'choosenAttributes', value: choosenAttributes}))
    dispatch(update({name: 'currentCategory', value: category}))
    
    return choosenAttributes;
  }

  generateCartIdOfItem(props){
    const {choosenAttributes, id} = props;
    const generateIdForCart = id.split('-')
    let transformedAttribute;

    choosenAttributes.map((attribute) => 
      {
      const {id, item} = attribute;
      if(id){
        transformedAttribute = {[id]: item}
      }else{
        transformedAttribute = attribute;
      }
      const cartIdArray = Object.keys(transformedAttribute).map((key) =>
      {
        const {id} = transformedAttribute[key];
        if(id === 'Yes'){
          const splitted = key.split(' ');
          const joined = splitted.join('-');
          generateIdForCart.push(joined.toLowerCase())
        }else if(!(id === 'No')){
          generateIdForCart.push(id.toLowerCase())
        }
        return generateIdForCart})
      return cartIdArray})
    return generateIdForCart.join('-'); 
  }

  generateListOfAttributes(attributes) {

    const {attributes: arrayOfAttributes, from, choosenAttributes: choosenAttributesArray, inStock} = attributes;
    
    return(arrayOfAttributes && arrayOfAttributes.map((attribute, index) => {

      let newAttribute = JSON.parse(JSON.stringify(attribute));
      let selectingEnabled = false;
      const {choosenAttributes: attributesFromState} = this.props;
      let choosenAttributes = from === 'product-page' ? attributesFromState : choosenAttributesArray;

      if(from === 'product-page'){inStock ? selectingEnabled = true : selectingEnabled = false}

      for(const choosenAttribute in choosenAttributes){
        const attributeToCompare = choosenAttributes[choosenAttribute];
        const {id} = attribute;
        if(attributeToCompare[id]){
          newAttribute.selectedValue = attributeToCompare[id];
        }
      }

      const {id: attributeId, name, items, type, selectedValue} = newAttribute;
      const {id: valueId} = selectedValue;

      return (<div key={attributeId} className='attribute'>
                <span className={inStock ? 'attribute-name' : 'attribute-name bleached-text'}>{name}:</span>
                <div className='attribute-options'>
                  {items && items.map((item) => {
                    const {id: itemId, value} = item;
                    return (
                      type === 'swatch'
                      ? (selectedValue && itemId === valueId) 
                        ? <span 
                            key={itemId} 
                            style={selectingEnabled? {cursor: 'pointer', backgroundColor: value} : {backgroundColor: value}} 
                            onClick={selectingEnabled ? () => {this.selectAttribute({id: attributeId, item: item})} : null} 
                            className={inStock ? 'attribute-option swatch selected' : 'attribute-option swatch opacity'}>
                          </span>
                        : <span 
                            key={itemId} 
                            style={selectingEnabled? {cursor: 'pointer', backgroundColor: value} : {backgroundColor: value}} 
                            onClick={selectingEnabled ? () => {this.selectAttribute({id: attributeId, item: item})} : null} 
                            className={inStock ? 'attribute-option swatch' : 'attribute-option swatch opacity'}>
                          </span>
                      : (selectedValue && itemId === valueId) 
                        ? <span 
                            key={itemId} style={selectingEnabled? {cursor: 'pointer'} : null} 
                            onClick={selectingEnabled ? () => {this.selectAttribute({id: attributeId, item: item})} : null} 
                            className={inStock ? 'attribute-option text selected' : 'attribute-option text out-of-stock'}>
                              {value}
                          </span>
                        : <span 
                            key={itemId} 
                            style={selectingEnabled? {cursor: 'pointer'} : null} 
                            onClick={selectingEnabled ? () => {this.selectAttribute({id: attributeId, item: item})} : null} 
                            className={inStock ? 'attribute-option text' : 'attribute-option text out-of-stock'}>
                              {value}
                          </span>
                    )})}
                </div>
              </div>)
    }))
  }
  
  increaseQuantityOfProduct(props){
    const {itemsInBag: items, dispatch} = this.props;
    items.forEach((item) => {
      let {cartId, quantity} = item;
      if(cartId === props){
        item.quantity = quantity + 1;
      }
    })
    
    dispatch(update({name: 'itemsInBag', value: items}))
    dispatch(increaseNumberOfItemsInBag())
  }

  removeFromBag(props){
    const {itemsInBag: items, dispatch} = this.props;
    items.forEach((item) => {
      let {cartId, quantity} = item;
      if(cartId === props){
        if(quantity > 1){
          item.quantity = quantity - 1;
        }else{
          items.splice(items.indexOf(item), 1);
        }
      }
    })

    dispatch(update({name: 'itemsInBag', value: items}))
    dispatch(decreaseNumberOfItemsInBag())
  }

  addInBag(props) {
    const {item} = props;
    const product = JSON.parse(JSON.stringify(item));
    const {id} = product;
    const {choosenAttributes, itemsInBag, numberOfItemsInBag, itemsInBag: items} = this.props;
    const {generateDefaultAttributes, increaseQuantityOfProduct, showNotificationAndUpdateCart} = this;

    product.choosenAttributes = choosenAttributes.length === 0 
                                ? generateDefaultAttributes(item) 
                                : choosenAttributes;

    product.cartId = this.generateCartIdOfItem({id: id, choosenAttributes: product.choosenAttributes})
    const {cartId} = product;

    if(!(items.length === 0)){
      let found = false;
      items.forEach((item) => {
        const {cartId: itemCartId} = item;
        if(itemCartId === cartId){
          found = true;
          increaseQuantityOfProduct(itemCartId);
        }
      })
      if(!found){
        product.quantity = 1;
        showNotificationAndUpdateCart({
          product: product,
          itemsInBag: [...itemsInBag, product],
          numberOfItemsInBag: numberOfItemsInBag + product.quantity        
        })
      }
    }else{
      product.quantity = 1;
      showNotificationAndUpdateCart({
        product: product,
        itemsInBag: [...itemsInBag, product],
        numberOfItemsInBag: numberOfItemsInBag + product.quantity        
      })
    }
  }

  async runOnFirstVisitWithoutLocalStorage(){
    const { dispatch } = this.props
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
      currentlyOpened,
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

    const {
      changeCurrency,
      openBox,
      closeBox,
      increaseQuantityOfProduct,
      removeFromBag,
      generateListOfAttributes,
      generateDefaultAttributes,
      addInBag} = this;

    return (
      <div className='App'>
        <Header 
        changeCurrency={changeCurrency} 
        openBox={openBox}
        closeBox={closeBox}
        increaseQuantityOfProduct={increaseQuantityOfProduct}
        removeFromBag={removeFromBag}
        sumOfPrices={sumOfPrices}
        generateListOfAttributes={generateListOfAttributes}
         />
        <main> 
        {currentlyOpened === 'minicart' ? <div id="overlay"></div> : null} 
          <Routes>
            <Route path="/">
              <Route index element={
                <CategoryPage 
                  addInBag={addInBag}/>
              } />
              <Route path=":category">
                <Route index element={
                  <CategoryPage 
                    addInBag={addInBag}/>
                } />
                <Route path=":product" element={
                  <ProductPage 
                    addInBag={addInBag}
                    generateListOfAttributes={generateListOfAttributes}
                    generateDefaultAttributes={generateDefaultAttributes}/>
                } />
              </Route>
              <Route 
              path='/cart'
              element={
                <CartPage 
                  increaseQuantityOfProduct={increaseQuantityOfProduct}
                  removeFromBag={removeFromBag}
                  generateListOfAttributes={generateListOfAttributes}
                  sumOfPrices={sumOfPrices}
                  />
              } />
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

const mapStateToProps = (state) => {
  return (state)
}

export default connect(mapStateToProps)(App);
