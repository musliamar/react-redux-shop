import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import ArrowUp from '../../Images/arrow-up.svg';
import { update } from '../../Store';
import './CurrencySwitcher.css';

function Actions({ openBox }) {
  const dispatch = useDispatch();
  const defaultCategory = useSelector((state) => state.defaultCategory);
  const currenciesList = useSelector((state) => state.currenciesList);
  const choosenCurrency = useSelector((state) => state.choosenCurrency);
  const currentlyOpen = useSelector((state) => state.currentlyOpen);

  const changeCurrency = ({ currency: passedCurrency }) => {
    const { sampleProductPrice } = defaultCategory;
    const { label: currencyLabel } = passedCurrency;

    const currencyToShow = Object.values(sampleProductPrice)
      .findIndex((sample) => currencyLabel === sample.currency.label);

    dispatch(update({ name: 'choosenCurrency', value: passedCurrency }));
    dispatch(update({ name: 'currentlyOpen', value: '' }));
    dispatch(update({ name: 'currencyToShow', value: currencyToShow }));
  };

  const { label: choosenCurrencyLabel, symbol: choosenCurrencySymbol } = choosenCurrency;

  return (
    <>
      <span className="tooltip-text currency-tooltip">Change currency</span>
      <div
        role="button"
        tabIndex={0}
        onKeyUp={() => openBox({ toOpen: 'currency' })}
        onClick={() => openBox({ toOpen: 'currency' })}
        className="first-currency"
      >
        <span>{choosenCurrencySymbol}</span>
        {currentlyOpen === 'currency'
          ? <img className="currency-arrow-icon" src={ArrowUp} alt="Currency switcher arrow up" />
          : <img className="currency-arrow-icon rotate" src={ArrowUp} alt="Currency switcher arrow down" />}
      </div>
      <div className={currentlyOpen === 'currency' ? 'box currency-box display-flex' : 'box display-none'}>
        {currenciesList.map((currency) => {
          const { label: currencyLabel, symbol: currencySymbol } = currency;
          return (
            <span
              role="button"
              tabIndex={0}
              className={choosenCurrencyLabel === currencyLabel ? 'currency-item selected' : 'currency-item'}
              onKeyUp={() => changeCurrency({ currency })}
              onClick={() => changeCurrency({ currency })}
              key={currencySymbol}
            >
              {currencySymbol}
              {' '}
              {currencyLabel}
            </span>
          );
        })}
      </div>
    </>
  );
}

Actions.defaultProps = {
  openBox: PropTypes.func,
};

Actions.propTypes = {
  openBox: PropTypes.func,
};

export default Actions;
