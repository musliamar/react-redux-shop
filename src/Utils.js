export const calculateSumOfAllPrices = ({itemsInBag, currencyToShow, update}) => {
  let items = [...itemsInBag]
  let sumOfAllPricesRaw = 0;

    for(const item in items){
        const {prices, quantity} = items[item];
        items[item].sumPriceOfItem = prices[currencyToShow].amount * quantity;
        items[item].sumPriceOfItemFixed = items[item].sumPriceOfItem.toFixed(2);
        sumOfAllPricesRaw = sumOfAllPricesRaw + items[item].sumPriceOfItem;
    }

    update({name: 'sumOfPrices', value: sumOfAllPricesRaw.toFixed(2)})
}