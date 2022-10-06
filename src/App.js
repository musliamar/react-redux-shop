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
      currentlyOpened: '',
      categoriesList: [],
      currenciesList: [],
      currentCategoryData: ''
    } 
    
    this.changeCurrentCategory = this.changeCurrentCategory.bind(this);
    this.changeCurrency = this.changeCurrency.bind(this);
    this.openBox = this.openBox.bind(this);
    this.closeBox = this.closeBox.bind(this);

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

    console.log(props)

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

    console.log(this.state.currentlyOpened)
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

  setStateOnLoad(props){

    const localStorage = JSON.parse(window.localStorage.getItem('scandiwebAmarMusliStoreState'));

    if(!(localStorage === null)){
      for(const single in props){
        for(const singleInStorage in localStorage){
          if(single === singleInStorage){ this.setState({...this.state, [singleInStorage]: localStorage[singleInStorage]})}
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
         currentCategoryData: data                  
        })
  }

  render() {

    return (
    <div className='App'>
        <Header 
        currenciesList={this.state.currenciesList}
        categoriesList={this.state.categoriesList}
        changeCurrency={this.changeCurrency} 
        currentCategory={this.state.currentCategory}
        currentlyOpened={this.state.currentlyOpened}
        openBox={this.openBox}
        closeBox={this.closeBox}
        changeCurrentCategory={this.changeCurrentCategory}
        choosenCurrency={this.state.choosenCurrency} />
        <main> 
        <Routes>
          <Route exact 
          path={'/category/:category'} 
          element={<CategoryPage currentCategoryData={this.state.currentCategoryData} choosenCurrency={this.state.choosenCurrency} currentCategory={this.state.currentCategory}/>} />
        </Routes>
        </main>
    </div>
  );
}}

export default App;
