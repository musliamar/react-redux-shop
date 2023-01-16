/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

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
};

function quantityHelper({ cartId: passedCartId, itemsInBag: items }) {
  const newItems = items.map((item) => {
    const itemCopy = JSON.parse(JSON.stringify(item));
    const { cartId } = itemCopy;
    if (cartId === passedCartId) {
      itemCopy.quantity += 1;
    }
    return itemCopy;
  });
  return newItems;
}

export const generateDefaultAttributes = ({ productToGenerate }) => {
  const { category } = productToGenerate;
  const newChoosenAttributes = [];
  Object.keys(productToGenerate).forEach((item) => {
    if ((item === 'attributes')) {
      Object.values(productToGenerate[item]).forEach((attribute) => {
        const { id, items } = attribute;
        const attributeToAdd = { [id]: items[0] };
        newChoosenAttributes.push(attributeToAdd);
      });
    }
  });
  return { category, newChoosenAttributes };
};

export const slice = createSlice({
  name: 'store',
  initialState,
  reducers: {
    update: (state, action) => {
      state[action.payload.name] = action.payload.value;
    },
    increaseNumberOfItemsInBag: (prev) => {
      prev.numberOfItemsInBag += 1;
    },
    decreaseNumberOfItemsInBag: (prev) => {
      prev.numberOfItemsInBag -= 1;
    },
    increaseQuantityOfProduct: (state, action) => {
      state.itemsInBag = quantityHelper({
        cartId: action.payload.cartId,
        itemsInBag: state.itemsInBag,
      });
      state.numberOfItemsInBag += 1;
    },
    removeFromBag: (state, action) => {
      const { cartId: passedCartId } = action.payload;
      const items = [...state.itemsInBag];
      let last = { isLast: false, found: false, index: 0 };

      const newItems = items.map((item) => {
        const itemCopy = JSON.parse(JSON.stringify(item));
        const { cartId, quantity, prices } = itemCopy;
        if (cartId === passedCartId) {
          if (quantity > 1) {
            itemCopy.quantity -= 1;
          } else {
            last = {
              isLast: true,
              index: items.indexOf(item),
              amountToDecrease: prices[state.currencyToShow].amount,
            };
          }
        }
        return itemCopy;
      });

      if (last.isLast) {
        newItems.splice(items.indexOf(last.index), 1);
      }

      state.itemsInBag = newItems;
      state.numberOfItemsInBag -= 1;
    },
    addInBag: (state, action) => {
      const { item } = action.payload;
      const product = JSON.parse(JSON.stringify(item));
      const items = [...state.itemsInBag];
      const { id } = product;

      const generateCartIdOfItem = ({ newChoosenAttributes, newId }) => {
        const generateIdForCart = newId.split('-');
        const attributes = [...newChoosenAttributes];
        let transformedAttribute;

        attributes.forEach((attribute) => {
          const { attributeId, item: attributeItem } = attribute;
          if (attributeId) {
            transformedAttribute = { [attributeId]: attributeItem };
          } else {
            transformedAttribute = attribute;
          }

          Object.keys(transformedAttribute).forEach((key) => {
            const { id: transformedAttributeId } = transformedAttribute[key];
            if (transformedAttributeId === 'Yes') {
              const splitted = key.split(' ');
              const joined = splitted.join('-');
              generateIdForCart.push(joined.toLowerCase());
            } else if (transformedAttributeId !== 'No') {
              generateIdForCart.push(transformedAttributeId.toLowerCase());
            }
          });
        });
        return generateIdForCart.join('-');
      };

      const showNotificationAndUpdateCart = ({ newProduct }) => {
        const newNotificationArr = [...state.notificationArr];
        state.notificationArr = [...newNotificationArr, newProduct];
        state.itemsInBag = [...items, newProduct];
        state.numberOfItemsInBag += 1;
      };

      const attributesGenerator = ({ productToGenerate }) => {
        const generatedResult = generateDefaultAttributes({ productToGenerate });
        return generatedResult.newChoosenAttributes;
      };

      product.choosenAttributes = state.choosenAttributes.length === 0
        ? attributesGenerator({ productToGenerate: item })
        : state.choosenAttributes;

      product.cartId = generateCartIdOfItem({
        newId: id,
        newChoosenAttributes: product.choosenAttributes,
      });
      const { cartId } = product;

      if (items.length !== 0) {
        let found = false;
        items.forEach((singleItem) => {
          const { cartId: itemCartId } = singleItem;
          if (itemCartId === cartId) {
            found = true;
            state.itemsInBag = quantityHelper({ cartId: itemCartId, itemsInBag: state.itemsInBag });
            state.numberOfItemsInBag += 1;
          }
        });
        if (!found) {
          product.quantity = 1;
          showNotificationAndUpdateCart({ newProduct: product });
        }
      } else {
        product.quantity = 1;
        showNotificationAndUpdateCart({ newProduct: product });
      }
    },
  },
});

export const {
  update,
  addInBag,
  increaseQuantityOfProduct,
  removeFromBag,
  increaseNumberOfItemsInBag,
  decreaseNumberOfItemsInBag,
} = slice.actions;

export default slice.reducer;
