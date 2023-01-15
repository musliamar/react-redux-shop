import React from 'react';
import './CartPage.css';
import { useSelector } from 'react-redux';
import CartItem from './CartSingleItem';

function CartPage() {
  const itemsInBag = useSelector((state) => state.itemsInBag);
  const choosenCurrency = useSelector((state) => state.choosenCurrency);
  const sumOfPrices = useSelector((state) => state.sumOfPrices);
  const numberOfItemsInBag = useSelector((state) => state.numberOfItemsInBag);

  const { length: itemsLength } = itemsInBag;
  const { symbol } = choosenCurrency;
  const taxRaw = 0.21 * sumOfPrices;
  const tax = taxRaw.toFixed(2);
  const sumRaw = parseFloat(sumOfPrices) + taxRaw;
  const sum = sumRaw.toFixed(2);

  return (

    <div className="cart-container">
      <h1 className="cart-title">Cart</h1>
      <div className="cart-page-items">
        {(itemsLength !== 0)
          ? (
            <>
              {itemsInBag.map((item) => (
                <CartItem
                  key={item.cartId}
                  item={item}
                />
              ))}
              <div className="divider" />
              <div className="price-summary">
                <div className="labels">
                  <span>Tax 21%:</span>
                  <span>Quantity:</span>
                  <span>Total:</span>
                </div>
                <div className="values">
                  <span className="bold">
                    {symbol}
                    {tax}
                  </span>
                  <span className="bold">{numberOfItemsInBag}</span>
                  <span className="bold">
                    {symbol}
                    {sum}
                  </span>
                </div>
              </div>
              <div className="wide-green-button">
                <span>Order</span>
              </div>
            </>
          )
          : <span>Your cart is currently empty.</span>}
      </div>
    </div>
  );
}

export default CartPage;
