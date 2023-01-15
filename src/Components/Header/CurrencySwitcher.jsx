import React from 'react';
import ArrowUp from '../../Images/arrow-up.svg';
import { update } from '../../Store';
import { useSelector, useDispatch } from "react-redux";

function Actions({ openBox }) {

    const dispatch = useDispatch();
    const defaultCategory = useSelector((state) => state.defaultCategory)
    const currenciesList = useSelector((state) => state.currenciesList)
    const choosenCurrency = useSelector((state) => state.choosenCurrency)
    const currentlyOpen = useSelector((state) => state.currentlyOpen)

    const changeCurrency = ({ currency }) => { 
        const {sampleProductPrice} = defaultCategory;
        const {label: currencyLabel} = currency;
        let currencyToShow;
        for(const priceLabel in sampleProductPrice){
          const {currency} = sampleProductPrice[priceLabel];
          const {label} = currency;
    
          if(currencyLabel === label){
            currencyToShow = priceLabel;
          }
        }
        dispatch(update({name: 'choosenCurrency', value: currency}))
        dispatch(update({name: 'currentlyOpen', value: ''}))
        dispatch(update({name: 'currencyToShow', value: currencyToShow}))
    }
        
    const {label: choosenCurrencyLabel, symbol: choosenCurrencySymbol} = choosenCurrency;

        return(
            <>
                <span className="tooltip-text currency-tooltip">Change currency</span>
                <div onClick={() => openBox({toOpen: 'currency'})} className='first-currency'>
                    <span>{choosenCurrencySymbol}</span>
                    {currentlyOpen === 'currency' 
                    ? <img className='currency-arrow-icon' src={ArrowUp} alt='Currency switcher arrow up'/>
                    : <img className='currency-arrow-icon rotate' src={ArrowUp} alt='Currency switcher arrow down'/>}
                </div>
                <ul className={currentlyOpen === 'currency' ? 'box currency-box display-flex' : 'box display-none'}>
                {currenciesList.map((currency) => {
                    const {label: currencyLabel, symbol: currencySymbol} = currency;
                    return (
                        <li 
                        className={choosenCurrencyLabel === currencyLabel ? 'selected' : null}
                        onClick={() => changeCurrency({ currency: currency })} 
                        key={currencySymbol}>
                            {currencySymbol} {currencyLabel}
                        </li>
                    )
                })}
                </ul>
                </>
            )}
  
export default Actions;