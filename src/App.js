import './App.css';
import React from 'react';
import {Routes, Route} from 'react-router-dom';
import Header from './Components/Header/Header.js';
import CategoryPage from './Components/Main/CategoryPage.js';
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
 
  async componentDidMount() {

        const categories = await JSON.parse(JSON.stringify((await Queries.getCategoriesList())))
        const currencies = await JSON.parse(JSON.stringify((await Queries.getAllCurrencies())))

        const categoriesList = Array.from(new Set(categories.category.products.map(JSON.stringify))).map(JSON.parse);
        const currenciesList = Array.from(new Set(currencies.currencies.map(JSON.stringify))).map(JSON.parse);

        const category = this.state.currentCategory === '' ? 'tech' : this.state.currentCategory;
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

    console.log(this.state)

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
        choosenCurrency={this.state.choosenCurrency} />
        <main> 
        {this.state.currentlyOpened === 'minicart' ? <div id="overlay"></div> : null} 
        <Routes>
          <Route exact 
          path={'/category/:category'} 
          element={
          <CategoryPage 
            currentCategoryData={this.state.currentCategoryData} 
            choosenCurrency={this.state.choosenCurrency} 
            currentCategory={this.state.currentCategory}
            addInBag={this.addInBag}
          />} />
        </Routes>
        </main>
    </div>
  );
}}

export default App;
