import React, { useState, useEffect } from 'react';
import './CategoryPage.css';
import { Link, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import CartIcon from '../../../Images/cart-icon.svg';
import { getCategory } from '../../../Queries';
import { update, addInBag } from '../../../Store';

function CategoryPage() {
  const dispatch = useDispatch();
  const params = useParams();
  const { category: paramsCategory } = params;
  const [addToCart, setAddToCart] = useState(false);
  const [overId, setOverId] = useState('');
  const [categoryData, setCategoryData] = useState([]);
  const [categoryName, setCategoryName] = useState('');

  const defaultCategory = useSelector((state) => state.defaultCategory);
  const choosenCurrency = useSelector((state) => state.choosenCurrency);
  const currencyToShow = useSelector((state) => state.currencyToShow);

  useEffect(() => {
    async function fetchCategory({ name }) {
      const categoryResult = await getCategory(name);
      const { category } = categoryResult;
      if (category !== null) {
        const { products } = category;
        setCategoryData(products);
        setCategoryName(name);
        dispatch(update({ name: 'currentCategory', value: name }));
        dispatch(update({ name: 'choosenAttributes', value: [] }));
      } else {
        setCategoryData(null);
      }
    }

    if (paramsCategory && (categoryData !== null) && (categoryData.length === 0)) {
      fetchCategory({ name: paramsCategory });
    } else if (
      !paramsCategory && defaultCategory
      && (categoryData !== null) && (categoryData.length === 0)) {
      fetchCategory({ name: defaultCategory.name });
    }
  });

  useEffect(() => {
    async function fetchCategory() {
      const categoryResult = await getCategory(paramsCategory);
      const { category } = categoryResult;
      if (category !== null) {
        const { products } = category;
        setCategoryData(products);
        setCategoryName(paramsCategory);
        dispatch(update({ name: 'currentCategory', value: paramsCategory }));
        dispatch(update({ name: 'choosenAttributes', value: [] }));
      } else {
        setCategoryData(null);
      }
    }
    if (paramsCategory !== undefined) fetchCategory();
  }, [paramsCategory]);

  const showAddToCart = (event, props) => {
    setAddToCart(!addToCart);
    setOverId(props);
  };

  const { symbol } = choosenCurrency;
  const categoryNameToShow = categoryName && categoryName[0].toUpperCase() + categoryName.slice(1);

  if (categoryData !== null) {
    return (
      <div className="items-container">
        <h1 className="category-title">{categoryNameToShow}</h1>
        <div className="items">
          {categoryData && categoryData.map((item) => {
            const {
              id, inStock, category, gallery, brand, name, prices,
            } = item;

            return (
              <div
                onMouseEnter={(event) => showAddToCart(event, id)}
                onMouseLeave={showAddToCart}
                key={id}
                className="single-item"
              >
                {inStock
                      && (overId && overId === id)
                      && (
                      <div
                        role="button"
                        tabIndex={0}
                        onKeyUp={() => dispatch(addInBag({ item }))}
                        onClick={() => dispatch(addInBag({ item }))}
                      >
                        <img src={CartIcon} className="cart-icon" alt="Add to cart" />
                      </div>
                      )}
                <Link
                  name={id}
                  className="item"
                  to={`/${category}/${id}`}
                >
                  <div className={inStock ? 'image-wrapper' : 'image-wrapper opacity'}>
                    {!inStock
                          && (
                          <div className="out-of-stock">
                            Out of stock
                          </div>
                          )}
                    <img className="item-image" src={gallery[0]} alt={name} />
                  </div>
                  <div className="item-content">
                    <div className={inStock ? 'item-name' : 'item-name bleached-text'}>
                      {brand}
                      {' '}
                      {name}
                    </div>
                    <div className={inStock ? 'item-price' : 'item-price bleached-text'}>
                      {symbol}
                      {prices[currencyToShow].amount.toFixed(2)}
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return (<div>Sorry, we can&lsquo;t find that category.</div>);
}

export default CategoryPage;
