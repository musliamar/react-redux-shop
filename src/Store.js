import { createSlice } from '@reduxjs/toolkit'
import SmallCartIcon from './Images/small-cart-icon.svg';

const initialState = {
  choosenCurrency: '',
  currencyToShow: 0,
  itemsInBag: [],
  currentlyOpen: '',
  categoriesList: [],
  currenciesList: [],
  currentCategory: '',
  defaultCategory: '',
  numberOfItemsInBag: 0,
  sumOfPrices: 0,
  choosenAttributes: [],
  notificationArr: [],
  notificationKey: 0
}

function quantityHelper({ cartId: passedCartId, itemsInBag: items }) {
  const newItems = items.map((item) => {
    let itemCopy = JSON.parse(JSON.stringify(item))
    let {cartId} = itemCopy;
    if(cartId === passedCartId){
      itemCopy.quantity += 1;
    }
    return itemCopy
  })
  return newItems
}

export const slice = createSlice({
  name: 'store',
  initialState,
  reducers: {
    update: (state, action) => {
      state[action.payload.name] = action.payload.value
    },
    increaseNumberOfItemsInBag: (prev) => {
      prev.numberOfItemsInBag += 1
    },
    decreaseNumberOfItemsInBag: (prev) => {
      prev.numberOfItemsInBag -= 1
    },
    increaseQuantityOfProduct: (state, action) => {
      state.itemsInBag = quantityHelper({ cartId: action.payload.cartId, itemsInBag: state.itemsInBag})
      state.numberOfItemsInBag += 1
    },
    removeFromBag: (state, action) => {
      const { cartId: passedCartId } = action.payload
      let items = [...state.itemsInBag]
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
      state.itemsInBag = newItems
      state.numberOfItemsInBag -= 1
    },
    addInBag: (state, action) => {

      const { item } = action.payload
      const product = JSON.parse(JSON.stringify(item));
      let items = [...state.itemsInBag]
      const {id} = product;

      const generateCartIdOfItem = ({ newChoosenAttributes, newId }) => {
        const generateIdForCart = newId.split('-')
        let attributes = [...newChoosenAttributes]
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

      const generateDefaultAttributes = ({ productToGenerate }) => {
        const { category } = productToGenerate;
        const newChoosenAttributes = [];
        Object.keys(product).forEach((item) => {
          if((item === 'attributes')){
            Object.values(product[item]).forEach((attribute) => {
              const {id, items} = attribute;
              const attributeToAdd = {[id]: items[0]}
              newChoosenAttributes.push(attributeToAdd)
            })
          }
        })
        state.choosenAttributes = newChoosenAttributes
        state.currentCategory = category
    }

      const showNotificationAndUpdateCart = ({ newItemsInBag, newProduct, newNumberOfItemsInBag}) => {
        const {brand, name} = newProduct;
        const notification =
            `<div key='${state.notificationKey}' className='message'>
              <p><img src='${SmallCartIcon}' className='cart-icon' alt='Cart icon in notification' /> 
                Product ${brand} ${name} has been added in bag.</p>
                </div>`;

        const notificationToSend = state.notificationArr.concat(notification)
        state.notificationArr = notificationToSend
        state.notificationKey = state.notificationKey + 1
        state.itemsInBag = newItemsInBag
        state.numberOfItemsInBag = newNumberOfItemsInBag
        setTimeout(removeNotification(), 3000);
      }

      const removeNotification = () => {
        const { length } = state.notificationArr;
        const newArr = length ? state.notificationArr.slice(0, length - 1) : [];
        state.notificationArr = newArr
        state.notificationKey = state.notificationKey - 1
      }

      product.choosenAttributes = state.choosenAttributes.length === 0 
                                ? generateDefaultAttributes({ productToGenerate: item }) 
                                : state.choosenAttributes;

      product.cartId = generateCartIdOfItem({newId: id, newChoosenAttributes: product.choosenAttributes})
      const {cartId} = product;

      if(items.length !== 0){
        let found = false;
        items.forEach((item) => {
          const {cartId: itemCartId} = item;
          if(itemCartId === cartId){
            found = true;
            state.itemsInBag = quantityHelper({ cartId: itemCartId, itemsInBag: state.itemsInBag})
            state.numberOfItemsInBag += 1
          }
        })
        if(!found){
          product.quantity = 1;
          showNotificationAndUpdateCart({
            newProduct: product,
            newItemsInBag: [...items, product],
            newNumberOfItemsInBag: state.numberOfItemsInBag + product.quantity      
          })
        }
      }else{
        product.quantity = 1;
        showNotificationAndUpdateCart({
          newProduct: product,
          newItemsInBag: [...items, product],
          newNumberOfItemsInBag: state.numberOfItemsInBag + product.quantity
        })
      }
    }
  },
})

export const { 
  update,
  addInBag,
  increaseQuantityOfProduct,
  removeFromBag,
  increaseNumberOfItemsInBag,
  decreaseNumberOfItemsInBag } = slice.actions

export default slice.reducer