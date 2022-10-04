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
      currentCategory: 'clothes'
    } 
    
    this.changeCurrentCategory = this.changeCurrentCategory.bind(this);

  }

  changeCurrentCategory(categ) {   
    this.setState({
      currentCategory: categ,
      });
  }

  render() {

    return (
    <div className='App'>
        <Header currentCategory={this.state.currentCategory} changeCurrentCategory={this.changeCurrentCategory} />
        <main> 
        <Routes>
          <Route exact path={'/category/:category'} element={<CategoryPage currentCategory={this.state.currentCategory}/>} />
        </Routes>
        </main>
    </div>
  );
}}

export default App;
