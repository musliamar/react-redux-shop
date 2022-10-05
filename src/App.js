import './App.css';
import React from 'react';
import {Routes, Route} from 'react-router-dom';
import Header from './Components/Header/Header.js';
import CategoryPage from './Components/Main/CategoryPage.js';
import { client, Query, Field} from "@tilework/opus";

class App extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {   
      currentCategory: 'clothes',
      choosenCurrency: ''
    } 
    
    this.changeCurrentCategory = this.changeCurrentCategory.bind(this);
    this.changeCurrency = this.changeCurrency.bind(this);

  }

  changeCurrentCategory(categ) {   
    this.setState({
      currentCategory: categ,
      });
  }

  changeCurrency(currency) {   

    console.log(currency)
    
    this.setState({
      choosenCurrency: currency,
      });
  }

  render() {

    return (
    <div className='App'>
        <Header 
        changeCurrency={this.changeCurrency} 
        currentCategory={this.state.currentCategory} 
        changeCurrentCategory={this.changeCurrentCategory}
        choosenCurrency={this.choosenCurrency} />
        <main> 
        <Routes>
          <Route exact 
          path={'/category/:category'} 
          element={<CategoryPage choosenCurrency={this.state.choosenCurrency} currentCategory={this.state.currentCategory}/>} />
        </Routes>
        </main>
    </div>
  );
}}

export default App;
