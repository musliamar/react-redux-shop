import { Component } from 'react'
import ArrowUp from '../../Images/arrow-up.svg';
import { connect } from 'react-redux'

class Actions extends Component {

    render() {
        
        const {
            currenciesList,
            choosenCurrency, 
            openBox,
            currentlyOpened,
            changeCurrency
            } = this.props;
        
        const {label: choosenCurrencyLabel, symbol: choosenCurrencySymbol} = choosenCurrency;

        return(
            <>
                <span className="tooltip-text currency-tooltip">Change currency</span>
                <div onClick={() => {openBox('currency')}} className='first-currency'>
                    <span>{choosenCurrencySymbol}</span>
                    {currentlyOpened === 'currency' 
                    ? <img className='currency-arrow-icon' src={ArrowUp} alt='Currency switcher arrow up'/>
                    : <img className='currency-arrow-icon rotate' src={ArrowUp} alt='Currency switcher arrow down'/>}
                </div>
                <ul className={currentlyOpened === 'currency' ? 'box currency-box display-flex' : 'box display-none'}>
                {currenciesList.map((currency) => {
                    const {label: currencyLabel, symbol: currencySymbol} = currency;
                    return (
                        <li 
                        className={choosenCurrencyLabel === currencyLabel ? 'selected': null}
                        onClick={() => {changeCurrency(currency)}} 
                        key={currencySymbol}>
                            {currencySymbol} {currencyLabel}
                        </li>
                    )
                })}
                </ul>
                </>
            )}
}

const mapStateToProps = (state) => {
    return (state)
  }
  
export default connect(mapStateToProps)(Actions);
  