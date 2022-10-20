import './App.css';
import React from 'react';
import {Routes, Route} from 'react-router-dom';
import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';
import CategoryPage from './Components/Main/CategoryPage';
import CartPage from './Components/Main/CartPage';
import ProductPage from './Components/Main/ProductPage';
import Queries from './Queries';
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
      categoriesData: [],
      currenciesList: [],
      currentCategory: '',
      numberOfItemsInBag: 0,
      choosenAttributes: [],
      notificationArr: [],
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
    this.setState({...this.state, [props.name]: props.value, choosenAttributes: []});
  }

  // notification will show only if new product is added in bag
  // if choosen product is already in bag, addInBag function will only increase its quantity
  // and notification will not be shown 
  // if user add same product but with different attributes, notification will be shown

  addNotification(props) {
    const notification =
      <div key={this.state.notificationKey} className='message'>
        <p><img src={SmallCartIcon} style={{width: '20px', marginRight: 10}} alt='Cart icon in notification' /> 
        Product {props.product.brand} {props.product.name} has been added in bag.</p>
      </div>;

    this.setState({
      ...this.state,
      itemsInBag: props.itemsInBag,
      numberOfItemsInBag: props.numberOfItemsInBag,   
      notificationArr: this.state.notificationArr.concat(notification),
      notificationKey: this.state.notificationKey + 1
    });
    setTimeout(this.removeNotification, 3000);
  }

  removeNotification() {
    const arr = this.state.notificationArr;
    const arrLength = arr.length;
    const newArr = arrLength ? arr.slice(0, arrLength - 1) : [];

   this.setState({
      ...this.state,
      notificationArr: newArr,
      notificationKey: this.state.notificationKey - 1
    });
  }

  openBox(props){
    if(this.state.currentlyOpened === props){
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
    const sampleProductPrice = this.state.categoriesData[0] && this.state.categoriesData[0].products[0].prices;
    let currencyToShow;
    for(const priceLabel in sampleProductPrice){
      if(currency.label === sampleProductPrice[priceLabel].currency.label){
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
    const choosenAttributes = this.state.choosenAttributes;
    let newArray = [];
    choosenAttributes.forEach((key) =>
        {if(Object.keys(key)[0] === props.id){
          newArray.push({[props.id]: props.item})
        }else{
          newArray.push({[Object.keys(key)[0]]: Object.values(key)[0]})
        }}
    )
    this.setState({...this.state, choosenAttributes: newArray}); 
  }

  generateDefaultAttributes(props){
    const choosenAttributes = [];
    Object.keys(props).forEach((item) => {
      if((item === 'attributes')){
        Object.values(props[item]).forEach((attribute) => {
          const attributeToAdd = {[attribute.id]: attribute.items[0]}
          choosenAttributes.push(attributeToAdd)
        })
      }
    })
    this.setState({...this.state, choosenAttributes: choosenAttributes, currentCategory: props.category})
    return choosenAttributes;
  }

  generateCartIdOfItem(props){
    const choosenAttributes = props.choosenAttributes
    const generateIdForCart = props.id.split('-')
    let transformedAttribute;

    choosenAttributes.map((attribute) => 
      {if(attribute.id){
        transformedAttribute = {[attribute.id]: attribute.item}
      }else{
        transformedAttribute = attribute;
      }
      const cartIdArray = Object.keys(transformedAttribute).map((key) =>
      {if(transformedAttribute[key].id === 'Yes'){
          const splitted = key.split(' ');
          const joined = splitted.join('-');
          generateIdForCart.push(joined.toLowerCase())
        }else if(!(transformedAttribute[key].id === 'No')){
          generateIdForCart.push(transformedAttribute[key].id.toLowerCase())
        }
        return generateIdForCart})
      return cartIdArray})
    return generateIdForCart.join('-'); 
  }

  generateListOfAttributes(attributes) {
    return(attributes.attributes && attributes.attributes.map((attribute, index) => {
      let newAttribute = JSON.parse(JSON.stringify(attribute));
      let selectingEnabled = false;
      const attributesFromState = this.state.choosenAttributes;
      let choosenAttributes = attributes.from === 'product-page' ? attributesFromState : attributes.choosenAttributes;
      if(attributes.from === 'product-page'){
        selectingEnabled = true;
      }
      for(const choosenAttribute in choosenAttributes){
        const attributeToCompare = choosenAttributes[choosenAttribute];
        const id = attribute.id;
        if(attributeToCompare[id]){
          newAttribute.selectedValue = attributeToCompare[id];
        }
      }
       return (<div key={attribute.id} className='attribute'>
                <span className='attribute-name'>{attribute.name}:</span>
                <div className='attribute-options'>
                  {attribute.items && attribute.items.map((item) => {
                    const color = item.value;
                    return (
                      attribute.type === 'swatch'
                      ? (newAttribute.selectedValue && item.id === newAttribute.selectedValue.id) 
                        ? <span key={item.id} style={selectingEnabled? {cursor: 'pointer', backgroundColor: color} : {backgroundColor: color}} onClick={selectingEnabled ? () => {this.selectAttribute({id: attribute.id, item: item})} : null} className='attribute-option swatch selected'></span>
                        : <span key={item.id} style={selectingEnabled? {cursor: 'pointer', backgroundColor: color} : {backgroundColor: color}} onClick={selectingEnabled ? () => {this.selectAttribute({id: attribute.id, item: item})} : null} className='attribute-option swatch'></span>
                      : (newAttribute.selectedValue && item.id === newAttribute.selectedValue.id) 
                        ? <span key={item.id} style={selectingEnabled? {cursor: 'pointer'} : null} onClick={selectingEnabled ? () => {this.selectAttribute({id: attribute.id, item: item})} : null} className='attribute-option text selected'>{item.value}</span>
                        : <span key={item.id} style={selectingEnabled? {cursor: 'pointer'} : null} onClick={selectingEnabled ? () => {this.selectAttribute({id: attribute.id, item: item})} : null} className='attribute-option text'>{item.value}</span>
                    )})}
                </div>
              </div>)
    }))
  }
  
  increaseQuantityOfProduct(props){
    const items = this.state.itemsInBag;
    items.forEach((item) => {
      if(item.cartId === props){
        item.quantity = item.quantity + 1;
      }
    })
    this.setState({
      ...this.state,
      itemsInBag: items,
      numberOfItemsInBag: this.state.numberOfItemsInBag + 1         
    })
  }

  removeFromBag(props){
    const items = this.state.itemsInBag;
    items.forEach((item) => {
      if(item.cartId === props){
        if(item.quantity > 1){
          item.quantity = item.quantity - 1;
        }else{
          items.splice(items.indexOf(item), 1);
        }
      }
    })
    this.setState({
      ...this.state,
      itemsInBag: items,
      numberOfItemsInBag: this.state.numberOfItemsInBag - 1         
    })
  }

  addInBag(props) {
    const product = JSON.parse(JSON.stringify(props.item));;
    product.choosenAttributes = this.state.choosenAttributes.length === 0 
                                ? this.generateDefaultAttributes(props.item) 
                                : this.state.choosenAttributes;

    product.cartId = this.generateCartIdOfItem({id: product.id, choosenAttributes: product.choosenAttributes})
    const items = this.state.itemsInBag;

    if(!(items.length === 0)){
      let found = false;
      items.forEach((item) => {
        if(item.cartId === product.cartId){
          found = true;
          this.increaseQuantityOfProduct(item.cartId);
        }
      })
      if(!found){
        product.quantity = 1;
        this.addNotification({
          product: product,
          itemsInBag: [...this.state.itemsInBag, product],
          numberOfItemsInBag: this.state.numberOfItemsInBag + product.quantity        
        })
      }
    }else{
      product.quantity = 1;
      this.addNotification({
        product: product,
        itemsInBag: [...this.state.itemsInBag, product],
        numberOfItemsInBag: this.state.numberOfItemsInBag + product.quantity        
      })
    }
  }

  async runOnFirstVisitWithoutLocalStorage(){
    const categories = await Queries.getCategoriesList();
    const currencies = await Queries.getAllCurrencies();
    const categoriesList = categories.categories;
    const currenciesList = currencies.currencies;

    let categoriesData = [];

    for(let category in categoriesList){
      const products = await Queries.getCategory(categoriesList[category].name)
      categoriesData.push({name: categoriesList[category].name, products: products.category.products});
    }

    const sampleProductPrice = categoriesData[0].products[0].prices;
    let currencyToShow;

    for(const priceLabel in sampleProductPrice){
      if(currenciesList[0].label === sampleProductPrice[priceLabel].currency.label){
         currencyToShow = priceLabel;
      }
    }

    this.setState({
      categoriesData: categoriesData, 
      currenciesList: currenciesList,
      currencyToShow: currencyToShow,
      choosenCurrency: currenciesList[0],
      numberOfItemsInBag: 0, 
      itemsInBag: [],
      currentlyOpened: '',
      choosenAttributes: []             
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
      let target = event.relatedTarget || event.toElement;
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
    const {itemsInBag} = this.state;

    for(const item in itemsInBag){
        itemsInBag[item].sumPriceOfItem = itemsInBag[item].prices[this.state.currencyToShow].amount * itemsInBag[item].quantity;
        itemsInBag[item].sumPriceOfItemFixed = itemsInBag[item].sumPriceOfItem.toFixed(2);
        sumOfAllPricesRaw = sumOfAllPricesRaw + itemsInBag[item].sumPriceOfItem;
    }

    const sumOfPrices = sumOfAllPricesRaw.toFixed(2);
    const notifications = this.state.notificationArr;

    return (
    <div className='App'>
        <Header 
        currenciesList={this.state.currenciesList}
        categoriesData={this.state.categoriesData}
        changeCurrency={this.changeCurrency} 
        currentCategory={this.state.currentCategory}
        currentlyOpened={this.state.currentlyOpened}
        openBox={this.openBox}
        numberOfItemsInBag={this.state.numberOfItemsInBag}
        itemsInBag={this.state.itemsInBag}
        currencyToShow={this.state.currencyToShow}
        closeBox={this.closeBox}
        increaseQuantityOfProduct={this.increaseQuantityOfProduct}
        removeFromBag={this.removeFromBag}
        sumOfPrices={sumOfPrices}
        generateListOfAttributes={this.generateListOfAttributes}
        choosenCurrency={this.state.choosenCurrency} />
        <main> 
        {this.state.currentlyOpened === 'minicart' ? <div id="overlay"></div> : null} 
        <Routes>
          <Route path="/">
            <Route index element={
              <CategoryPage 
                categoriesData={this.state.categoriesData}
                updateStateFromChild={this.updateStateFromChild}
                choosenCurrency={this.state.choosenCurrency} 
                currencyToShow={this.state.currencyToShow}
                addInBag={this.addInBag}/>
            } />
              <Route path=":category">
                <Route index element={
                  <CategoryPage 
                    choosenCurrency={this.state.choosenCurrency} 
                    categoriesData={this.state.categoriesData}
                    currencyToShow={this.state.currencyToShow}
                    updateStateFromChild={this.updateStateFromChild}
                    currentCategory={this.currentCategory}
                    addInBag={this.addInBag}/>
                } />
                <Route path=":product" element={
                  <ProductPage 
                    choosenCurrency={this.state.choosenCurrency} 
                    choosenAttributes={this.state.choosenAttributes}
                    currencyToShow={this.state.currencyToShow}
                    numberOfItemsInBag={this.state.numberOfItemsInBag}
                    categoriesData={this.state.categoriesData}
                    updateStateFromChild={this.updateStateFromChild}
                    addInBag={this.addInBag}
                    generateListOfAttributes={this.generateListOfAttributes}
                    generateDefaultAttributes={this.generateDefaultAttributes}/>
                } />
              </Route>
              <Route 
              path='/cart'
              element={
                <CartPage 
                  choosenCurrency={this.state.choosenCurrency} 
                  increaseQuantityOfProduct={this.increaseQuantityOfProduct}
                  removeFromBag={this.removeFromBag}
                  generateListOfAttributes={this.generateListOfAttributes}
                  itemsInBag={this.state.itemsInBag}
                  currencyToShow={this.state.currencyToShow}
                  sumOfPrices={sumOfPrices}
                  numberOfItemsInBag={this.state.numberOfItemsInBag}/>
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
