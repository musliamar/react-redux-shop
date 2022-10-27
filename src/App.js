import './App.css';
import React from 'react';
import {Routes, Route} from 'react-router-dom';
import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';
import CategoryPage from './Components/Main/CategoryPage';
import CartPage from './Components/Main/CartPage';
import ProductPage from './Components/Main/ProductPage';
import {getCategoriesList, getCurrenciesList, getCategory} from './Queries';
import SmallCartIcon from './Images/small-cart-icon.svg';

class App extends React.Component {

  constructor(props) {
    super(props);

    const localStorage = JSON.parse(window.localStorage.getItem('scandiwebAmarMusliStoreState'));

    this.state = !(localStorage === null) 
    ? localStorage
    :  {   
      choosenCurrency: '',
      currencyToShow: 0,
      itemsInBag: [],
      currentlyOpened: '',
      categoriesList: [],
      currenciesList: [],
      currentCategory: '',
      defaultCategory: '',
      numberOfItemsInBag: 0,
      notificationArr: [],
      choosenAttributes: [],
      notificationKey: 0
    } 
    
    this.updateStateFromChild = this.updateStateFromChild.bind(this);
    this.changeCurrency = this.changeCurrency.bind(this);
    this.openBox = this.openBox.bind(this);
    this.closeBox = this.closeBox.bind(this);
    this.addInBag = this.addInBag.bind(this);
    this.removeFromBag = this.removeFromBag.bind(this);
    this.increaseQuantityOfProduct = this.increaseQuantityOfProduct.bind(this);
    this.generateListOfAttributes = this.generateListOfAttributes.bind(this);
    this.generateDefaultAttributes = this.generateDefaultAttributes.bind(this);
    this.addNotification = this.addNotification.bind(this);
    this.removeNotification = this.removeNotification.bind(this);
  }

  setState(state) {
    window.localStorage.setItem('scandiwebAmarMusliStoreState', JSON.stringify(state));
    super.setState(state);
  }

  updateStateFromChild(props){
    const {value, name} = props;
    this.setState({...this.state, [name]: value, choosenAttributes: []});
  }

  // notification will show only if new product is added in bag
  // if choosen product is already in bag, addInBag function will only increase its quantity
  // and notification will not be shown 
  // if user add same product but with different attributes, notification will be shown

  addNotification(props) {
    const {notificationKey, notificationArr} = this.state;
    const {removeNotification} = this;
    const {product, itemsInBag, numberOfItemsInBag} = props;
    const {brand, name} = product;

    const notification =
      <div key={notificationKey} className='message'>
        <p><img src={SmallCartIcon} style={{width: '20px', marginRight: 10}} alt='Cart icon in notification' /> 
        Product {brand} {name} has been added in bag.</p>
      </div>;

    this.setState({
      ...this.state,
      itemsInBag: itemsInBag,
      numberOfItemsInBag: numberOfItemsInBag,   
      notificationArr: notificationArr.concat(notification),
      notificationKey: notificationKey + 1
    });
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
    const {currentlyOpened} = this.state;
    if(currentlyOpened === props){
      this.setState({
        ...this.state,
        currentlyOpened: '',
        });
    }else{
      this.setState({
        ...this.state,
        currentlyOpened: props,
        });
    }
  }

  closeBox(){
    this.setState({
      ...this.state,
      currentlyOpened: '',
    });
  }

  changeCurrency(currency) {   
    const {defaultCategory} = this.state;
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
    this.setState({
      ...this.state,
      choosenCurrency: currency,
      currentlyOpened: '',
      currencyToShow: currencyToShow
    });
  }

  selectAttribute(props){
    const {choosenAttributes} = this.state;
    const {id, item} = props;
    let newArray = [];

    choosenAttributes.forEach((key) =>
        {if(Object.keys(key)[0] === id){
          newArray.push({[id]: item})
        }else{
          newArray.push({[Object.keys(key)[0]]: Object.values(key)[0]})
        }}
    )
    this.setState({...this.state, choosenAttributes: newArray}); 
  }

  generateDefaultAttributes(props){
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
    this.setState({...this.state, choosenAttributes: choosenAttributes, currentCategory: category})
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

    const {attributes: arrayOfAttributes, from, choosenAttributes: choosenAttributesArray} = attributes;
    
    return(arrayOfAttributes && arrayOfAttributes.map((attribute, index) => {

      let newAttribute = JSON.parse(JSON.stringify(attribute));
      let selectingEnabled = false;
      const {choosenAttributes: attributesFromState} = this.state;
      let choosenAttributes = from === 'product-page' ? attributesFromState : choosenAttributesArray;

      if(from === 'product-page'){selectingEnabled = true;}

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
                <span className='attribute-name'>{name}:</span>
                <div className='attribute-options'>
                  {items && items.map((item) => {
                    const {id: itemId, value} = item;
                    return (
                      type === 'swatch'
                      ? (selectedValue && itemId === valueId) 
                        ? <span key={itemId} style={selectingEnabled? {cursor: 'pointer', backgroundColor: value} : {backgroundColor: value}} onClick={selectingEnabled ? () => {this.selectAttribute({id: attributeId, item: item})} : null} className='attribute-option swatch selected'></span>
                        : <span key={itemId} style={selectingEnabled? {cursor: 'pointer', backgroundColor: value} : {backgroundColor: value}} onClick={selectingEnabled ? () => {this.selectAttribute({id: attributeId, item: item})} : null} className='attribute-option swatch'></span>
                      : (selectedValue && itemId === valueId) 
                        ? <span key={itemId} style={selectingEnabled? {cursor: 'pointer'} : null} onClick={selectingEnabled ? () => {this.selectAttribute({id: attributeId, item: item})} : null} className='attribute-option text selected'>{value}</span>
                        : <span key={itemId} style={selectingEnabled? {cursor: 'pointer'} : null} onClick={selectingEnabled ? () => {this.selectAttribute({id: attributeId, item: item})} : null} className='attribute-option text'>{value}</span>
                    )})}
                </div>
              </div>)
    }))
  }
  
  increaseQuantityOfProduct(props){
    const {itemsInBag: items, numberOfItemsInBag} = this.state;
    items.forEach((item) => {
      let {cartId, quantity} = item;
      if(cartId === props){
        item.quantity = quantity + 1;
      }
    })
    this.setState({
      ...this.state,
      itemsInBag: items,
      numberOfItemsInBag: numberOfItemsInBag + 1         
    })
  }

  removeFromBag(props){
    const {itemsInBag: items, numberOfItemsInBag} = this.state;
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
    this.setState({
      ...this.state,
      itemsInBag: items,
      numberOfItemsInBag: numberOfItemsInBag - 1         
    })
  }

  addInBag(props) {
    const {item} = props;
    const product = JSON.parse(JSON.stringify(item));
    const {id} = product;
    const {choosenAttributes, itemsInBag, numberOfItemsInBag, itemsInBag: items} = this.state;
    const {generateDefaultAttributes, increaseQuantityOfProduct, addNotification} = this;

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
        addNotification({
          product: product,
          itemsInBag: [...itemsInBag, product],
          numberOfItemsInBag: numberOfItemsInBag + product.quantity        
        })
      }
    }else{
      product.quantity = 1;
      addNotification({
        product: product,
        itemsInBag: [...itemsInBag, product],
        numberOfItemsInBag: numberOfItemsInBag + product.quantity        
      })
    }
  }

  async runOnFirstVisitWithoutLocalStorage(){
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

    this.setState({
      currenciesList: currenciesList,
      categoriesList: categoriesList,
      currencyToShow: currencyToShow,
      defaultCategory: {name: defaultCategoryName, sampleProductPrice: sampleProductPrice},
      choosenCurrency: currenciesList[0],
      numberOfItemsInBag: 0, 
      itemsInBag: [],
      currentlyOpened: ''          
    })
  }
 
  async componentDidMount() {
    const localStorage = JSON.parse(window.localStorage.getItem('scandiwebAmarMusliStoreState'));
      if(!localStorage || (localStorage === null)){
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

    let sumOfAllPricesRaw = 0;
    const {itemsInBag, currencyToShow} = this.state;

    for(const item in itemsInBag){
        const {prices, quantity} = itemsInBag[item];
        itemsInBag[item].sumPriceOfItem = prices[currencyToShow].amount * quantity;
        itemsInBag[item].sumPriceOfItemFixed = itemsInBag[item].sumPriceOfItem.toFixed(2);
        sumOfAllPricesRaw = sumOfAllPricesRaw + itemsInBag[item].sumPriceOfItem;
    }

    const sumOfPrices = sumOfAllPricesRaw.toFixed(2);
    const {
      currenciesList,
      categoriesList,
      currentCategory,
      currentlyOpened,
      numberOfItemsInBag,
      choosenCurrency,
      choosenAttributes,
      defaultCategory,
      notificationArr: notifications} = this.state;
      
    const {
      changeCurrency,
      openBox,
      closeBox,
      increaseQuantityOfProduct,
      removeFromBag,
      generateListOfAttributes,
      generateDefaultAttributes,
      updateStateFromChild,
      addInBag} = this;

    return (
    <div className='App'>
        <Header 
        currenciesList={currenciesList}
        categoriesList={categoriesList}
        changeCurrency={changeCurrency} 
        currentCategory={currentCategory}
        currentlyOpened={currentlyOpened}
        openBox={openBox}
        numberOfItemsInBag={numberOfItemsInBag}
        itemsInBag={itemsInBag}
        currencyToShow={currencyToShow}
        closeBox={closeBox}
        increaseQuantityOfProduct={increaseQuantityOfProduct}
        removeFromBag={removeFromBag}
        sumOfPrices={sumOfPrices}
        generateListOfAttributes={generateListOfAttributes}
        choosenCurrency={choosenCurrency} />
        <main> 
        {currentlyOpened === 'minicart' ? <div id="overlay"></div> : null} 
        <Routes>
          <Route path="/">
            <Route index element={
              <CategoryPage 
                defaultCategory={defaultCategory}
                updateStateFromChild={updateStateFromChild}
                choosenCurrency={choosenCurrency} 
                currencyToShow={currencyToShow}
                addInBag={addInBag}/>
            } />
              <Route path=":category">
                <Route index element={
                  <CategoryPage 
                    choosenCurrency={choosenCurrency} 
                    currencyToShow={currencyToShow}
                    updateStateFromChild={updateStateFromChild}
                    currentCategory={currentCategory}
                    addInBag={addInBag}/>
                } />
                <Route path=":product" element={
                  <ProductPage 
                    choosenCurrency={choosenCurrency} 
                    choosenAttributes={choosenAttributes}
                    currencyToShow={currencyToShow}
                    numberOfItemsInBag={numberOfItemsInBag}
                    addInBag={addInBag}
                    generateListOfAttributes={generateListOfAttributes}
                    generateDefaultAttributes={generateDefaultAttributes}/>
                } />
              </Route>
              <Route 
              path='/cart'
              element={
                <CartPage 
                  choosenCurrency={choosenCurrency} 
                  increaseQuantityOfProduct={increaseQuantityOfProduct}
                  removeFromBag={removeFromBag}
                  generateListOfAttributes={generateListOfAttributes}
                  itemsInBag={itemsInBag}
                  currencyToShow={currencyToShow}
                  sumOfPrices={sumOfPrices}
                  numberOfItemsInBag={numberOfItemsInBag}/>
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
}}

export default App;
