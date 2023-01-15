import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import ArrowLeft from '../../../Images/arrow-left.svg';
import ArrowRight from '../../../Images/arrow-right.svg';
import Attributes from '../Attributes';
import { increaseQuantityOfProduct, removeFromBag } from '../../../Store';

function Item({ item }) {
  const dispatch = useDispatch();
  const [currentImages, setCurrentImages] = useState([]);
  const [style, setStyle] = useState({ objectPosition: '0% 0%' });
  const [overId, setOverId] = useState('');
  const choosenCurrency = useSelector((state) => state.choosenCurrency);
  const currencyToShow = useSelector((state) => state.currencyToShow);

  const handleMouseMove = (event) => {
    const {
      left, width, height, top: targetTop,
    } = event.target.getBoundingClientRect();
    const { pageX, pageY } = event;
    const { scrollY } = window;
    const top = targetTop + scrollY;
    const x = ((pageX - left) / width) * 100;
    const y = ((pageY - top) / height) * 100;
    setStyle({ objectPosition: `${x}% ${y}%` });
  };

  const handleMouseLeave = () => {
    setOverId('');
    setStyle({ objectPosition: '0% 0%' });
  };

  const handleOver = (cartId) => {
    setOverId(cartId);
  };

  const nextImage = ({ itemToCompare, gallery }) => {
    const { length: imagesLength } = currentImages;
    const { length: galleryLength } = gallery;

    if (imagesLength === 0) {
      const array = [];
      array.push({ itemToCompare, currentImage: 1 });
      setCurrentImages(array);
    } else {
      currentImages.forEach((image) => {
        const { itemToCompare: imageItem, currentImage } = image;
        const array = currentImages;
        if (imageItem === itemToCompare) {
          if ((galleryLength - 1) === currentImage) {
            array.push({ itemToCompare, currentImage: 0 });
          } else {
            const hold = currentImage;
            array.push({ itemToCompare, currentImage: hold + 1 });
          }
          setCurrentImages(array);
          array.splice(array.indexOf(image), 1);
        } else {
          array.push({ itemToCompare, currentImage: 1 });
          setCurrentImages(array);
          array.splice(array.indexOf(image), 1);
        }
      });
    }
    setStyle({ objectPosition: '0% 0%' });
  };

  const previousImage = ({ itemToCompare, gallery }) => {
    const { length: imagesLength } = currentImages;
    const { length: galleryLength } = gallery;

    if (imagesLength === 0) {
      const array = [];
      array.push({ itemToCompare, currentImage: galleryLength - 1 });
      setCurrentImages(array);
    } else {
      currentImages.forEach((image) => {
        const { itemToCompare: imageItem, currentImage } = image;
        const array = currentImages;
        if (imageItem === itemToCompare) {
          if (currentImage === 0) {
            array.push({ itemToCompare, currentImage: galleryLength - 1 });
          } else {
            const hold = currentImage;
            array.push({ itemToCompare, currentImage: hold - 1 });
          }
          setCurrentImages(array);
          array.splice(array.indexOf(image), 1);
        } else {
          array.push({ itemToCompare, currentImage: galleryLength - 1 });
          setCurrentImages(array);
          array.splice(array.indexOf(image), 1);
        }
      });
    }
    setStyle({ objectPosition: '0% 0%' });
  };

  const {
    cartId,
    category,
    id,
    brand,
    name,
    gallery,
    inStock,
    choosenAttributes,
    attributes: itemAttributes,
    prices,
    quantity,
  } = item;

  const { length: galleryLength } = gallery;
  const toCompare = { itemToCompare: cartId, gallery };
  let imageToShow = 0;
  const { symbol } = choosenCurrency;
  const { length: imagesLength } = currentImages;

  if ((imagesLength !== 0)) {
    currentImages.forEach((image) => {
      const { itemToCompare: imageItem, currentImage } = image;
      if (imageItem === cartId) {
        imageToShow = currentImage;
      }
    });
  } else {
    imageToShow = 0;
  }

  return (
    <>
      <div className="divider" />
      <div className="single">
        <div className="summary">
          <div className="brand-name">
            <Link
              key={id}
              to={`/${category}/${id}`}
            >
              <span className="brand">{brand}</span>
              <span className="name">{name}</span>
            </Link>
          </div>
          <div className="price">
            <span>
              {symbol}
              {prices[currencyToShow].amount.toFixed(2)}
            </span>
          </div>
          <div className="attributes">
            <Attributes
              attributes={itemAttributes}
              choosenAttributesFromCart={choosenAttributes}
              from="cart"
              inStock={inStock}
            />
          </div>
        </div>
        <div className="quantity">
          <span
            role="button"
            tabIndex={0}
            onKeyUp={() => dispatch(increaseQuantityOfProduct({ cartId }))}
            onClick={() => dispatch(increaseQuantityOfProduct({ cartId }))}
            className="attribute-option plus-minus"
          >
            +
          </span>
          <span className="attribute-number">
            {quantity}
          </span>
          <span
            role="button"
            tabIndex={0}
            onKeyUp={() => dispatch(removeFromBag({ cartId }))}
            onClick={() => dispatch(removeFromBag({ cartId }))}
            className="attribute-option plus-minus"
          >
            -
          </span>
        </div>
        <div className="gallery">
          {galleryLength > 1
            ? (
              <div onMouseEnter={() => handleOver(cartId)} onMouseLeave={handleMouseLeave} className="item-image-wrapper">
                <div>
                  <img
                    alt={`${name} product`}
                    onMouseMove={handleMouseMove}
                    style={(overId === cartId) ? style : undefined}
                    className="item-image"
                    src={gallery[imageToShow]}
                  />
                </div>
                <div>
                  <div className="gallery-arrows">
                    <div
                      onClick={() => previousImage(toCompare)}
                      role="button"
                      tabIndex={0}
                      onKeyUp={() => previousImage(toCompare)}
                    >
                      <img src={ArrowLeft} alt="Previous" className="gallery-arrow-icon" />
                    </div>
                    <div
                      onClick={() => nextImage(toCompare)}
                      role="button"
                      tabIndex={0}
                      onKeyUp={() => nextImage(toCompare)}
                    >
                      <img src={ArrowRight} alt="Next" className="gallery-arrow-icon" />
                    </div>
                  </div>
                </div>
              </div>
            )
            : (
              <div onMouseEnter={() => handleOver(cartId)} onMouseLeave={handleMouseLeave} className="item-image-wrapper">
                <img
                  alt={`${name} product`}
                  className="item-image"
                  onMouseMove={handleMouseMove}
                  style={(overId === cartId) ? style : undefined}
                  src={gallery[0]}
                />
              </div>
            )}
        </div>
      </div>
    </>
  );
}

Item.defaultProps = {
  item: PropTypes.shape({
    cartId: PropTypes.string,
    category: PropTypes.string,
    id: PropTypes.string,
    brand: PropTypes.string,
    name: PropTypes.string,
    gallery: PropTypes.arrayOf(PropTypes.string),
    inStock: PropTypes.bool,
    choosenAttributes: PropTypes.arrayOf(PropTypes.shape({
      [PropTypes.string]: PropTypes.arrayOf(PropTypes.shape({
        displayValue: PropTypes.string,
        id: PropTypes.string,
        value: PropTypes.string,
      })),
    })),
    attributes: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      type: PropTypes.string,
      items: PropTypes.arrayOf(PropTypes.shape({
        displayValue: PropTypes.string,
        id: PropTypes.string,
        value: PropTypes.string,
      })),
    })),
    prices: PropTypes.arrayOf(PropTypes.shape({
      amount: PropTypes.number,
      currency: PropTypes.shape({
        label: PropTypes.string,
      }),
    })),
    quantity: PropTypes.number,
  }),
};

Item.propTypes = {
  item: PropTypes.shape({
    cartId: PropTypes.string,
    category: PropTypes.string,
    id: PropTypes.string,
    brand: PropTypes.string,
    name: PropTypes.string,
    gallery: PropTypes.arrayOf(PropTypes.string),
    inStock: PropTypes.bool,
    choosenAttributes: PropTypes.arrayOf(PropTypes.shape({
      [PropTypes.string]: PropTypes.arrayOf(PropTypes.shape({
        displayValue: PropTypes.string,
        id: PropTypes.string,
        value: PropTypes.string,
      })),
    })),
    attributes: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      type: PropTypes.string,
      items: PropTypes.arrayOf(PropTypes.shape({
        displayValue: PropTypes.string,
        id: PropTypes.string,
        value: PropTypes.string,
      })),
    })),
    prices: PropTypes.arrayOf(PropTypes.shape({
      amount: PropTypes.number,
      currency: PropTypes.shape({
        label: PropTypes.string,
      }),
    })),
    quantity: PropTypes.number,
  }),
};

export default Item;
