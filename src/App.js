import './App.css';
import React from 'react';
import {Routes, Route} from 'react-router-dom';
import Header from './Components/Header/Header.js';
import CategoryPage from './Components/Main/CategoryPage.js';
import CartPage from './Components/Main/CartPage.js';
import Queries from './Queries.js';

class App extends React.PureComponent {

  constructor(props) {
    super(props);

    const localStorage = JSON.parse(window.localStorage.getItem('scandiwebAmarMusliStoreState'));

    this.state = !(localStorage === null) 
    ? localStorage
    :  {   
      currentCategory: '',
      choosenCurrency: '',
      currencyToShow: '',
      itemsInBag: [],
      currentlyOpened: '',
      categoriesList: [],
      currenciesList: [],
      numberOfItemsInBag: 0,
      currentCategoryData: ''
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

  async addInBag(props) {

    const productFetch = await JSON.parse(JSON.stringify((await Queries.getSingleProduct(props))))
    const product = productFetch.product;

    let choosenAttributes = [];
    const generateIdForCart = product.id.split('-')

    for(const property in product){
      if((property === 'attributes')){
        const productProperty = product[property];
        for(const attribute in productProperty){
          const attributeToAdd = {[productProperty[attribute].id]: productProperty[attribute].items[0]}
          if(productProperty[attribute].items[0].id === ('Yes'|| 'No')){
            const splitted = productProperty[attribute].id.split(' ');
            const joined = splitted.join('-');
            generateIdForCart.push(joined.toLowerCase())
          }else{
            generateIdForCart.push(productProperty[attribute].items[0].id.toLowerCase())
          }
          choosenAttributes.push(attributeToAdd)
        }
      }
    }

    product.defaultId = product.id;
    product.id = generateIdForCart.join('-');
    product.choosenAttributes = choosenAttributes;
    product.quantity = 1;

    const sampleProductPrice = product.prices;
    let currencyToShow;

    for(const priceLabel in sampleProductPrice){
       if(this.state.choosenCurrency.label === sampleProductPrice[priceLabel].currency.label){
           currencyToShow = priceLabel;
       }
    }

    let found = false;
 
    for(const itemToFind in this.state.itemsInBag){
      if(product.id === this.state.itemsInBag[itemToFind].id){
        let items = this.state.itemsInBag;
        items[itemToFind].quantity = items[itemToFind].quantity + 1;
        found = true;

        this.setState({
          ...this.state,
          itemsInBag: items,
          currencyToShow: currencyToShow,
          numberOfItemsInBag: this.state.numberOfItemsInBag + 1         
        })
      }
    }

    if(!found){
      this.setState({
        ...this.state,
        itemsInBag: [...this.state.itemsInBag, product],
        currencyToShow: currencyToShow ,
        numberOfItemsInBag: this.state.numberOfItemsInBag + product.quantity        
      })
    }
  }

  increaseQuantityOfProduct(props){
    for(const itemToFind in this.state.itemsInBag){
      const itemsInBag = this.state.itemsInBag;
      if(itemsInBag[itemToFind].id === props){
        let items = this.state.itemsInBag;
        items[itemToFind].quantity = items[itemToFind].quantity + 1;

        this.setState({
          ...this.state,
          itemsInBag: items,
          numberOfItemsInBag: this.state.numberOfItemsInBag + 1         
        })
      }
    }
  }

  removeFromBag(props){
    for(const itemToFind in this.state.itemsInBag){
      const itemsInBag = this.state.itemsInBag;

      if(itemsInBag[itemToFind].id === props){
        if(itemsInBag[itemToFind].quantity > 1){
          itemsInBag[itemToFind].quantity = itemsInBag[itemToFind].quantity - 1;
        }else{
          itemsInBag.splice(itemToFind, 1);
        }
        this.setState({
          ...this.state,
          itemsInBag: itemsInBag,
          numberOfItemsInBag: this.state.numberOfItemsInBag - 1         
        })
      }
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

  generateListOfAttributes(attributes) {

    return attributes && attributes.attributes.map((attribute, index) => {

        for(const choosenAttribute in attributes.choosenAttributes){
            const attributeToCompare = attributes.choosenAttributes[choosenAttribute];
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
                    ? <span key={item.id} style={{backgroundColor: color}} className='attribute-option swatch selected'></span>
                    : <span key={item.id} style={{backgroundColor: color}} className='attribute-option swatch'></span>
                :   (attribute.selectedValue && item.id === attribute.selectedValue.id) 
                    ? <span key={item.id} className='attribute-option text selected'>{item.value}</span>
                    : <span key={item.id} className='attribute-option text'>{item.value}</span>

                )})}
            </div>
        </div>)})
    } 
 
  async componentDidMount() {

        const categories = await JSON.parse(JSON.stringify((await Queries.getCategoriesList())))
        const currencies = await JSON.parse(JSON.stringify((await Queries.getAllCurrencies())))

        const categoriesList = Array.from(new Set(categories.categories.map(JSON.stringify))).map(JSON.parse);
        const currenciesList = Array.from(new Set(currencies.currencies.map(JSON.stringify))).map(JSON.parse);

        const category = this.state.currentCategory === '' ? categories.categories[0].name : this.state.currentCategory;
        const categoryData = await JSON.parse(JSON.stringify((await Queries.getCategory(category))))
        const data = Array.from(new Set(categoryData.category.products.map(JSON.stringify))).map(JSON.parse);

        this.setStateOnLoad({
         currentCategory: category,
         categoriesList: categoriesList, 
         currenciesList: currenciesList,
         choosenCurrency: currenciesList[0],
         numberOfItemsInBag: 0,
         currentCategoryData: data               
        })
  }

  componentDidUpdate(prevProps){

    if(this.state.choosenCurrency && !(this.state.choosenCurrency === prevProps.choosenCurrency)){
      const sampleProductPrice = this.state.itemsInBag[0] && this.state.itemsInBag[0].prices;
      let currencyToShow;

      for(const priceLabel in sampleProductPrice){
        if(this.state.choosenCurrency.label === sampleProductPrice[priceLabel].currency.label){
          currencyToShow = priceLabel;
        }
      }

      this.setState({
        ...this.state,
        currencyToShow: currencyToShow,            
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
        <Route exact 
          path={'/'} 
          element={
          <CategoryPage 
            currentCategoryData={this.state.currentCategoryData} 
            choosenCurrency={this.state.choosenCurrency} 
            currentCategory={this.state.currentCategory}
            addInBag={this.addInBag}
          />} />
          <Route exact 
          path={'/category/:category'} 
          element={
          <CategoryPage 
            currentCategoryData={this.state.currentCategoryData} 
            choosenCurrency={this.state.choosenCurrency} 
            currentCategory={this.state.currentCategory}
            addInBag={this.addInBag}
          />} />
           <Route exact 
          path={'/cart'} 
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
