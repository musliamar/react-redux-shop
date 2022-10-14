import './App.css';
import React from 'react';
import {Routes, Route} from 'react-router-dom';
import Header from './Components/Header/Header';
import CategoryPage from './Components/Main/CategoryPage';
import CartPage from './Components/Main/CartPage';
import ProductPage from './Components/Main/ProductPage';
import Queries from './Queries';

class App extends React.PureComponent {

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
      choosenAttributes: []
    } 
    
    this.changeCurrentCategory = this.changeCurrentCategory.bind(this);
    this.changeCurrency = this.changeCurrency.bind(this);
    this.openBox = this.openBox.bind(this);
    this.closeBox = this.closeBox.bind(this);
    this.addInBag = this.addInBag.bind(this);
    this.removeFromBag = this.removeFromBag.bind(this);
    this.increaseQuantityOfProduct = this.increaseQuantityOfProduct.bind(this);
    this.generateListOfAttributes = this.generateListOfAttributes.bind(this);
    this.resetChoosenAttributes = this.resetChoosenAttributes.bind(this);
    this.generateDefaultAttributes = this.generateDefaultAttributes.bind(this);
    this.runOnFirstVisitWithoutLocalStorage = this.runOnFirstVisitWithoutLocalStorage.bind(this);
  }

  setState(state) {
    window.localStorage.setItem('scandiwebAmarMusliStoreState', JSON.stringify(state));
    super.setState(state);
  }

  resetChoosenAttributes(){
    this.setState({
      ...this.state,
      choosenAttributes: []
    });
  }

  changeCurrentCategory(category) {   
    this.setState({
      ...this.state,
      currentCategory: category
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
    this.setState({
      ...this.state,
      choosenCurrency: currency,
      currentlyOpened: '',
    });
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
          items.splice(item, 1);
        }
      }
    })
    this.setState({
      ...this.state,
      itemsInBag: items,
      numberOfItemsInBag: this.state.numberOfItemsInBag - 1         
    })
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
    this.setState({...this.state, choosenAttributes: choosenAttributes})
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

  addInBag(props) {
    const product = props.item;
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
      this.setState({
        ...this.state,
        itemsInBag: [...this.state.itemsInBag, product],
        numberOfItemsInBag: this.state.numberOfItemsInBag + product.quantity        
      })
      }
    }else{
      product.quantity = 1;
      this.setState({
        ...this.state,
        itemsInBag: [...this.state.itemsInBag, product],
        numberOfItemsInBag: this.state.numberOfItemsInBag + product.quantity        
      })
    }
  }

  setStateOnLoad(props){
    const localStorage = JSON.parse(window.localStorage.getItem('scandiwebAmarMusliStoreState'));
    let newState = {};
    if(!(localStorage === null)){
      for(const singleInStorage in localStorage){
          for(const single in props){
            if(single === singleInStorage){ 
              newState[singleInStorage] = localStorage[singleInStorage]
            }
          }
      }
    }else{
      newState = props;
    }
    this.setState(newState);
  }

  selectAttribute(props){
    const choosenAttributes = this.state.choosenAttributes;
    const toCompare = {[props.id]: props.item}
    let newArray = [];
    choosenAttributes.map((key) =>
        {if(Object.keys(key)[0] === props.id){
          newArray.push({[props.id]: props.item})
        }else{
          newArray.push({[Object.keys(key)[0]]: Object.values(key)[0]})
        }}
    )
    /* const finalArray = [...new Map(choosenAttributes.map((a) => [a.id, a])).values()]; */
    this.setState({...this.state, choosenAttributes: newArray}); 
  }

  generateListOfAttributes(attributes) {
    return(attributes.attributes && attributes.attributes.map((attribute, index) => {
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
          attribute.selectedValue = attributeToCompare[id];
        }
      }
       return (<div key={attribute.id} className='attribute'>
                <span className='attribute-name'>{attribute.name}:</span>
                <div className='attribute-options'>
                  {attribute.items && attribute.items.map((item) => {
                    const color = item.value;
                    return (
                      attribute.type === 'swatch'
                      ? (attribute.selectedValue && item.id === attribute.selectedValue.id) 
                        ? <span key={item.id} style={selectingEnabled? {cursor: 'pointer', backgroundColor: color} : {backgroundColor: color}} onClick={selectingEnabled ? () => {this.selectAttribute({id: attribute.id, item: item})} : null} className='attribute-option swatch selected'></span>
                        : <span key={item.id} style={selectingEnabled? {cursor: 'pointer', backgroundColor: color} : {backgroundColor: color}} onClick={selectingEnabled ? () => {this.selectAttribute({id: attribute.id, item: item})} : null} className='attribute-option swatch'></span>
                      : (attribute.selectedValue && item.id === attribute.selectedValue.id) 
                        ? <span key={item.id} style={selectingEnabled? {cursor: 'pointer'} : null} onClick={selectingEnabled ? () => {this.selectAttribute({id: attribute.id, item: item})} : null} className='attribute-option text selected'>{item.value}</span>
                        : <span key={item.id} style={selectingEnabled? {cursor: 'pointer'} : null} onClick={selectingEnabled ? () => {this.selectAttribute({id: attribute.id, item: item})} : null} className='attribute-option text'>{item.value}</span>
                    )})}
                </div>
              </div>)
    }))
  } 

  async runOnFirstVisitWithoutLocalStorage(){
    const categories = await JSON.parse(JSON.stringify((await Queries.getCategoriesList())))
    const currencies = await JSON.parse(JSON.stringify((await Queries.getAllCurrencies())))
    const categoriesList = Array.from(new Set(categories.categories.map(JSON.stringify))).map(JSON.parse);
    const currenciesList = Array.from(new Set(currencies.currencies.map(JSON.stringify))).map(JSON.parse);
    const defaultCategory = categories.categories[0].name
    const categoryData = await JSON.parse(JSON.stringify((await Queries.getCategory(defaultCategory))))
    const data = Array.from(new Set(categoryData.category.products.map(JSON.stringify))).map(JSON.parse);
    const sampleProductPrice = data[0].prices;
    let currencyToShow;

    for(const priceLabel in sampleProductPrice){
      if(currenciesList[0].label === sampleProductPrice[priceLabel].currency.label){
         currencyToShow = priceLabel;
      }
    }
    this.setStateOnLoad({
      categoriesList: categoriesList, 
      currenciesList: currenciesList,
      defaultCategory: defaultCategory,
      currencyToShow: currencyToShow,
      choosenCurrency: currenciesList[0],
      numberOfItemsInBag: 0, 
      currentCategoryData: data             
    })
  }
 
  async componentDidMount() {
    const localStorage = JSON.parse(window.localStorage.getItem('scandiwebAmarMusliStoreState'));
     if(!localStorage || (localStorage === null)){
      this.runOnFirstVisitWithoutLocalStorage()
     }
  }

  componentDidUpdate(prevProps){
    if(this.state.choosenCurrency && !(this.state.choosenCurrency === prevProps.choosenCurrency)){
      const sampleProductPrice = this.state.currentCategoryData[0] && this.state.currentCategoryData[0].prices;
      let currencyToShow;
      for(const priceLabel in sampleProductPrice){
        if(this.state.choosenCurrency.label === sampleProductPrice[priceLabel].currency.label){
          currencyToShow = priceLabel;
        }
      }
      this.setState({
        ...this.state,
        currencyToShow: currencyToShow          
      })
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

    return (
    <div className='App'>
        <Header 
        currenciesList={this.state.currenciesList}
        categoriesList={this.state.categoriesList}
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
        runOnFirstVisitWithoutLocalStorage={this.runOnFirstVisitWithoutLocalStorage}
        choosenCurrency={this.state.choosenCurrency} />
        <main> 
        {this.state.currentlyOpened === 'minicart' ? <div id="overlay"></div> : null} 
        <Routes>
        <Route 
          path='/'
          element={
          <CategoryPage 
            defaultCategory={this.state.defaultCategory}
            changeCurrentCategory={this.changeCurrentCategory}
            choosenCurrency={this.state.choosenCurrency} 
            currencyToShow={this.state.currencyToShow}
            addInBag={this.addInBag}
            resetChoosenAttributes={this.resetChoosenAttributes}
           /*  runOnFirstVisitWithoutLocalStorage={this.runOnFirstVisitWithoutLocalStorage} */
          />} />
           <Route  
          path='/category'
          element={
          <CategoryPage 
            message={'Please choose one category.'}
            /* runOnFirstVisitWithoutLocalStorage={this.runOnFirstVisitWithoutLocalStorage} */
          />} />
          <Route  
          path='/category/:category'
          element={
          <CategoryPage 
            choosenCurrency={this.state.choosenCurrency} 
            currencyToShow={this.state.currencyToShow}
            changeCurrentCategory={this.changeCurrentCategory}
            currentCategory={this.currentCategory}
            resetChoosenAttributes={this.resetChoosenAttributes}
            /* runOnFirstVisitWithoutLocalStorage={this.runOnFirstVisitWithoutLocalStorage} */
            addInBag={this.addInBag}
          />} />
          <Route  
          path='/product/'
          element={
          <ProductPage 
            message={'Please choose one product.'}
            runOnFirstVisitWithoutLocalStorage={this.runOnFirstVisitWithoutLocalStorage}
          />} />
           <Route
          path='/product/:product'
          element={
          <ProductPage 
            choosenCurrency={this.state.choosenCurrency} 
            choosenAttributes={this.state.choosenAttributes}
            currencyToShow={this.state.currencyToShow}
            numberOfItemsInBag={this.state.numberOfItemsInBag}
            addInBag={this.addInBag}
            generateListOfAttributes={this.generateListOfAttributes}
            generateDefaultAttributes={this.generateDefaultAttributes}
            runOnFirstVisitWithoutLocalStorage={this.runOnFirstVisitWithoutLocalStorage}
          />} />
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
            numberOfItemsInBag={this.state.numberOfItemsInBag}
            /* runOnFirstVisitWithoutLocalStorage={this.runOnFirstVisitWithoutLocalStorage} */
          />} />
        </Routes>
        </main>
    </div>
  );
}}

export default App;
