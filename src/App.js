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
  }

  setState(state) {
    window.localStorage.setItem('scandiwebAmarMusliStoreState', JSON.stringify(state));
    super.setState(state);
  }

  async changeCurrentCategory(category) {   

    const categoryData = await JSON.parse(JSON.stringify((await Queries.getCategory(category))))
    const data = Array.from(new Set(categoryData.category.products.map(JSON.stringify))).map(JSON.parse);

    this.setState({
      ...this.state,
      currentCategory: category,
      currentCategoryData: data
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

  addInBag(props) {

    console.log(props)

    const product = props.item;

    let choosenAttributes = [];
    const generateIdForCart = product.id.split('-')

    if(!this.state.choosenAttributes || this.state.choosenAttributes.length === 0){
      Object.keys(product).forEach((item) => {
        if((item === 'attributes')){
          Object.values(product[item]).forEach((attribute) => {
            const attributeToAdd = {[attribute.id]: attribute.items[0]}
            if(attribute.items[0].id === ('Yes'|| 'No')){
              const splitted = item[attribute].id.split(' ');
              const joined = splitted.join('-');
              generateIdForCart.push(joined.toLowerCase())
            }else{
              generateIdForCart.push(attribute.items[0].id.toLowerCase())
            }
            choosenAttributes.push(attributeToAdd)
          })
        }
      })
    }else{
        choosenAttributes = this.state.choosenAttributes;
        choosenAttributes.forEach((attribute) => {
          if(attribute.item.id === ('Yes'|| 'No')){
            const splitted = attribute.id.split(' ');
            const joined = splitted.join('-');
            generateIdForCart.push(joined.toLowerCase())
          }else{
            generateIdForCart.push(attribute.item.id.toLowerCase())
          }
        })
    }

    product.cartId = generateIdForCart.join('-');
    
    product.choosenAttributes = choosenAttributes;
    product.quantity = 1;

    let found = false;
 
    const items = this.state.itemsInBag;

    items.forEach((item) => {
      if(item.cartId === product.cartId){
        item.quantity = item.quantity + 1;
        found = true;
      }
    })

    this.setState({
      ...this.state,
      itemsInBag: items,
      numberOfItemsInBag: this.state.numberOfItemsInBag + 1         
    })

    if(!found){
      this.setState({
        ...this.state,
        itemsInBag: [...this.state.itemsInBag, product],
        numberOfItemsInBag: this.state.numberOfItemsInBag + product.quantity        
      })
    }
  }

  setStateOnLoad(props){

    const localStorage = JSON.parse(window.localStorage.getItem('scandiwebAmarMusliStoreState'));

    if(!(localStorage === null)){
      for(const single in props){
          for(const singleInStorage in localStorage){
            if(single === singleInStorage){ 
              this.setState({...this.state, [singleInStorage]: localStorage[singleInStorage]})
            } else {
              this.setState({...this.state, [single]: props[single]})
            }
          }
      }
    }else{
      this.setState(props); 
    }
  }

  selectAttribute(props){

    let choosenAttributes = this.state.choosenAttributes;

    if(!(choosenAttributes.length === 0)){
      for(const single in choosenAttributes){
        const attributeToCompare = choosenAttributes[single];
        if(attributeToCompare.id === props.id){
          if(!(attributeToCompare.item === props.item)){
            choosenAttributes.splice(single, 1);
            choosenAttributes.push(props);
          }
        }else{
          choosenAttributes.push(props);
        }
      }
    }else{
      choosenAttributes.push(props);
    }

    const finalArray = [...new Map(choosenAttributes.map((a) => [a.id, a])).values()];

    this.setState({...this.state, choosenAttributes: finalArray}); 
  }

  generateListOfAttributes(attributes) {

    return attributes.attributes && attributes.attributes.map((attribute, index) => {

        let selectingEnabled = false;

        const attributesFromState = this.state.choosenAttributes && this.state.choosenAttributes.map((attribute) => {

          return ({[attribute.id]: attribute.item})
        })

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
                  ? 
                    (attribute.selectedValue && item.id === attribute.selectedValue.id) 
                    ? <span key={item.id} style={selectingEnabled? {cursor: 'pointer', backgroundColor: color} : {backgroundColor: color}} onClick={selectingEnabled ? () => {this.selectAttribute({id: attribute.id, item: item})} : null} className='attribute-option swatch selected'></span>
                    : <span key={item.id} style={selectingEnabled? {cursor: 'pointer', backgroundColor: color} : {backgroundColor: color}} onClick={selectingEnabled ? () => {this.selectAttribute({id: attribute.id, item: item})} : null} className='attribute-option swatch'></span>
                  : (attribute.selectedValue && item.id === attribute.selectedValue.id) 
                    ? <span key={item.id} style={selectingEnabled? {cursor: 'pointer'} : null} onClick={selectingEnabled ? () => {this.selectAttribute({id: attribute.id, item: item})} : null} className='attribute-option text selected'>{item.value}</span>
                    : <span key={item.id} style={selectingEnabled? {cursor: 'pointer'} : null} onClick={selectingEnabled ? () => {this.selectAttribute({id: attribute.id, item: item})} : null} className='attribute-option text'>{item.value}</span>

                )})}
            </div>
        </div>)})
    } 
 
  async componentDidMount() {

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
        changeCurrentCategory={this.changeCurrentCategory}
        increaseQuantityOfProduct={this.increaseQuantityOfProduct}
        removeFromBag={this.removeFromBag}
        sumOfPrices={sumOfPrices}
        generateListOfAttributes={this.generateListOfAttributes}
        choosenCurrency={this.state.choosenCurrency} />
        <main> 
        {this.state.currentlyOpened === 'minicart' ? <div id="overlay"></div> : null} 
        <Routes>
        <Route 
          path='/'
          element={
          <CategoryPage 
            defaultCategory={this.state.defaultCategory}
            choosenCurrency={this.state.choosenCurrency} 
            currencyToShow={this.state.currencyToShow}
            addInBag={this.addInBag}
          />} />
           <Route  
          path='/category'
          element={
          <CategoryPage 
            message={'Please choose one category.'}
          />} />
          <Route  
          path='/category/:category'
          element={
          <CategoryPage 
            choosenCurrency={this.state.choosenCurrency} 
            currencyToShow={this.state.currencyToShow}
            addInBag={this.addInBag}
          />} />
          <Route  
          path='/product/'
          element={
          <ProductPage 
            message={'Please choose one product.'}
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
          />} />
        </Routes>
        </main>
    </div>
  );
}}

export default App;
