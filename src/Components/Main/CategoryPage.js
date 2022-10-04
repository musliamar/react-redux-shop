import React from 'react';
import Query from '../../Queries';
import './CategoryPage.css'

class CategoryPage extends React.PureComponent {

  constructor(props) {

    super(props);
    
    this.state = {   
      currentCategoryData: ''
    }   
  }

    async componentDidMount() {
        
        const category = this.props.currentCategory === '' ? 'aaa' : this.props.currentCategory;
        const result = await JSON.parse(JSON.stringify((await Query.getCategory(category))))
        const data = Array.from(new Set(result.category.products.map(JSON.stringify))).map(JSON.parse);

        this.setState({
          currentCategoryData: data             
        });      
              
      }

      async componentDidUpdate() {
        
        const category = this.props.currentCategory === '' ? 'aaa' : this.props.currentCategory;
        const result = await JSON.parse(JSON.stringify((await Query.getCategory(category))))
        const data = Array.from(new Set(result.category.products.map(JSON.stringify))).map(JSON.parse);

        this.setState({
          currentCategoryData: data             
        });      
              
      }

    render() {

      const {currentCategoryData} = this.state;
      console.log(this.props.currentCategory)
      
      return (
        
        <div className='items-container'>
            <h1 className='category-title'>Category name</h1>
            <div className='items'>
              {currentCategoryData && currentCategoryData.map((item) => (
                 <div id={item.id} className='item'>
                   <div className='image-wrapper'>
                    <img className='item-image' src={item.gallery[0]} alt={item.name} />
                   </div>
                   <div className='item-content'>
                    <div className='item-name'>{item.name}</div>
                    <div className='item-price'>{item.prices[0].amount}</div>
                   </div>
                 </div>
                ))}
            </div>
        </div>

    );
  }}

  export default CategoryPage;