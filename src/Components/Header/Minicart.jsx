import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import SmallCartIcon from '../../Images/small-cart-icon.svg';
import MinicartItems from './MinicartItems';

function Minicart({ openBox, closeBox }) {
  const choosenCurrency = useSelector((state) => state.choosenCurrency);
  const sumOfPrices = useSelector((state) => state.sumOfPrices);
  const itemsInBag = useSelector((state) => state.itemsInBag);
  const numberOfItemsInBag = useSelector((state) => state.numberOfItemsInBag);
  const currentlyOpen = useSelector((state) => state.currentlyOpen);

  const isBagEmpty = (itemsInBag.length !== 0) ? 'box cart-box display-flex' : 'box empty';
  const { symbol: choosenCurrencySymbol } = choosenCurrency;

  return (
    <>
      <span className="tooltip-text cart-tooltip">My Bag</span>
      <div
        role="button"
        tabIndex={0}
        onKeyUp={() => openBox({ toOpen: 'minicart' })}
        onClick={() => openBox({ toOpen: 'minicart' })}
      >
        {(numberOfItemsInBag !== 0) && <span className="items-number">{numberOfItemsInBag}</span>}
        <img className="small-cart-icon" src={SmallCartIcon} alt="Your bag" />
      </div>
      <div className={currentlyOpen === 'minicart' ? isBagEmpty : 'box display-none'}>
        {(itemsInBag.length !== 0)
          ? (
            <>
              <div className="minicart-main">
                <div className="title">
                  <span className="bold display-inline">My Bag,</span>
                  {' '}
                  {numberOfItemsInBag}
                  {' '}
                  items
                </div>
                <div className="items">
                  <MinicartItems />
                </div>
              </div>
              <div className="total-price">
                <span>Total</span>
                <span>
                  {choosenCurrencySymbol}
                  {sumOfPrices}
                </span>
              </div>
              <div className="minicart-buttons">
                <Link onClick={() => closeBox()} className="view-bag" to="/cart">
                  View Bag
                </Link>
                <div className="checkout">
                  <span>Check out</span>
                </div>
              </div>
            </>
          )
          : (
            <div className="minicart-main">
              <div className="title">
                <span className="display-inline">Your bag is currently empty.</span>
              </div>
            </div>
          )}
      </div>
    </>
  );
}

Minicart.defaultProps = {
  openBox: PropTypes.func,
  closeBox: PropTypes.func,
};

Minicart.propTypes = {
  openBox: PropTypes.func,
  closeBox: PropTypes.func,
};

export default Minicart;
