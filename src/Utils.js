import SmallCartIcon from './Images/small-cart-icon.svg';

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

export const increaseQuantityOfProduct = ({cartId: passedCartId, itemsInBag, update, increaseNumberOfItemsInBag}) => {
    let items = [...itemsInBag]
    const newItems = items.map((item) => {
      let itemCopy = JSON.parse(JSON.stringify(item))
      let {cartId} = itemCopy;
      if(cartId === passedCartId){
        itemCopy.quantity += 1;
      }
      return itemCopy
    })
    update({name: 'itemsInBag', value: newItems})
    increaseNumberOfItemsInBag()
}

export const removeFromBag = ({cartId: passedCartId, itemsInBag, update, decreaseNumberOfItemsInBag}) => {

    let items = [...itemsInBag]
    let last = {isLast: false, found: false, index: 0};

    let newItems = items.map((item) => {
      let itemCopy = JSON.parse(JSON.stringify(item))
      let {cartId, quantity} = itemCopy;
      if(cartId === passedCartId){
        if(quantity > 1){
          itemCopy.quantity -= 1;
        }else{
          last = {isLast: true, index: items.indexOf(item)};
        }
      }
      return itemCopy;
    })

    if(last.isLast){
      newItems.splice(items.indexOf(last.index), 1);
    }
    update({name: 'itemsInBag', value: newItems})
    decreaseNumberOfItemsInBag()
}

export const generateDefaultAttributes = ({ product, update }) => {
    const { category } = product;
    const choosenAttributes = [];
    Object.keys(product).forEach((item) => {
      if((item === 'attributes')){
        Object.values(product[item]).forEach((attribute) => {
          const {id, items} = attribute;
          const attributeToAdd = {[id]: items[0]}
          choosenAttributes.push(attributeToAdd)
        })
      }
    })
    update({name: 'choosenAttributes', value: choosenAttributes})
    update({name: 'currentCategory', value: category})
    return choosenAttributes;
}

export const addInBag = ({ 
  item, 
  choosenAttributes, 
  itemsInBag, 
  notificationArr,
  notificationKey,
  numberOfItemsInBag, 
  increaseNumberOfItemsInBag, 
  update }) => {

    const product = JSON.parse(JSON.stringify(item));
    let items = [...itemsInBag]
    const {id} = product;

    product.choosenAttributes = choosenAttributes.length === 0 
                                ? generateDefaultAttributes({product: item, update: update}) 
                                : choosenAttributes;

    product.cartId = generateCartIdOfItem({id: id, choosenAttributes: product.choosenAttributes})
    const {cartId} = product;

    if(items.length !== 0){
      let found = false;
      items.forEach((item) => {
        const {cartId: itemCartId} = item;
        if(itemCartId === cartId){
          found = true;
          increaseQuantityOfProduct({cartId: itemCartId, itemsInBag: items, update, increaseNumberOfItemsInBag});
        }
      })
      if(!found){
        product.quantity = 1;
        showNotificationAndUpdateCart({
          product: product,
          notificationArr: notificationArr,
          notificationKey: notificationKey,
          itemsInBag: [...items, product],
          numberOfItemsInBag: numberOfItemsInBag + product.quantity,
          update        
        })
      }
    }else{
      product.quantity = 1;
      showNotificationAndUpdateCart({
        product: product,
        itemsInBag: [...items, product],
        notificationArr: notificationArr,
        notificationKey: notificationKey,
        numberOfItemsInBag: numberOfItemsInBag + product.quantity,
        update        
      })
    }
}

export const generateCartIdOfItem = ({choosenAttributes, id}) => {
    const generateIdForCart = id.split('-')
    let attributes = [...choosenAttributes]
    let transformedAttribute;

    attributes.forEach((attribute) => 
      {
      const {id, item} = attribute;
      if(id){
        transformedAttribute = {[id]: item}
      }else{
        transformedAttribute = attribute;
      }
      
      Object.keys(transformedAttribute).forEach((key) =>
      {
        const {id} = transformedAttribute[key];
        if(id === 'Yes'){
          const splitted = key.split(' ');
          const joined = splitted.join('-');
          generateIdForCart.push(joined.toLowerCase())
        }else if(id !== 'No'){
          generateIdForCart.push(id.toLowerCase())
        }
       })
      })
    return generateIdForCart.join('-'); 
}

export const showNotificationAndUpdateCart = ({ 
  product, 
  notificationArr, 
  notificationKey, 
  itemsInBag, 
  numberOfItemsInBag, 
  update }) => {

    const {brand, name} = product;

    const notification =
      `<div key='${notificationKey}' className='message'>
        <p><img src='${SmallCartIcon}' className='cart-icon' alt='Cart icon in notification' /> 
        Product ${brand} ${name} has been added in bag.</p>
      </div>`;

    const notificationToSend = notificationArr.concat(notification)

    update({name: 'notificationArr', value: notificationToSend})
    update({name: 'notificationKey', value: notificationKey + 1})
    update({name: 'itemsInBag', value: itemsInBag})
    update({name: 'numberOfItemsInBag', value: numberOfItemsInBag})
    setTimeout(removeNotification({notificationArr: notificationArr, notificationKey: notificationKey, update: update}), 3000);
}

export const removeNotification = ({notificationArr, notificationKey, update}) => {
   
    const { length } = notificationArr;
    const newArr = length ? notificationArr.slice(0, length - 1) : [];

    update({name: 'notificationArr', value: newArr})
    update({name: 'notificationKey', value: notificationKey - 1})
}