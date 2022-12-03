import { Component } from 'react'
import ArrowUp from '../../Images/arrow-up.svg';
import { connect } from 'react-redux'
import { update } from '../../Store';
import { openBox } from '../../Utils'

class Actions extends Component {

    changeCurrency(currency) { 
        const { defaultCategory, update } = this.props;
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
    
        update({name: 'choosenCurrency', value: currency})
        update({name: 'currentlyOpen', value: ''})
        update({name: 'currencyToShow', value: currencyToShow})
    }

    render() {

        const {
            currenciesList,
            choosenCurrency, 
            currentlyOpen,
            } = this.props;
        
        const {label: choosenCurrencyLabel, symbol: choosenCurrencySymbol} = choosenCurrency;

        return(
            <>
                <span className="tooltip-text currency-tooltip">Change currency</span>
                <div onClick={() => {openBox('currency')}} className='first-currency'>
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
                        className={choosenCurrencyLabel === currencyLabel && 'selected'}
                        onClick={() => {this.changeCurrency(currency)}} 
                        key={currencySymbol}>
                            {currencySymbol} {currencyLabel}
                        </li>
                    )
                })}
                </ul>
                </>
            )}
}

const mapStateToProps = (state) => ({
    defaultCategory: state.defaultCategory,
    currenciesList: state.currenciesList,
    choosenCurrency: state.choosenCurrency,
    currentlyOpen: state.currentlyOpen
})

const mapDispatchToProps = () => ({ 
    update
});
  
export default connect(mapStateToProps, mapDispatchToProps())(Actions);