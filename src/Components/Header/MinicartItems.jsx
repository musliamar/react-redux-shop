import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Attributes from '../Attributes';
import { increaseQuantityOfProduct, removeFromBag } from '../../Store';

function Items() {
  const dispatch = useDispatch();
  const choosenCurrency = useSelector((state) => state.choosenCurrency);
  const itemsInBag = useSelector((state) => state.itemsInBag);
  const currencyToShow = useSelector((state) => state.currencyToShow);
  const { symbol } = choosenCurrency;

  return itemsInBag?.map((item) => {
    const {
      cartId,
      brand,
      name,
      prices,
      gallery,
      inStock,
      choosenAttributes,
      quantity,
      attributes: itemAttributes,
    } = item;

    return (
      <div key={cartId} className="single">
        <div className="attributes">
          <div className="brand-name">
            <span>{brand}</span>
            <span>{name}</span>
          </div>
          <div className="price">
            <span>
              {symbol}
              {prices[currencyToShow].amount.toFixed(2)}
            </span>
          </div>
          <Attributes
            attributes={itemAttributes}
            choosenAttributesFromCart={choosenAttributes}
            from="minicart"
            inStock={inStock}
          />
        </div>
        <div className="quantity">
          <span
            role="button"
            tabIndex={0}
            onKeyUp={() => dispatch(increaseQuantityOfProduct({ cartId }))}
            onClick={() => dispatch(increaseQuantityOfProduct({ cartId }))}
            className="attribute-option text plus-minus"
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
            className="attribute-option text plus-minus"
          >
            -
          </span>
        </div>
        <div className="gallery">
          <span>
            <img alt="Item preview" className="item-image" src={gallery[0]} />
          </span>
        </div>
      </div>
    );
  });
}

export default Items;
