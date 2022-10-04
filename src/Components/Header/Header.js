import React from 'react';
import './Header.css'
import Queries from '../../Queries';
import logo from './logo.svg'
import {NavLink} from 'react-router-dom';

class Header extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {      
            categoriesList: [],
        }
    }

    async componentDidMount() {
    
        const result = await JSON.parse(JSON.stringify((await Queries.getCategoriesList())))
        const list = Array.from(new Set(result.category.products.map(JSON.stringify))).map(JSON.parse);

        this.setState({
         categoriesList: list             
        });      
              
      }

    render() {

        const {categoriesList} = this.state;
        const {changeCurrentCategory} = this.props;

      return (
       
        <nav>
            <div className='container'>
                <ul className='categories'>
                {categoriesList.map((category) => (
                    <NavLink onClick={() => {changeCurrentCategory(category.category)}} to={'/category/'+category.category}>
                    <li key={category.category} className='category-label'>
                        {category.category}
                    </li>
                    </NavLink>
                ))}
                </ul>
            <div className='logo'><img src={logo} className='logo-icon' alt="logo" /></div>
            <div className='actions'>
                <div className='currency'>Currency</div>
                <div className='cart'>Cart</div>
            </div>
            </div>
        </nav>
    );
  }}

  export default Header;