import React, { useState, useEffect } from 'react';
import './ProductPage.css';
import { useParams } from 'react-router-dom';
import parse from 'html-react-parser';
import { useSelector, useDispatch } from 'react-redux';
import { getProduct } from '../../../Queries';
import Attributes from '../Attributes';
import { generateDefaultAttributes, addInBag, update } from '../../../Store';

function ProductPage() {
  const params = useParams();
  const { product: paramsProduct } = params;
  const dispatch = useDispatch();
  const [overImage, setOverImage] = useState('');
  const [productData, setProductData] = useState('');
  const choosenCurrency = useSelector((state) => state.choosenCurrency);
  const currencyToShow = useSelector((state) => state.currencyToShow);

  const handleMouseClick = (props) => setOverImage(props);

  useEffect(() => {
    window.scrollTo(0, 0);
    async function fetchProduct() {
      const productResult = await getProduct(paramsProduct);
      const { product } = productResult;
      if (product !== null) {
        setProductData(product);
        const generatedResult = generateDefaultAttributes({ productToGenerate: product });
        const { category, newChoosenAttributes } = generatedResult;
        dispatch(update({ name: 'choosenAttributes', value: newChoosenAttributes }));
        dispatch(update({ name: 'currentCategory', value: category }));
      } else {
        setProductData(null);
      }
    }
    if (paramsProduct) fetchProduct();
  }, [paramsProduct]);

  const { symbol } = choosenCurrency;

  if (productData !== null) {
    const {
      id,
      gallery,
      name,
      brand,
      attributes,
      prices,
      inStock,
      description,
    } = productData;

    return (
      <div key={id} className="product-page">
        <div className="gallery">
          {gallery && gallery.length > 1
            && (
            <div className="all-images">
                {gallery.map((image) => (image === overImage || (overImage === '' && image === gallery[0])
                  ? (
                    <div
                      key={image}
                      role="button"
                      tabIndex={0}
                      onKeyUp={() => handleMouseClick(image)}
                      onClick={() => handleMouseClick(image)}
                      className="small-image"
                    >
                      <img alt={`${name} product gallery item`} className="item-image" src={image} />
                    </div>
                  )
                  : (
                    <div
                      key={image}
                      role="button"
                      tabIndex={0}
                      onKeyUp={() => handleMouseClick(image)}
                      onClick={() => handleMouseClick(image)}
                      className="small-image"
                    >
                      <img alt={`${name} product gallery item`} className="item-image opacity" src={image} />
                    </div>
                  )))}
            </div>
            )}
          <div className="single-image">
            {!inStock
                && (
                <div className="out-of-stock-text">
                  Out of stock
                </div>
                )}
            <img
              alt={`${name} product`}
              className={inStock ? 'item-image' : 'item-image opacity'}
              src={(overImage !== '') ? overImage : (gallery && gallery[0])}
            />
          </div>
        </div>
        <div className="summary">
          <div className="brand-name">
            <span className={inStock ? 'brand' : 'brand bleached-text'}>{brand}</span>
            <span className={inStock ? 'name' : 'name bleached-text'}>{name}</span>
          </div>
          <div className="attributes">
            <Attributes
              attributes={attributes}
              from="product-page"
              inStock={inStock}
            />
          </div>
          <div className="attribute">
            <span className={inStock ? 'attribute-name in-stock' : 'attribute-name bleached-text'}>Price:</span>
            <span className={inStock ? 'price' : 'price bleached-text'}>
              {symbol}
              {prices && prices[currencyToShow].amount.toFixed(2)}
            </span>
          </div>
          {inStock
            ? (
              <div
                onClick={() => dispatch(addInBag({ item: productData }))}
                role="button"
                tabIndex={0}
                onKeyUp={() => dispatch(addInBag({ item: productData }))}
                className="add-to-cart"
              >
                <span>Add to cart</span>
              </div>
            )
            : (
              <div className="wide-green-button out-of-stock">
                <span>Out of stock</span>
              </div>
            )}
          <div className={inStock ? 'description in-stock' : 'description bleached-text'}>{description && parse(description)}</div>
        </div>
      </div>
    );
  }
  return (<div>Sorry, we can&lsquo;t find that product.</div>);
}

export default ProductPage;
