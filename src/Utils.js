import { decreaseNumberOfItemsInBag, increaseNumberOfItemsInBag, update } from './Store';
import SmallCartIcon from './Images/small-cart-icon.svg';

export const increaseQuantityOfProduct = (props) => {
    const {cartId: passedCartId, itemsInBag: items} = props;
    items.forEach((item) => {
      let {cartId, quantity} = item;
      if(cartId === passedCartId){
        item.quantity = quantity + 1;
      }
    })
    update({name: 'itemsInBag', value: items})
    increaseNumberOfItemsInBag()
  }

export const removeFromBag = (props) => {
    const {cartId: passedCartId, itemsInBag: items} = props;
    items.forEach((item) => {
      let {cartId, quantity} = item;
      if(cartId === passedCartId){
        if(quantity > 1){
          item.quantity = quantity - 1;
        }else{
          items.splice(items.indexOf(item), 1);
        }
      }
    })
    update({name: 'itemsInBag', value: items})
    decreaseNumberOfItemsInBag()
}

export const generateDefaultAttributes = (props) => {
    console.log(this.props)
    const { category } = props;
    const choosenAttributes = [];
    Object.keys(props).forEach((item) => {
      if((item === 'attributes')){
        Object.values(props[item]).forEach((attribute) => {
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

  export const addInBag = (props) => {
    const {item} = props;
    const product = JSON.parse(JSON.stringify(item));
    const {id} = product;
    const {choosenAttributes, itemsInBag, numberOfItemsInBag, itemsInBag: items} = this.props;

    product.choosenAttributes = choosenAttributes.length === 0 
                                ? generateDefaultAttributes(item) 
                                : choosenAttributes;

    product.cartId = generateCartIdOfItem({id: id, choosenAttributes: product.choosenAttributes})
    const {cartId} = product;

    if(!(items.length === 0)){
      let found = false;
      items.forEach((item) => {
        const {cartId: itemCartId} = item;
        if(itemCartId === cartId){
          found = true;
          increaseQuantityOfProduct(itemCartId);
        }
      })
      if(!found){
        product.quantity = 1;
        showNotificationAndUpdateCart({
          product: product,
          itemsInBag: [...itemsInBag, product],
          numberOfItemsInBag: numberOfItemsInBag + product.quantity        
        })
      }
    }else{
      product.quantity = 1;
      showNotificationAndUpdateCart({
        product: product,
        itemsInBag: [...itemsInBag, product],
        numberOfItemsInBag: numberOfItemsInBag + product.quantity        
      })
    }
}

export const generateCartIdOfItem = ({choosenAttributes, id}) => {
    const generateIdForCart = id.split('-')
    let transformedAttribute;

    choosenAttributes.map((attribute) => 
      {
      const {id, item} = attribute;
      if(id){
        transformedAttribute = {[id]: item}
      }else{
        transformedAttribute = attribute;
      }
      const cartIdArray = Object.keys(transformedAttribute).map((key) =>
      {
        const {id} = transformedAttribute[key];
        if(id === 'Yes'){
          const splitted = key.split(' ');
          const joined = splitted.join('-');
          generateIdForCart.push(joined.toLowerCase())
        }else if(!(id === 'No')){
          generateIdForCart.push(id.toLowerCase())
        }
        return generateIdForCart})
      return cartIdArray})
    return generateIdForCart.join('-'); 
  }

  export const showNotificationAndUpdateCart = ({ product, itemsInBag, numberOfItemsInBag }) => {
    const {notificationKey, notificationArr} = this.state;
    const {brand, name} = product;

    const notification =
      <div key={notificationKey} className='message'>
        <p><img src={SmallCartIcon} className='cart-icon' alt='Cart icon in notification' /> 
        Product {brand} {name} has been added in bag.</p>
      </div>;

    this.setState({
      ...this.state, 
      notificationArr: notificationArr.concat(notification),
      notificationKey: notificationKey + 1
    });

    update({name: 'itemsInBag', value: itemsInBag})
    update({name: 'numberOfItemsInBag', value: numberOfItemsInBag})
    setTimeout(this.removeNotification, 3000);
  }

  export const removeNotification = () => {
    const {notificationArr, notificationKey} = this.state;
    const {length} = notificationArr;
    const newArr = length ? notificationArr.slice(0, length - 1) : [];

   this.setState({
      ...this.state,
      notificationArr: newArr,
      notificationKey: notificationKey - 1
    });
  }

  export const openBox = (props) => {
    console.log(this.props)
    const { currentlyOpen } = this.props;
    if(currentlyOpen === props){
      update({name: 'currentlyOpen', value: ''})
    }else{
      update({name: 'currentlyOpen', value: props})
    }
  }

  export const closeBox = () => {
    update({name: 'currentlyOpen', value: ''})
  }